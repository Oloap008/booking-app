import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["auth_token"];

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    req.userId = (decoded as JwtPayload).userID;

    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: "Unauthorized" });
  }
}
