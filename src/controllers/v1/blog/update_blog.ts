import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';

import Blog from '@/models/blog';

import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.params;
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;
    const cleanContent = purify.sanitize(content);

    const blog = await Blog.findById(blogId).select('-__v').lean().exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }
    


    const updateBlog = await Blog.findByIdAndUpdate(blogId, {
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    }).select('-__v').lean().exec();

    if(!updateBlog){
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    logger.info('Blog Updated Successfully', updateBlog);
 

    res.status(201).json({
      blog: updateBlog,
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
