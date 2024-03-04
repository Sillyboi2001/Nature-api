import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: AppError) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404)
}

const handleDuplicateFieldsDB = (err: AppError) => {
  const fieldName = err.keyValue ? Object.keys(err.keyValue)[0] : 'Unknown Field';
  const fieldValue = err.keyValue ? err.keyValue[fieldName] : 'Unknown Value';
  const message = `Duplicate field value: ${fieldValue}. Please use another value for ${fieldName}!`;
  return new AppError(message, 400);
}

const handleValidationErr = (err: AppError) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWT = () => new AppError('Invalid web token. Please login again', 401)

const handleJWTExpires = () => new AppError('Your token has expired. Please login again', 401)

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const setErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log the error
    console.error('Error:', err)
    // send a generic message
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    })
  }
}

const GlobalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  }
  if(process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if(error.kind === 'ObjectId') error = handleCastErrorDB(error)
    if(error.code === 11000) error = handleDuplicateFieldsDB(error)
    if(error._message === 'Tour validation failed') error = handleValidationErr(error)
    if(error.name === 'JsonWebTokenError') error = handleJWT()
    if(error.name === 'TokenExpiredError') error = handleJWTExpires()

    setErrorProd(error, res)
  }
};
export default GlobalErrorHandler;
