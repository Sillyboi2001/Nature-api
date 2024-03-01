import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import GlobalErrorHandler from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import AppError from './utils/appError';

const app = express();
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.json())
console.log(process.env.NODE_ENV)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handling unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server`, 404))
})

app.use(GlobalErrorHandler)

export default app;
