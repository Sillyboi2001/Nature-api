import { Request, Response, NextFunction } from 'express';
import User from '../models/userModels';
import asyncError from '../utils/asyncError';
import AppError from '../utils/appError';

const filter = (obj: Record<string, any>, ...allowedFields: any[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

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

const updateCurrentUser = asyncError(async(req: Request, res: Response, next: NextFunction) => {
  // Check if password is present in the body
  if(req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates. Update your password in /updateMyPassword', 400))
  }
  // Filter out unwanted field names that are not allowed to be updated
  const filterObjects = filter(req.body, 'name', 'email')
  //Update the user fields
  const updateUser = await User.findByIdAndUpdate(req.user?.id, filterObjects, {
    new: true,
    runValidators: true,
  })
  return res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
})

const deleteCurrentUser = asyncError(async(req: Request, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user?.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  });
})

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

export { getAllUsers, createUser, getUser, updateUser, updateCurrentUser, deleteUser, deleteCurrentUser };
