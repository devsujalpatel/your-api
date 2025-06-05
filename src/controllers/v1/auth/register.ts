import { logger } from '@/lib/winston';
import config from '@/config';
import { getUername } from '@/utils';

// Models
import User from '@/models/user';

// Types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = getUername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });


    
    res.status(201).json({
      message: 'New user Created',
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error('Error during user registeration', err);
  }
};

export default register;
