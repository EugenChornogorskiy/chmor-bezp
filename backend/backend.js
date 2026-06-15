import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
import clientProm from 'prom-client'; 
import { createClient } from 'redis';
import fs from 'fs';
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import axios from "axios";

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

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);

    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
} 
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, getKey, { audience: CLIENT_ID, issuer: `${AUTH_URL}/application/o/${SLUG}/`, }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

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
      data JSONB
    )
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
redisClient.connect()
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
 
app.post('/items', auth, async (req, res) => {
  const item = {
    name: req.body.name,
    ...req.body
  };

  const userId = req.user.sub; 

  await pgPool.query(
    'INSERT INTO items(name, data, user_id) VALUES($1, $2, $3)',
    [item.name, item, userId]
  );

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

    return res.json({
      access_token: tokens.access_token,
      id_token: tokens.id_token, 
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
init().then(() => {
  console.log("Database initialized");
}).catch(err => {
  console.error("Database init failed:", err);
});

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