import mongoose, { Query } from 'mongoose';

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
    required: [true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either easy, medium or difficult'
    }
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
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
});

// Query middleware

tourSchema.pre<Query<any[], any>>(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })
  next()
})

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
