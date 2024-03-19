import mongoose, { Document, Query, Types } from 'mongoose';

interface StartLocation {
  type: string;
  coordinates: number[];
  address: string;
  description: string;
}

interface Location extends StartLocation {
  day: number;
}

interface Tour extends Document {
  name: string;
  description: string;
  durationDays: number;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  maxGroupSize: number;
  difficulty: string;
  priceDiscount: number;
  summary: string;
  imageCover: string;
  images: string;
  createdAt: Date;
  startDates: Date;
  secretTour: boolean;
  startLocation: StartLocation;
  locations: Location[];
  guides: Types.ObjectId[];
}

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name is required'],
      unique: true,
      maxlength: 40,
      minlength: 10,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Query middleware
tourSchema.pre<Query<any[], any>>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre<Query<any[], any>>(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model<Tour>('Tour', tourSchema);

export default Tour;
