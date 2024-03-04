import { Request, Response, NextFunction } from 'express';
import User from '../models/userModels';
import asyncError from '../utils/asyncError';

const getAllUsers = asyncError(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find()
  res.status(200).json({
    status: 'sucess',
    users,
  });
});

const createUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const getUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const updateUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const deleteUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

export { getAllUsers, createUser, getUser, updateUser, deleteUser };
