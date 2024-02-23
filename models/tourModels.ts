import mongoose from 'mongoose';

interface Tour {
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  durationDays: {
    type: Number,
    default: 5,
  },
  price: {
    type: Number,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
