import express from 'express';
import { signUp, login } from '../controllers/authController';
import {
  getAllUsers,
  getUser,
  updateUser,
  getMe,
  updateCurrentUser,
  deleteUser,
  deleteCurrentUser,
} from '../controllers/userController';
import {
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoutes,
  restrictUser,
} from '../controllers/authController';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
userRouter.use(protectRoutes);

userRouter.patch('/updateMyPassword', updatePassword);

userRouter.get('/me', getMe, getUser);

userRouter.patch('/updateMyData', updateCurrentUser);
userRouter.delete('/deleteMyData', deleteCurrentUser);

userRouter.use(restrictUser('admin'));

userRouter.route('/').get(getAllUsers);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
