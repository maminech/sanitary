import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    handlePrismaError(err, res);
    return;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    handleMulterError(err, res);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }

  // Validation errors
  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Handle Prisma errors
 */
const handlePrismaError = (err: any, res: Response): void => {
  switch (err.code) {
    case 'P2002':
      res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        field: err.meta?.target,
      });
      break;
    case 'P2025':
      res.status(404).json({
        success: false,
        message: 'Record not found',
      });
      break;
    case 'P2003':
      res.status(400).json({
        success: false,
        message: 'Foreign key constraint failed',
      });
      break;
    default:
      res.status(500).json({
        success: false,
        message: 'Database error',
      });
  }
};

/**
 * Handle Multer errors
 */
const handleMulterError = (err: any, res: Response): void => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'File size exceeds the limit (100MB)',
    });
    return;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({
      success: false,
      message: 'Unexpected field in file upload',
    });
    return;
  }

  res.status(400).json({
    success: false,
    message: err.message || 'File upload error',
  });
};

/**
 * Not found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Async handler wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
