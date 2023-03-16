import { JwtPayload } from 'jsonwebtoken';

export {};

declare global {
  namespace Express {
    export interface Request {
      userToken?: string | JwtPayload;
    }
  }
}
