import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://newsify-frontend-xfif.vercel.app"],
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



// // 404 handler - any unmatched route will hit this
// app.use((req, res, next) => {
//     const msg = `Route ${req.method} ${req.originalUrl} not found`;
//     return next(new ApiError(404, msg));
// });

// // Centralized error handler (JSON) - suitable for dev and production
// // - In dev: include error stack
// // - In production: hide stack for 5xx errors
// app.use((err, req, res, next) => {
//     // Ensure we have an Error-like object
//     const error = err instanceof Error ? err : new Error(String(err));

//     // Log full error server-side for diagnostics
//     console.error(error);

//     const status = err.statusCode || err.status || 500;
//     const message = err.message || (status === 500 ? 'Internal Server Error' : 'Error');

//     const payload = {
//         statusCode: status,
//         message,
//         data: null,
//         success: status < 400,
//     };

//     // Attach stack in development for easier debugging
//     if (process.env.NODE_ENV !== 'production') {
//         payload.stack = error.stack;
//     }

//     return res.status(status).json(new ApiResponse(status, payload.data, payload.message));
// });



export {app};