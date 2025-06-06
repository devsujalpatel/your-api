import { Router } from 'express';
import { body } from 'express-validator';

// Controllers
import register from '@/controllers/v1/auth/register';

// Middlewares

import validationError from '@/middlewares/validationError';

// Models
import User from '@/models/user';

const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (value) => {
      const userExists = await User.findOne({ email: value });
      if (userExists) {
        throw new Error('User with this email already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be admin or user'),
  validationError,
  register,
);

export default router;
