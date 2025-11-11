import express from "express";
import {
  getNearbyNews,
  uploadNews,
} from "../controllers/nearbyNews.controller.js";
import { checkLogin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/upload", checkLogin, upload.single("image"), uploadNews);
router.get("/surrounding", checkLogin, getNearbyNews);

export default router;
