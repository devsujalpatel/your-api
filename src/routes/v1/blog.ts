import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

import createBlog from '@/controllers/v1/blog/create_blog';


const upload = multer();

const router = Router()


router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    createBlog
)


export default router