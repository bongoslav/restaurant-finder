import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  userData: {
    userId: string,
  };
}

export { AuthenticatedRequest };
