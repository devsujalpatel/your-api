import { Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
  };
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'User is required'],
    masLength: [20, 'Username must be less than 20 characters'],
    unique: [true, 'Username must be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    masLength: [20, 'Email must be less than 50 characters'],
    unique: [true, 'Email must be unique'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    emum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not supported',
    },
    default: 'user',
  },
  firstName: {
    type: String,
    maxlength: [20, 'First name must be less than 20 characters'],
  },
});
