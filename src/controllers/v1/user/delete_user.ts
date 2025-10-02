import config from '@/config';
import { logger } from '@/lib/winston';

import { v2 as cloudinary } from 'cloudinary';

import User from '@/models/user';
import Blog from '@/models/blog';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

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
