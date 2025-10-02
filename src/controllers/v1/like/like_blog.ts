import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import like from '@/models/like';

import type { Request, Response } from 'express';

const likeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const { userId } = req.body;
  try {
    const blog = await Blog.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(40404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const existingLike = await like.findOne({ blogId, userId }).lean().exec();

    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have already liked this blog',
      });
      return;
    }
    await like.create({ blogId, userId });

    blog.likesCount++;
    await blog.save();

    logger.info('Blog liked successfully', {
      blogId: blog._id,
      userId,
      likesCount: blog.likesCount,
    });

    res.status(200).json({
      likesCount: blog.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while liking blog', error);
  }
};

export default likeBlog;
