import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Share from "../models/share.model.js";
import { ApiError } from "../utils/ApiError.js";
import News from "../models/news.model.js";

export const update = asyncHandler(async (req, res) => {
  console.log("update share called")
  const { newsId } = req.params;
  
  console.log("news id: ", newsId);
  console.log("Shared by: ", req.user._id);

  if (!newsId || !mongoose.isValidObjectId(newsId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing News Id"));
  }

  const alreadyShared = await Share.findOne({
    sharedBy: req.user._id,
    newsId: new mongoose.Types.ObjectId(newsId),
  });

  if (alreadyShared) {
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          null,
          "This news is already shared by logged in user"
        )
      );
  }

  const existingNews = await News.findById(newsId);
  if (!existingNews) {
    return res.status(404).json(new ApiResponse(404, null, "News not found"));
  }

  // For handling concurrent request
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const newShare = await new Share({
      sharedBy: req.user._id,
      newsId: new mongoose.Types.ObjectId(newsId),
    }).save({ session });

    if (!newShare) {
      return  res.status(500).json(new ApiError(500, "New share creation failed"));
    }

    await session.commitTransaction();

    console.log("New share: ", newShare);

    return res
      .status(201)
      .json(new ApiResponse(201, newShare, "New share created successfully"));
  } catch (error) {
    await session.abortTransaction();
    console.log("Error while creating share: ", error.message);
    return res.status(500).json(
        new ApiResponse(500, null, "Internal server error")
    );
  } finally {
    await session.endSession();
  }
});
