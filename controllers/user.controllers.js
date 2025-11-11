import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const updateLocation = asyncHandler(async(req, res) => {
    console.log("Called update location")
    const {latitude, longitude} = req.body;
    // console.log("Location: ", latitude, " ", longitude)
    if(latitude === null || longitude === null) {
        res.status(400).json(
            new ApiResponse(400, null, "Latitude and longitude are required")
        );
    }

    const latNum = Number(latitude);
    const longNum = Number(longitude);

    if(isNaN(latNum) || isNaN(longitude)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Latitude and Longitude must be valid")
        );
    }

    // Basic range validation
    if (latNum < -90 || latNum > 90 || longNum < -180 || longNum > 180) {
        return res.status(400).json(
            new ApiResponse(400, null, "Latitude or longitude out of range")
        );
    }

    if (!req.user || !req.user._id) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        location: {
            // latitude: latNum,
            // longitude: longNum
            type: "Point",
            coordinates: [longNum, latNum]
        }
    }, {new: true}).select("-password");

    if (!updatedUser) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, updatedUser, "Location updated successfully"));
});