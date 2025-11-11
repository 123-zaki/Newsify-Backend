import express from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/auth.controllers.js";
import { checkLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/me", checkLogin, getProfile);

router.post("/forgot-password", forgotPassword);

router.get("/logout", checkLogin, logout);

export default router;
