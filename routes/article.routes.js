import express from "express";
import { getArticles, getFilteredNews } from "../controllers/article.controllers.js";

const router = express.Router();

router.post("/get-articles", getArticles);

router.post("/get-filtered-news", getFilteredNews);

export default router;