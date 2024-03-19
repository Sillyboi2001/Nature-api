import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  prefilTour,
  tourStats,
  getMonthlyPlan,
} from '../controllers/tourController';
import { protectRoutes, restrictUser } from '../controllers/authController';
import reviewRouter from './reviewRoutes';

const tourRouter = express.Router();

// tourRouter.param('id', checkId);

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/topTours').get(prefilTour, getAllTours);

tourRouter.route('/tourStats').get(tourStats);

tourRouter.route('/monthlyPlan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(protectRoutes, getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoutes, restrictUser('admin', 'lead-guide'), deleteTour);

export default tourRouter;
