import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import User from '@/models/user';

import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;

    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permission',
      });
      logger.warn(`A User tried to update a blog without permission`, {
        userId,
        blog,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      console.log('Hello');

      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }

    console.log('Hello 2');

    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await Blog.findByIdAndUpdate(blogId, blog);

    console.log('Hello 3');

    logger.info('Blog Updated Successfully', { blog });

    res.status(200).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while updating blog', error);
  }
};

export default updateBlog;
