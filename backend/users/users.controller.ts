import { RequestHandler } from "express";
import { sign, verify } from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { ErrorWithStatus, StandardResponse } from "../utils/common";
import { User, UserModel } from "./users.model";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

// SIGN IN CONTROLLER
export const signin: RequestHandler<
  unknown,
  StandardResponse<{ accessToken: string }>,
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

    const payload = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    };

    const accessToken = sign(payload, process.env.SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = sign(payload, process.env.SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

// SIGN UP CONTROLLER
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
      
    });

    res.status(201).json({ success: true, data: results._id.toString() });
  } catch (err) {
    next(err);
  }
};

//REFRESH TOKEN CONTROLLER
export const refreshToken: RequestHandler<
  unknown,
  StandardResponse<{ accessToken: string }>,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie) throw new ErrorWithStatus("No refresh token", 401);
    if (!process.env.SECRET) throw new ErrorWithStatus("Secret not found", 401);

    const decoded = verify(tokenFromCookie, process.env.SECRET) as {
      _id: string;
      fullname: string;
      email: string;
    };

    const payload = {
      _id: decoded._id,
      fullname: decoded.fullname,
      email: decoded.email,
    };

    const newAccessToken = sign(payload, process.env.SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    res
      .status(200)
      .json({ success: true, data: { accessToken: newAccessToken } });
  } catch (err) {
    next(err);
  }
};

export const signout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res
      .status(200)
      .json({ success: true, message: "Signed out successfully." });
  } catch (err) {
    next(err);
  }
};