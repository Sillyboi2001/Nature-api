import mongoose, {
  Document,
  CallbackWithoutResultAndOptionalError,
  Query
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface User extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
  role: string;
  confirmPassword?: string;
  passwordChangedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  isModified: (path: string) => boolean;
  correctPassword: (password: string, userPassword: string) => Promise<boolean>;
  changedPassword(path?: number): boolean;
  generatePasswordResetToken: () => any;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'An email is required'],
    validate: [validator.isEmail, 'Provide a valid email '],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el: string) {
        // @ts-ignore
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre<User>(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    const user = this;
    if (!user.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
  },
);

userSchema.pre<User>(
  'save',
  function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
  },
);

userSchema.pre<Query<any[], any>>(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (
  password: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.changedPassword = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changeTimeStamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changeTimeStamp;
  }
  return false;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //In milliseconds

  return resetToken;
};

const User = mongoose.model<User>('User', userSchema);

export default User;
