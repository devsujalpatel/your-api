import { Router } from 'express';
import { body } from 'express-validator';

// Controllers
import register from '@/controllers/v1/auth/register';

// Middlewares

// Models

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
    .withMessage('Email is invalid'),
  register,
);

export default router;
