import { Router } from 'express';
import { param, query, body } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

import User from '@/models/user';

import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import getAllUser from '@/controllers/v1/user/get_all_user';
import getUser from '@/controllers/v1/user/get_user';
import deleteUser from '@/controllers/v1/user/delete_user';

const router = Router();
router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw new Error('Username is already taken');
      }
    }),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (value) => {
      const emailExists = await User.exists({ email: value });
      if (emailExists) {
        throw new Error('Email is already in use');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('URL is invalid')
    .isLength({ max: 100 })
    .withMessage('Website must be less than 100 characters'),
  validationError,
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  validationError,
  getAllUser,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['user', 'admin']),
  param('userId').notEmpty().isMongoId().withMessage('User ID is invalid'),
  validationError,
  getUser,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('User ID is invalid'),
  validationError,
  deleteUser,
)

export default router;
