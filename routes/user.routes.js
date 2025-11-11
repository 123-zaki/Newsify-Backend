import express from "express";
import { checkLogin } from "../middlewares/auth.middleware.js";
import { updateLocation } from "../controllers/user.controllers.js";

const router = express.Router();

router.patch("/update-location", checkLogin, updateLocation);

export default router;