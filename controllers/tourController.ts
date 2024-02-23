import { Request, Response } from 'express';
import fs from 'fs';

interface Tour {
  id: number;
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

const tours: Tour[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data.json`, 'utf-8'),
);

const checkId = (req: Request, res: Response, next: any, value: number) => {
  if (value > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next()
}

const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el: Tour) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const checkBody = (req: Request, res: Response, next: any) => {
  if( !req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'error',
      message: "Missing name or price"
    })
  }
  next()
}

const createTour = (req: Request, res: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour...',
    },
  });
};

const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export { getAllTours, createTour, getTour, updateTour, deleteTour, checkId, checkBody };
