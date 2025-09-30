import config from '@/config';
import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import User from '@/models/user';

import type { Request, Response } from 'express';

interface QueryType {
    status?: 'draft' | 'published';
}


const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultREsLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await Blog.countDocuments();

    const user = await User.findById(userId).select('role').lean().exec();

    const query: QueryType = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '--createdAt --updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while fetching blogs', error);
  }
};

export default getAllBlogs;
