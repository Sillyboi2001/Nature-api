import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const port = 3000;

const db = process.env.DATABASE_URL as string;

mongoose.connect(db).then(() => console.log('Database is connected'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
