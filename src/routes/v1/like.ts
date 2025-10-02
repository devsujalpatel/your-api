import { Router } from 'express';

// Middleware

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import likeBlog from '@/controllers/v1/like/like_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  likeBlog
);

export default router;
