import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

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
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
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
    lastName: {
      type: String,
      maxlength: [20, 'Last name must be less than 20 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, 'Website address must be less than 100 characters'],
      },
      facebook: {
        type: String,
        maxlength: [
          100,
          'Facebook profile url must be less than 100 characters',
        ],
      },
      instagram: {
        type: String,
        maxlength: [
          100,
          'Instagram profile url must be less than 100 characters',
        ],
      },
      linkedin: {
        type: String,
        maxlength: [
          100,
          'Linkedin profile url must be less than 100 characters',
        ],
      },
      x: {
        type: String,
        maxlength: [100, 'X profile url must be less than 100 characters'],
      },
      youtube: {
        type: String,
        maxlength: [
          100,
          'Youtube channel url must be less than 100 characters',
        ],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 0);
  next();
});

export default model<IUser>('User', userSchema);
