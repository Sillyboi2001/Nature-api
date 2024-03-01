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
  isModified: (path: string) => boolean;
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

const User = mongoose.model('User', userSchema);

export default User;
