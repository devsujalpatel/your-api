import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyAccessToken } from "@/lib/jwt";
import {logger} from "@/lib/winston";

import type { Request, Response, NextFunction } from "express";

import type { Types } from "mongoose";


const authenticate = (req: Request, res: Response, next: NextFunction) => {
const authHeader = req.headers.authorization;

console.log(authHeader)

}

export default authenticate