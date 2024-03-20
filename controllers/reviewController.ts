import { Request, Response, NextFunction } from 'express';
import Review from '../models/reviewModels';
import { getAll, getOne, createOne, updateOne, deleteOne } from './factoryController';

const getTourAndUserIds = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user?.id;
  next();
};

const getAllReviews = getAll(Review)

const getReview = getOne(Review)

const createReview = createOne(Review);

const updateReview = updateOne(Review);

const deleteReview = deleteOne(Review);

export {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getTourAndUserIds,
};
