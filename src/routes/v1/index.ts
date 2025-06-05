import { Router } from 'express';

const router = Router();

// Routes

import authRoutes from '@/routes/v1/auth';

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Live',
    status: 'ok',
    version: '1.0.0',
    timesamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;
