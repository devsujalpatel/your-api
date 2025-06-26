import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';

import Blog from '@/models/blog';

import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
  console.log("1");
  
  try {
      console.log("2");
      
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;
    const cleanContent = purify.sanitize(content);
    console.log("3");
    
    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });
    logger.info('New blog created', newBlog);
    console.log("4");
    
    res.status(201).json({
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while creating blog', error);
  }
};

export default createBlog;
