import { Request, Response } from 'express';

const getAllUsers = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

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
