import express from "express";
import { checkLogin } from "../middlewares/auth.middleware.js";
import {
  createChildComment,
  createIndependentComment,
  getChildComments,
  getCommentsQuantity,
  getIndependentComments,
} from "../controllers/comment.controllers.js";

const router = express.Router();

router.post("/create-ind-comment/:newsId", checkLogin, createIndependentComment);

router.post(
  "/create-child-comment/:newsId/:commentId",
  checkLogin,
  createChildComment
);

router.get("/ind-comments/:newsId", checkLogin, getIndependentComments);

router.get("/child-comments/:newsId/:commentId", checkLogin, getChildComments);

router.get("/get-comments-quantity/:newsId", checkLogin, getCommentsQuantity);

export default router;
