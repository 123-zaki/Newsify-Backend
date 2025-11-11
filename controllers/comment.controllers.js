import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import News from "../models/news.model.js";
import User from "../models/user.model.js";

export const createIndependentComment = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing news id"));
  }

  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Text is missing or empty"));
  }

  const existingNews = await News.findById(newsId);
  if (!existingNews) {
    return res.status(404).json(new ApiError(404, "News not found"));
  }

  const newIndComment = await Comment.create({
    newsId: new mongoose.Types.ObjectId(newsId),
    commentedBy: req.user._id,
    text,
  });

  if (!newIndComment) {
    res
      .status(500)
      .json(new ApiError(500, "Something went wrong, Comment creation failed"));

    throw new ApiError(500, "Something went wrong, comment creation failed");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newIndComment,
        "Independent comment created successfully"
      )
    );
});

export const createChildComment = asyncHandler(async (req, res) => {
  const { newsId, commentId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing news id"));
  }

  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing comment id"));
  }

  const { text, repliedTo } = req.body;
  if (!text || text.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Text is missing or empty"));
  }

  if (
    repliedTo &&
    (typeof repliedTo !== "string" ||
      repliedTo.length === 0 ||
      repliedTo?.trim()?.[0] !== "@")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Replied To is not a valid user name"));
  }

  let repliedToUser = null;

  if (repliedTo && repliedTo.trim() !== "") {
    repliedToUser = await User.findOne({
      username: repliedTo?.trim()?.slice(1),
    });

    if (!repliedToUser) {
      return res
        .status(404)
        .json(new ApiResponse(400, null, "Replied To user does not exist"));
    }
  }

  const existingNews = await News.findById(newsId);
  if (!existingNews) {
    return res.status(404).json(new ApiError(404, "News not found"));
  }

  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    return res.status(404).json(new ApiError(404, "Parent comment not found"));
  }

  if (existingComment.newsId.toString() !== existingNews._id.toString()) {
    return res
      .status(409)
      .json(
        new ApiError(
          409,
          "Comment does not belongs to the provided news(news id)"
        )
      );
  }

  const newChildComment = await Comment.create({
    newsId: new mongoose.Types.ObjectId(newsId),
    commentedBy: req.user._id,
    repliedTo: repliedToUser ? repliedToUser._id : null,
    text,
    parentComment: new mongoose.Types.ObjectId(commentId),
  });

  if (!newChildComment) {
    res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong, Child comment creation failed")
      );

    throw new ApiError(
      500,
      "Something went wrong, child comment creation failed"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newChildComment,
        "Child comment created successfully"
      )
    );
});

export const getIndependentComments = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing news id"));
  }

  const independentComments = await Comment.find({
    newsId: new mongoose.Types.ObjectId(newsId),
    status: "visible",
    isDeleted: false,
    parentComment: null,
  }).populate("commentedBy", "username");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        independentComments,
        "Independent comments fetched successfully"
      )
    );
});

export const getChildComments = asyncHandler(async (req, res) => {
  const { newsId, commentId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing news id"));
  }

  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing comment id"));
  }

  const childComments = await Comment.find({
    newsId: new mongoose.Types.ObjectId(newsId),
    parentComment: new mongoose.Types.ObjectId(commentId),
    status: "visible",
    isDeleted: false,
  }).populate("commentedBy repliedTo", "username");

  return res
    .status(200)
    .json(
      new ApiResponse(200, childComments, "Child comments fetched successfully")
    );
});

export const getCommentsQuantity = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res.status(400).json(new ApiError(400, "Invalid or empty news id"));
  }

  const existingNews = await News.findById(newsId);
  if (!existingNews) {
    return res.status(404).json(new ApiResponse(404, null, "News not found"));
  }

  const comments = await Comment.find({ newsId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments.length,
        `Comments quantity for newsId: ${newsId} fetched successfully`
      )
    );
});
