import express from "express"
import { checkLogin } from "../middlewares/auth.middleware.js";
import { update } from "../controllers/share.controller.js";

const router = express.Router();

router.get("/update/:newsId", checkLogin, update);

export default router;