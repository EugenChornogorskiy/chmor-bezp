import app, { init, shutdown } from '../../backend.js';
const request = require('supertest');
describe('Health Check Tests', () => {
    afterAll(async () => {
        const { shutdown } = await import('../../backend.js');
        await shutdown();
    });
  test('GET /health should return status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200); 
  });
});