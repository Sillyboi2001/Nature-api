import { Request, Response } from 'express';
import Tour from '../models/tourModels';
import ApiFeatures from '../utils/apiFeatures';

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

const prefilTour = (req: Request, res: Response, next: any) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,summary,difficulty,durationDays';
  req.query.sort = '-price';
  next();
};


const getAllTours = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// const checkBody = (req: Request, res: Response, next: any) => {
//   if( !req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'error',
//       message: "Missing name or price"
//     })
//   }
//   next()
// }

const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

export { getAllTours, createTour, getTour, updateTour, deleteTour, prefilTour };
