import { Request, Response, NextFunction } from 'express';
import { invalid_400, server_500 } from '../routes/genericResponses';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';

const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization');
  // Check if not token
  if (!token) {
    return invalid_400(res, 'No token, authorization denied');
  }
  // Verify token
  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return invalid_400(res, 'Token is not valid');
      } else {
        if (decoded) {
          req.user = decoded.user;
          next();
        }
      }
    });
  } catch (err: any) {
    console.error('something wrong with auth middleware');
    server_500(res);
  }
};
export { auth };
