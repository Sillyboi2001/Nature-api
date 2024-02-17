import express from 'express';
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

app.use(express.json());

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
