import express, { Request, Response} from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app = express();

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handling unhandled routes
app.all('*', (req: Request, res: Response, next: any) => {
  res.status(404).json({
    status: 'fail',
    message: `Cant't find ${req.originalUrl} on this server`
  })
})

export default app;
