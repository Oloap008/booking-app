import express, { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be atleast 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "fail", message: errors.array() });
    }

    try {
      const dbUser = await User.findOne({
        email: req.body.emal,
      });

      if (dbUser)
        return res
          .status(400)
          .json({ status: "fail", message: "User already exists" });

      const user = await User.create(req.body);

      const token = jwt.sign(
        { userID: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ status: "success", message: "User registed OK" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "error", message: "Something went wrong" });
    }
  }
);

export default router;
