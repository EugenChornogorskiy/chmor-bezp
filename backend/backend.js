import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
import clientProm from 'prom-client'; 
import { createClient } from 'redis';
import fs from 'fs';
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import axios from "axios";
import { verify } from 'crypto';

const { Pool } = pkg;
const app = express();
const register = new clientProm.Registry();
const PORT = process.env.BACKEND_PORT;
const startTime = Date.now();
const AUTH_URL = process.env.AUTH_URL;
const CLIENT_ID = process.env.CLIENT_ID; 
const REDIRECT_URI = process.env.REDIRECT_URI;
const SLUG = process.env.SLUG;

clientProm.collectDefaultMetrics({ register });

const httpRequestsTotal = new clientProm.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpRequestDuration = new clientProm.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

app.use(express.json({ limit: '10mb' })); 
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
    end({ method: req.method, route: req.route?.path || req.path });
  });
  next();
}); 
let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  next();
});  
const client = jwksClient({
  jwksUri: `${AUTH_URL}/application/o/${SLUG}/jwks/`
}); 
async function getUserRole(userEmail) {
    if (!userEmail) return 'user';
    
    try {
        const result = await pgPool.query(
            'SELECT role FROM user_roles WHERE user_email = $1',
            [userEmail]
        );
        
        if (result.rows.length > 0) {
            return result.rows[0].role;
        }
          
        return 'user';
    } catch (err) {
        console.error('Error getting user role:', err);
        return 'user';
    }
}
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
} 
function auth(req, res, next) {
  const header = req.headers.authorization;
  console.log("HEADER:", header); 

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];
  console.log("TOKEN RECEIVED:", token?.substring(0, 50) + "..."); 

  jwt.verify(token, getKey, { 
    audience: CLIENT_ID, 
    issuer: `${AUTH_URL}/application/o/${SLUG}/`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
        console.error("VERIFICATION ERROR:", err.message); 
        return res.status(401).json({
          error: err.name,
          message: err.message
        });
    }
    
    console.log("TOKEN VERIFIED for user:", decoded.sub); 
    req.user = decoded;
    next();
  });
}
 
async function init() {
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      user_id TEXT,
      user_email TEXT,
      data JSONB
    )
  `);
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_email TEXT UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) 
  `);
  await pgPool.query(`
    INSERT INTO user_roles (user_email, role) 
    VALUES ('chornogorskiyzhenya@gmail.com', 'admin') 
    ON CONFLICT (user_email) DO NOTHING;
  `);  
  const count = await pgPool.query(`SELECT COUNT(*) FROM items`);

  if (parseInt(count.rows[0].count) === 0) {
    const raw = await fs.promises.readFile("pokemon.json", "utf-8");
    const data = JSON.parse(raw);
    for (const item of data) {
      await pgPool.query(
        'INSERT INTO items(name, data) VALUES($1, $2) ON CONFLICT (name) DO NOTHING',
        [item.name, item]
      );
    }

    console.log("Pokemons loaded into DB");
  }
}
function getUptime() {
  return Math.floor((Date.now() - startTime) / 1000);
}
  
const pgPool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
}); 

const redisClient = createClient({
  url: `redis://redis:6379`,
}); 
if (process.env.NODE_ENV !== 'test') {
  redisClient.connect()
}
const appConfig = {  instanceName: 'default', timeout: 30000, limit: 100, cacheTTL: 10 }; 
const instanceId = process.env.INSTANCE_ID || appConfig.instanceName || "default-instance";
 
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}); 

app.get('/items', auth, async (req, res) => {
  const result = await pgPool.query('SELECT data FROM items');

  res.json({
    user: req.user, 
    items: result.rows.map(r => r.data)
  });
});

