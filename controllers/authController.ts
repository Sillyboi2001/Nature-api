import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import asyncError from '../utils/asyncError';
import User from '../models/userModels';
import AppError from '../utils/appError';
import sendEmail from '../utils/email';

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
      role: req.body.role,
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
    req.user = user;
    next();
  },
);

const restrictUser = (...roles: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError('You do not have access to perform this action', 403),
      );
    }
    next();
  };
};

const forgotPassword = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    //Check if email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('This email address does not exist', 404));
    }
    //Generate token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //Send to the users email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didnt forget your password.Ignore this email`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password token is valid for 10 minutes',
        message,
      });
      res.status(200).json({
        status: 'success',
        message: 'Token has been sent to your mail',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the mail.Please try again',
          500,
        ),
      );
    }
  },
);

const resetPassword = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user based  on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //Check if there's user and set the password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  },
);

export {
  signUp,
  login,
  protectRoutes,
  restrictUser,
  forgotPassword,
  resetPassword,
};
