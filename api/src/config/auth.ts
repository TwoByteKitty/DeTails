import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

export const verifyToken = (
  request: Request<{}, {}, { token?: string }, { token?: string }>,
  response: Response,
  next: NextFunction
) => {
  const token = request.body.token || request.query.token || request.headers['x-access-token'];

  if (!token) {
    return response.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as Secret);
    request.userToken = decoded;
  } catch (err) {
    return response.status(401).send('Invalid Token');
  }
  return next();
};
