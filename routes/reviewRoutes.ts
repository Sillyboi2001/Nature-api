import express from 'express';
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getTourAndUserIds,
} from '../controllers/reviewController';
import { protectRoutes, restrictUser } from '../controllers/authController';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protectRoutes)

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictUser('user'), getTourAndUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(restrictUser('user', 'admin'), updateReview)
  .delete(restrictUser('user', 'admin'), deleteReview);
export default reviewRouter;
