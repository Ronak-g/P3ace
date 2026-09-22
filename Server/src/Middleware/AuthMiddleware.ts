import type { NextFunction, Request, Response } from "express";
import { AccessTokenPayload } from "../services/Jwt.Services.ts";
import type { ObjectId } from "mongodb";

export type userdata = {
  _id: string;
  name: string;
  email: string;
};

declare global{
  namespace Express{
    interface Request {
      user? : userdata
    }
  }
}

export interface AuthenticatedRequest extends Request{
  user: userdata;
}


export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = AccessTokenPayload(token);
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

