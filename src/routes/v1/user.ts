import { Router } from 'express';
import { param, query, body } from 'express-validator';

import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

import User from '@/models/user';

const router = Router();
router.get('/current', authenticate, authorize(['admin', 'user']));

export default router;
