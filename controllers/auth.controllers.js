import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  console.log("Login Called");
  const { username, email, password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Password is required"));
  }
  if (!username && !email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email or username is required"));
  }

  const criteria = email ? { email } : { username };

  const existingUser = await User.findOne(criteria);
  if (!existingUser) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          null,
          "User not found, If you don't have a registered account, Please register your account first"
        )
      );
  }

  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials"));
  }

  const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const userObj = existingUser.toObject
    ? existingUser.toObject()
    : { ...existingUser };
  delete userObj.password;

  return res
    .cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .status(200)
    .json(
      new ApiResponse(200, { user: userObj }, "User logged in successfully")
    );
});

export const register = asyncHandler(async (req, res) => {
  console.log("Called");
  const { username, email, password, dateOfBirth, mobileNumber } = req.body;
  if (!username || !email || !password || !dateOfBirth) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required!"));
  }

  try {
    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "User with this email already exists!")
        );
    }

    const existingUserWithUsername = await User.findOne({ username });
    if (existingUserWithUsername) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "User with this username already exists!")
        );
    }

    const newUser = await User.create({
      username,
      email,
      password,
      dateOfBirth,
      mobileNumber,
    });

    const userObj = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete userObj.password;

    const token = jwt.sign({ _id: userObj._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .status(201)
      .json(
        new ApiResponse(201, { user: userObj }, "User registered successfully")
      );
  } catch (error) {
    console.log("Error: ", error.message);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal server error: ", error.message)
      );
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  console.log("first");
  res.status(200).json({ Hi: "Hi! How are you?" });
});

export const getProfile = asyncHandler(async (req, res) => {
  console.log("Called me");
  const user = req.user;
  if (!user) {
    return res.status(401).json(ApiResponse(401, null, "Unauthorized access"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  const user = req.user;
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});
