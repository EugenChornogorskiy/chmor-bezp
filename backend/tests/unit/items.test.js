import request from 'supertest';
import app, { shutdown } from '../../backend.js';
 
jest.mock('../../backend.js', () => {
  const original = jest.requireActual('../../backend.js');
  return {
    ...original,
    auth: (req, res, next) => {
      req.user = { sub: 'test-user-123' };
      next();
    }
  };
});

describe('Items API', () => {
  afterAll(async () => {
    await shutdown();
  });

  test('GET /items should return array', async () => {
    const response = await request(app)
      .get('/items')
      .set('Authorization', 'Bearer fake-token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  test('GET /items should have user object', async () => {
    const response = await request(app)
      .get('/items')
      .set('Authorization', 'Bearer fake-token');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });
});