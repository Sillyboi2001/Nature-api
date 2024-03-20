import { Request, Response, NextFunction } from 'express';
import asyncError from '../utils/asyncError';
import AppError from '../utils/appError';
import { Model, Document } from 'mongoose';
import ApiFeatures from '../utils/apiFeatures';

type PopulateOptions = string | { path: string; select?: string };

const getAll = <Doc extends Document>(Model: Model<Doc>) => asyncError(async (req: Request, res: Response) => {
  // To allow nested GET routes
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .fieldLimits()
    .pagination();
  const doc = await features.query;
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {
      data: doc,
    },
  });
});

const getOne = <Doc extends Document>(Model: Model<Doc>, popOptions?: PopulateOptions) => asyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let query = await Model.findById(req.params.id)
    if(popOptions) query = (query as any).populate(popOptions)
    const doc = await query;

    if (!doc) {
      return next(new AppError(`Can't find document with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  },
);

const createOne = <Doc extends Document>(Model: Model<Doc>) =>
  asyncError(async (req: Request, res: Response) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

const updateOne = <Doc extends Document>(Model: Model<Doc>) =>
  asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`Can't find document with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const deleteOne = <Doc extends Document>(Model: Model<Doc>) =>
  asyncError(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
      return next(new AppError(`Can't find tour with that ID`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export { getAll, createOne, updateOne, deleteOne, getOne };
