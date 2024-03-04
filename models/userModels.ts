import mongoose, {
  Document,
  CallbackWithoutResultAndOptionalError,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface User extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
  confirmPassword?: string;
  passwordChangedAt: Date;
  isModified: (path: string) => boolean;
  correctPassword: (password: string, userPassword: string) => Promise<boolean>;
  changedPassword(path?: number): boolean;
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
const User = mongoose.model<User>('User', userSchema);

export default User;
