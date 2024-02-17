import express from 'express';
import fs from 'fs';

const app = express();

const port = 3000;

const tours =  JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'));

app.use(express.json())

app.get('/api/v1/tours', (req, res) => {
	res.status(200).json({ 
		status: 'success',
    result: tours.length,
    data: {
      tours,
    }
	})
})

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
  console.log('done')
})
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})