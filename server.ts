import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from './models/tourModels';

process.on('uncaughtException', err => {
  process.exit(1)
})

dotenv.config();
import app from './app';

const port = 3000;

const db = process.env.DATABASE_URL as string;

mongoose.connect(db).then(() => console.log('Database is connected'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/tours.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log("Data import successful")
  } catch(err) {
    console.log(err)
  }
  process.exit()
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log("Data deleted")
  } catch(err) {
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Handling unhandled rejections
process.on('unhandledRejection', err => {
  server.close(() => {
    process.exit(1)
  })
})

