import { logger } from '@/lib/winston';
import config from '@/config';

import Token from '@/models/token';

// Types

import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;

    if (!refreshToken) {
      res.sendStatus(204);
      return;
    }
    // Delete refresh token from db
    await Token.deleteOne({ token: refreshToken });
    logger.info('Refresh token deleted successfully', {
      userId: req.userId,
      token: refreshToken,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.sendStatus(204);
    logger.info('Logout successful', { userId: req.userId });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    logger.error('Error during logout', err);
  }
};

export default logout;
