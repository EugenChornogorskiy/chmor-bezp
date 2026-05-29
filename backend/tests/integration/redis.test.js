import redis from 'redis';

describe('Redis Integration', () => {
  let client;
  
  beforeAll(async () => {
    client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await client.connect();
  });
  
  test('should set and get cache', async () => {
    await client.setEx('test-key', 60, JSON.stringify({ data: 'test' }));
    const result = await client.get('test-key');
    expect(JSON.parse(result)).toEqual({ data: 'test' });
  });
});