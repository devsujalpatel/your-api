import config from '@/config';
import { logger } from '@/lib/winston';

import User from '@/models/user';

import type { Request, Response } from 'express';

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultREsLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments();
    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();
    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while getting all users', error);
  }
};

export default getAllUser;
