import jwt from 'jsonwebtoken';
// Custom  modules
import config from '@/config';

// Types

import { Types } from 'mongoose';
export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    subject: 'refreshToken',
  });
};
