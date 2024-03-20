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

tourRouter
  .route('/monthlyPlan/:year')
  .get(
    protectRoutes,
    restrictUser('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protectRoutes, restrictUser('admin', 'lead-guide'), createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(protectRoutes, restrictUser('admin', 'lead-guide'), updateTour)
  .delete(protectRoutes, restrictUser('admin', 'lead-guide'), deleteTour);

export default tourRouter;
