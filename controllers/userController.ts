import { Request, Response, NextFunction } from 'express';
import User from '../models/userModels';
import asyncError from '../utils/asyncError';
import AppError from '../utils/appError';
import { getAll, getOne, updateOne, deleteOne } from './factoryController';

const filter = (obj: Record<string, any>, ...allowedFields: any[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const createUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user?.id;
  next()
}

const updateCurrentUser = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if password is present in the body
    if (req.body.password || req.body.confirmPassword) {
      return next(
        new AppError(
          'This route is not for password updates. Update your password in /updateMyPassword',
          400,
        ),
      );
    }
    // Filter out unwanted field names that are not allowed to be updated
    const filterObjects = filter(req.body, 'name', 'email');
    //Update the user fields
    const updateUser = await User.findByIdAndUpdate(
      req.user?.id,
      filterObjects,
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(200).json({
      status: 'success',
      data: {
        user: updateUser,
      },
    });
  },
);

const deleteCurrentUser = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

const getAllUsers = getAll(User)

const getUser = getOne(User)
// Do not update password here and it's only for administrators
const updateUser = updateOne(User);

const deleteUser = deleteOne(User);

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  getMe,
  deleteCurrentUser,
};