app.get('/verify', auth, async (req, res) => { 

  res.json({
    verify:  "verified"
  });
});
app.get('/role', auth, async (req, res) => { 
  const email = req.query.email;
  if (!email) {
    res.status(403).json({
      message:  "unverified"
    });
  }
  const role = await getUserRole(email)
  res.json({
    role:  role
  });
});
app.post('/items', auth, async (req, res) => {
  const item = {
    name: req.body.name,
    ...req.body
  };

  const userId = req.user.sub; 
  const userEmail = req.user.email; 
  const result = await pgPool.query(
    'SELECT role FROM user_roles WHERE user_email = $1',
    [userEmail]
  );
  if (result.rows[0].role == 'admin') {
    await pgPool.query(
      'INSERT INTO items(name, data, user_id) VALUES($1, $2, $3)',
      [item.name, item, userId]
    );
  }
  else{
    res.status(403).json({ 
      message: "user not allowed "
    });
  } 

  res.status(201).json({
    item,
    createdBy: userId
  });
});
 
app.get('/stats', auth, async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "name required" });
  }

  const cacheKey = `stats:${req.user.sub}:${name}`;

  const cached = await redisClient.get(cacheKey);

  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(JSON.parse(cached));
  }

  const result = await pgPool.query(
    'SELECT data FROM items WHERE name = $1',
    [name]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }

  const pokemon = result.rows[0].data;

  const response = {
    pokemon,
    instanceId: process.env.INSTANCE_ID || "local",
    requestCount: 1,
    serverTime: new Date().toISOString(),
  };

  await redisClient.setEx(
    cacheKey,
    60,
    JSON.stringify(response)
  );

  res.set('X-Cache', 'MISS');
  res.json(response);
});
app.post('/auth/logout', auth, async (req, res) => {
    try {
        const userEmail = req.user.email;
        console.log(`User ${userEmail} is logging out`); 
        const pattern = `stats:${req.user.sub}:*`;
        let cursor = '0';
        do {
            const reply = await redisClient.scan(cursor, {
                MATCH: pattern,
                COUNT: 100
            });
            cursor = reply.cursor;
            for (const key of reply.keys) {
                await redisClient.del(key);
                console.log(`Deleted cache key: ${key}`);
            }
        } while (cursor !== '0');
         
        
        res.json({
            message: 'Successfully logged out',
            user: userEmail,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Logout error:', err); 
        res.json({
            message: 'Logged out (with errors)',
            error: err.message
        });
    }
});
app.post("/auth/callback", async (req, res) => {
  const { code,code_verifier } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const tokenResponse = await axios.post(
      `${AUTH_URL}/application/o/token/`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID, 
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: code_verifier,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
     
    const tokens = tokenResponse.data;
    const decodedToken = jwt.decode(tokens.access_token);
    const userEmail = decodedToken.email;
    await pgPool.query(
      'INSERT INTO user_roles (user_email, role) VALUES ($1, $2) ON CONFLICT (user_email) DO NOTHING',
      [userEmail, 'user']
    ); 
    const result = await pgPool.query(
      'SELECT role FROM user_roles WHERE user_email = $1',
      [userEmail]
    );
    return res.json({
      access_token: tokens.access_token,
      id_token: tokens.id_token, 
      role: result.rows[0].role
    });
  } catch (err) {
    return res.status(401).json({
      error: "Token exchange failed",
      details: err.response?.data || err.message,
    });
  }
}); 

app.get('/health', async (req, res) => {
  let pgStatus = 'down';
  let redisStatus = 'down';

  try {
    await pgPool.query('SELECT 1');
    pgStatus = 'up';
  } catch {}

  try {
    await redisClient.ping();
    redisStatus = 'up';
  } catch {}

  res.json({
    status: 'dev23232',
    uptime: getUptime(),
    postgres: pgStatus,
    redis: redisStatus,
    timeout: appConfig.timeout,
    limit: appConfig.limit
  });
});
if (process.env.NODE_ENV !== 'test') {
  init().then(() => {
    console.log("Database initialized");
  }).catch(err => {
    console.error("Database init failed:", err);
  });
}
let server 
if (process.env.NODE_ENV !== 'test') {  
  server = app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}
export default app;
export { init, shutdown, auth };
async function shutdown() { 
  await pgPool.end(); 
}
process.on('SIGTERM', async () => {
  console.log('SIGTERM');

  await redisClient.quit();
  await pgPool.end();

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}); 