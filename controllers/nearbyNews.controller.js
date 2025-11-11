import { uploadOnCloudinary } from "../cloudinary.js";
import News from "../models/news.model.js";
import User from "../models/user.model.js";
import { getNewsInRadius } from "../services/getNewsInRadius.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadNews = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  let location = null;
  if (req.body.location) {
    try {
      location = typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location;
    } catch (err) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid location format"));
    }
  }
  const image = req.file;

  console.log("Title: ", title);
  console.log("Description: ", description);
  console.log("Image: ", image);

    if (!title || !description) {
      return res.status(400).json(new ApiResponse(400, null, "Title and description are required!"));
    }

    let urlToImage = null;

    if(image && image.path) {
        const response = await uploadOnCloudinary(image.path);
        urlToImage = response.secure_url;
    }

    const user = await User.findById(req.user._id);

    const news = await News.create({
      title,
      description,
      createdBy: req.user._id,
      location: {
        // latitude: location ? location.lat : user.location.latitude,
        // longitude: location ? location.long : user.location.longitude
        type: "Point",
        coordinates: location ? [location.long, location.lat] : user.location.coordinates
      },
      urlToImage
    });

    return res.status(201).json(new ApiResponse(201, news, "News uploaded successfully"));
});

export const getNearbyNews = asyncHandler(async (req, res) => {
    const user = req.user;

    const nearByNews = await getNewsInRadius(user.location.coordinates, 5);
    
    return res.status(200).json(
        new ApiResponse(200, nearByNews, "Nearby news fetched successfully")
    );
});