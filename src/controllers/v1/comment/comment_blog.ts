import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import Comment from '@/models/comment';

import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as CommentData;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      content: cleanContent,
      userId,
      blogId,
    });

    logger.info('New comment creted', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count updated successfully', {
      userId,
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.status(200).json({
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error while commenting blog', error);
  }
};

export default commentBlog;
