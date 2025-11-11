import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

export const checkLogin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwtToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedUser._id).select("-password");

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in login check: ", error.message);
    // Return a JSON 401 response so clients get a clear error instead of
    // continuing to the controller with req.user undefined.
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized request"));
  }
};
