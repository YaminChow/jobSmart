import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { ErrorWithStatus, StandardResponse } from "../utils/common";
import { User, UserModel } from "./user.model";
import { model } from "mongoose";

export const signin: RequestHandler<
  unknown,
  StandardResponse<{ token: string }>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) throw new ErrorWithStatus("User not found", 404);

    if (!password) throw new ErrorWithStatus("Password not found", 404);
    const match = await compare(password, user.password);
    if (!match) throw new ErrorWithStatus("Passwords do not match", 401);

    if (!process.env.SECRET) throw new ErrorWithStatus("Secret not found", 401);

    const token = sign(
      {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      process.env.SECRET
    );

    res.status(200).json({ success: true, data: { token } });
  } catch (err) {
    next(err);
  }
};

export const signup: RequestHandler<
  unknown,
  StandardResponse<string>,
  User,
  unknown
> = async (req, res, next) => {
  try {
    const new_user = req.body;

    if (!new_user.password) throw new Error("Password is required");
    const hashed_password = await hash(new_user.password, 10);

    const results = await UserModel.create({
      ...req.body,
      password: hashed_password,
      picture_url: req.file?.path,
    });

    res.status(201).json({ success: true, data: results._id.toString() });
  } catch (err) {
    next(err);
  }
};
