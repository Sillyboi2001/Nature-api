import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from './models/tourModels';
import User from './models/userModels';
import Review from './models/reviewModels';

dotenv.config();
import app from './app';

const port = 3000;

const db = process.env.DATABASE_URL as string;

mongoose.connect(db).then(() => console.log('Database is connected'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/reviews.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews)
    console.log('Data import successful');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Handling unhandled rejections
process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
