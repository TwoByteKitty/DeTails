import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

export const verifyToken = (
  request: Request<{}, {}, { token?: string }, { token?: string }>,
  response: Response,
  next: NextFunction
) => {
  const token = request.body.token || request.query.token || request.headers['x-access-token'];

  if (!token) {
    return response.status(403).json({ message: 'A token is required for authentication', type: 'AUTH' });
  }
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as Secret);
    request.userToken = decoded;
  } catch (err) {
    return response.status(401).json({ message: 'Invalid Token', type: 'AUTH' });
  }
  return next();
};
