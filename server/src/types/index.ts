import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  userData: {
    email: string,
    username: string
  };
}

export { AuthenticatedRequest };
