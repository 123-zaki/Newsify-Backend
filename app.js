import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cookieParser());

// router imports
import authRouter from "./routes/auth.routes.js";
import articleRouter from "./routes/article.routes.js";
import nearbyNewsRouter from "./routes/nearbyNews.routes.js";
import userRouter from "./routes/user.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import shareRouter from "./routes/share.routes.js";

// routes declaration
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/nearby/news', nearbyNewsRouter);
app.use('/api/v1/users', userRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/news/share", shareRouter);

export {app};