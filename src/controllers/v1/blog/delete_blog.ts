import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import type { Request, Response } from 'express';

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.params;

    const user = await Blog.findByIdAndDelete(blogId)
      .select('-__v')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    logger.info('Blog Deleted Successfully');

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while Deleting blog', error);
  }
};

export default deleteBlog;
