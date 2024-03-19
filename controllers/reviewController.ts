import { Request, Response, NextFunction } from 'express';
import asyncError from '../utils/asyncError';
import Review from '../models/reviewModels';
import { createOne, updateOne, deleteOne } from './factoryController';

const getAllReviews = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);
    res.status(200).json({
      status: 'success',
      result: reviews.length,
      data: {
        reviews,
      },
    });
  },
);

const getTourAndUserIds = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user?.id;
  next();
};
const createReview = createOne(Review);

const updateReview = updateOne(Review);

const deleteReview = deleteOne(Review);

export {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getTourAndUserIds,
};
