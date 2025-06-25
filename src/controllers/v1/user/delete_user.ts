import config from '@/config';
import { logger } from '@/lib/winston';

import User from '@/models/user';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId)
      .select('-__v')
      .lean()
      .exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while deleting the user', error);
  }
};

export default deleteUser;
