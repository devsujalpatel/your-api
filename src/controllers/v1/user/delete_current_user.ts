import { logger } from '@/lib/winston';

import { v2 as cloudinary } from 'cloudinary';

import User from '@/models/user';
import Blog from '@/models/blog';

import type { Request, Response } from 'express';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    if (blogs.length === 0) {
      await User.deleteOne({ _id: userId });
      logger.info('A user account has been deleted', { userId });
      res.sendStatus(204);
      return;
    }

    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple blog banners deleted from Cloudinary', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', { userId, blogs });

    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', { userId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while deleting user', error);
  }
};

export default deleteCurrentUser;
