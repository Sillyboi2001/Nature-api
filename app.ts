import express, { Request, Response } from 'express';
import morgan from 'morgan';
import fs from 'fs';

const app = express();

const port = 3000;

interface Tour {
  id: number;
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

const tours: Tour[] = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'),
);

app.use(morgan('dev'))
app.use(express.json());

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
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req: Request, res: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data.json`,
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
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour...',
    },
  });
};

const deleteTour = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// User controller
const getAllUsers = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not defined yet"
  })
}

const createUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not defined yet"
  })
}

const getUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not defined yet"
  })
}

const updateUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not defined yet"
  })
}

const deleteUser = (req: Request, res: Response) => {
  return res.status(500).json({
    status: "error",
    message: "This route is not defined yet"
  })
}


// Routes
const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter
  .route('/')
  .get(getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter
  .route('/')
  .get(getAllUsers).post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
