import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import asyncError from '../utils/asyncError';
import User from '../models/userModels';
import AppError from '../utils/appError';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const secret = process.env.JWT_SECRET as string;

const signToken = (id: string) => {
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      passwordChangedAt: req.body.passwordChangedAt,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  },
);

const login = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Check if passwors or email exists
    if (!email || !password) {
      return next(new AppError('Please provide an email or password', 400));
    }
    // Validate the input credentials
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 401));

    // Return a jwt token
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  },
);

const protectRoutes = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Checking if there's a token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('Please log in to get access', 401));
    }
    //Verify the token
    const decode = jwt.verify(token, secret) as JwtPayload;
    //Check if the user exist
    const user = await User.findById(decode.id);
    if (!user) {
      return next(
        new AppError('The user with this token no longer exists', 401),
      );
    }
    //Check if password has been changed
    if (user.changedPassword(decode.iat)) {
      return next(
        new AppError('User recently changed password. Please login again', 401),
      );
    }
    // Grant access
    req.user = user
    next();
  },
);

export { signUp, login, protectRoutes };
