import express from 'express';
import { signUp, login } from '../controllers/authController';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { forgotPassword, resetPassword } from '../controllers/authController';

const userRouter = express.Router();

userRouter.route('/signup').post(signUp);

userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPassword);

userRouter.route('/resetPassword/:token').patch(resetPassword);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
