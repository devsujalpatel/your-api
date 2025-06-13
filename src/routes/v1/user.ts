import { Router } from 'express';
import { param, query, body } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

import User from '@/models/user';

import getCurrentUser from '@/controllers/v1/user/get_current_user';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';

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
  validationError,
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  updateCurrentUser,
);

export default router;
