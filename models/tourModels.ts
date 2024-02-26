import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  durationDays: {
    type: Number,
    default: 5,
  },
  price: {
    type: Number,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have maxgroup size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  imageCover: {
    type: String,
    required: true
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [String],
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
