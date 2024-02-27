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

const tourRouter = express.Router();

// tourRouter.param('id', checkId);

tourRouter.route('/topTours').get(prefilTour, getAllTours);

tourRouter.route('/tourStats').get(tourStats);

tourRouter.route('/monthlyPlan/:year').get(getMonthlyPlan);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
