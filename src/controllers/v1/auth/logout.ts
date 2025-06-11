import { logger } from "@/lib/winston";
import config from "@/config";

import Token from "@/models/token";

// Types

import type { Request, Response } from "express";
import type { Types } from "mongoose";

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
 
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
