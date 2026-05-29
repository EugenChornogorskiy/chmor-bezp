import app, { init, shutdown, auth } from '../../backend.js';

describe('Authentication Tests', () => {
    afterAll(async () => { 
        await shutdown();
    });
    
    test('should reject request without token', () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        
        auth(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "No token" });
    });

    test('should reject invalid token', () => {
        const req = { headers: { authorization: 'Bearer invalid-token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        
        auth(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
    });
});