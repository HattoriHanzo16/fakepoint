import { Request, Response, NextFunction } from 'express';
import { endpointStore } from '../store';

export const fakeEndpointMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip management API routes
  if (req.path.startsWith('/api/management')) {
    return next();
  }

  const { method, path } = req;
  const fakeEndpoint = endpointStore.getByPathAndMethod(path, method);

  if (fakeEndpoint) {
    // Set custom headers if defined
    if (fakeEndpoint.response.headers) {
      Object.entries(fakeEndpoint.response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    // Return the fake response
    return res.status(fakeEndpoint.response.status).json(fakeEndpoint.response.body);
  }

  // If no fake endpoint matches, continue to next middleware
  next();
}; 