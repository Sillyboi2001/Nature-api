import express from 'express';
import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} from '../controllers/tourController';

const tourRouter = express.Router();

tourRouter.param('id', checkId);

tourRouter.route('/').get(getAllTours).post(checkBody, createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;
