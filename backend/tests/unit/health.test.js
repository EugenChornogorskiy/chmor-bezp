describe('Health Check Tests', () => {
  test('GET /health should return status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200); 
  });
});