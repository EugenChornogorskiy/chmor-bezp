import { Pool } from 'pg';

describe('PostgreSQL Integration', () => {
  let pool;
  
  beforeAll(async () => {
    pool = new Pool({
      host: process.env.PG_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'test_db',
    });
  });
  
  test('should create items table', async () => {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'items'
      );
    `);
    expect(result.rows[0].exists).toBe(true);
  });
  
  test('should insert and retrieve pokemon', async () => {
    await pool.query(
      'INSERT INTO items(name, data) VALUES($1, $2) ON CONFLICT DO NOTHING',
      ['test-pokemon', { name: 'test-pokemon', hp: 100 }]
    );
    
    const result = await pool.query('SELECT * FROM items WHERE name = $1', ['test-pokemon']);
    expect(result.rows[0].data.name).toBe('test-pokemon');
  });
});