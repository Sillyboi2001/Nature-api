import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  prefilTour,
  tourStats,
  getMonthlyPlan
} from '../controllers/tourController';
import { protectRoutes } from '../controllers/authController';

const tourRouter = express.Router();

// tourRouter.param('id', checkId);

tourRouter.get('/topTours', prefilTour, getAllTours);

tourRouter.route('/tourStats').get(tourStats);

tourRouter.route('/monthlyPlan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(protectRoutes, getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
