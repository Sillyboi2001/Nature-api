import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import sanitizeMongo from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import GlobalErrorHandler from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import reviewRouter from './routes/reviewRoutes';
import AppError from './utils/appError';

const app = express();
//Global middlewares
//Setting  http headers
app.use(helmet());
// Logging development  requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Setting api request limit from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour',
});
app.use('/api', limiter);
//Body parser
app.use(express.json({ limit: '20kb' }));
// Data sanitization  against NoSql injection
app.use(sanitizeMongo());
// Prevent parameter pollution
app.use(hpp())

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

export default app;
