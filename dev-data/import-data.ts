import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '../.env'})

const db = process.env.DATABASE_URL as string;

mongoose.connect(db).then(() => console.log('Database is connected'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

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

console.log(process.argv);
