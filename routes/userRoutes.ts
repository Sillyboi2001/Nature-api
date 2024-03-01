import express from 'express';
import signUp from '../controllers/authController';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.route('/signup').post(signUp);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
