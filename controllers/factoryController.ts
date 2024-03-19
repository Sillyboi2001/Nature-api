import { Request, Response, NextFunction } from 'express';
import asyncError from '../utils/asyncError';
import AppError from '../utils/appError';
import { Model, Document } from 'mongoose';

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
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`Can't find tour with that ID`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export { createOne, updateOne, deleteOne };
