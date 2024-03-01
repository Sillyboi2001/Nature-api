import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const handleCastError = (err: AppError) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404)
}

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
    console.log(error)

    if(error.kind === 'ObjectId') error = handleCastError(error)
    setErrorProd(error, res)
  }
};
export default GlobalErrorHandler;
