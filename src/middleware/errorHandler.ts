import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { AppError } from '../errors.js'


export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction   // must be declared even if unused
) => {
  // Known errors (ones you threw intentionally) have a status code
  const status = err instanceof AppError ? err.statusCode : 500

  // Unknown errors (bugs, DB crashes) default to 500
  // Only log those — expected errors like 404 are noise
  if (status === 500) console.error(err)

  res.status(status).json({
    success: false,
    message: err.message,
    // expose stack trace locally to help debugging, never in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}