import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tourModels';
import ApiFeatures from '../utils/apiFeatures';
import asyncError from '../utils/asyncError';
import AppError from '../utils/appError';
import { createOne, updateOne, deleteOne } from './factoryController';

// const tours: Tour[] = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data.json`, 'utf-8'),
// );

// const checkId = (req: Request, res: Response, next: any, value: number) => {
// if (value > tours.length) {
//   return res.status(404).json({
//     status: 'fail',
//     message: 'Invalid ID',
//   });
// }
// next()
// }

const prefilTour = (req: Request, res: Response, next: NextFunction) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,summary,difficulty,durationDays';
  req.query.sort = '-price';
  next();
};

const getAllTours = asyncError(async (req: Request, res: Response) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldLimits()
    .pagination();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!tour) {
      return next(new AppError(`Can't find tour with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);

// const checkBody = (req: Request, res: Response, next: any) => {
//   if( !req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'error',
//       message: "Missing name or price"
//     })
//   }
//   next()
// }

const createTour = createOne(Tour);

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

// const deleteTour = asyncError(async (req: Request, res: Response, next: NextFunction) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if(!tour) {
//     return next(new AppError(`Can't find tour with that ID`, 404))
//   };
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

const tourStats = asyncError(async (req: Request, res: Response) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = asyncError(async (req: Request, res: Response) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numOfTours: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

export {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  prefilTour,
  tourStats,
  getMonthlyPlan,
};
