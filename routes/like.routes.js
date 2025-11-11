import express from "express";
import { checkLogin } from "../middlewares/auth.middleware.js";
import { checkLike, updateLike } from "../controllers/like.controllers.js";

const router = express.Router();

router.post("/update-like", checkLogin, updateLike);

router.get("/check-like/:newsId", checkLogin, checkLike);

export default router;