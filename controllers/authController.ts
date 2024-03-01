import { Request, Response, NextFunction } from 'express';
import asyncError from '../utils/asyncError';
import User from '../models/userModels';

const signUp = asyncError(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await User.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  })
});

export default signUp;
