import mongoose, { Query, Document, Types } from 'mongoose';

interface Review extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: Types.ObjectId[];
  user: Types.ObjectId[];
}

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre<Query<any[], any>>(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model<Review>('Review', reviewSchema);

export default Review;
