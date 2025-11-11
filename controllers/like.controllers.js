import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Like from "../models/like.model.js";

export const updateLike = asyncHandler(async (req, res) => {
  console.log("Update like called!");

  const { liked, newsId } = req.body;
  if (typeof liked !== 'boolean') {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Liked flag must be boolean"));
  }

  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid news id"));
  }

  if (liked === true) {
    const likeDoc = await Like.updateOne(
      { newsId, likedBy: req.user._id },
      { $setOnInsert: { newsId: new mongoose.Types.ObjectId(newsId), likedBy: req.user._id } },
      { upsert: true, new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, likeDoc, "Like updated successfully")
    );
  } else if(liked === false) {
    const updatedLike = await Like.findOneAndDelete(
      { newsId: new mongoose.Types.ObjectId(newsId), likedBy: req.user._id }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedLike, "Like updated successfully")
    );
  }
});

export const checkLike = asyncHandler(async (req, res) => {
  console.log("Check like called!");

  const { newsId } = req.params;
  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid news id"));
  }
  console.log("news id: ", new mongoose.Types.ObjectId(newsId));
  console.log("user id: ", req.user._id);

  const like = await Like.findOne({likedBy: req.user._id, newsId: new mongoose.Types.ObjectId(newsId)});

  console.log("Like doc: ", like);

  return res.status(200).json(
    new ApiResponse(200, like ? true : false, "Like checked successfully")
  );
});