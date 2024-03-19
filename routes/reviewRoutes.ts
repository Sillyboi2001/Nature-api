import express from 'express';
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getTourAndUserIds,
} from '../controllers/reviewController';
import { protectRoutes, restrictUser } from '../controllers/authController';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(protectRoutes, getAllReviews)
  .post(protectRoutes, restrictUser('user'), getTourAndUserIds, createReview);

reviewRouter
  .route('/:id')
  .patch(protectRoutes, updateReview)
  .delete(protectRoutes, deleteReview);
export default reviewRouter;
