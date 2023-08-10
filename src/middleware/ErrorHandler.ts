import { Request, Response, NextFunction } from 'express';

class ErrorHandler {
  static handleException(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).send({ error: message });
  }
}

export default ErrorHandler;
