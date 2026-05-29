import { auth } from '../../backend.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should return 401 when no token provided', () => {
    auth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token" });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat';
    
    auth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});