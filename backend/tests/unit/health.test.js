import request from 'supertest';
import app, { shutdown } from '../../backend.js';

describe('Health Check', () => {
  afterAll(async () => {
    await shutdown();
  });

  test('GET /health should return 200 and status object', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('postgres');
    expect(response.body).toHaveProperty('redis');
  });

  test('GET /health should have uptime as number', async () => {
    const response = await request(app).get('/health');
    
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});