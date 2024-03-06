import express from 'express';
import { signUp, login } from '../controllers/authController';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  deleteCurrentUser,
} from '../controllers/userController';
import { forgotPassword, resetPassword, updatePassword, protectRoutes } from '../controllers/authController';

const userRouter = express.Router();

userRouter.post('/signup', signUp);

userRouter.post('/login', login);

userRouter.post('/forgotPassword', forgotPassword);

userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.patch('/updateMyPassword', protectRoutes, updatePassword);

userRouter.patch('/updateMyData', protectRoutes, updateCurrentUser);

userRouter.delete('/deleteMyData', protectRoutes, deleteCurrentUser)

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
