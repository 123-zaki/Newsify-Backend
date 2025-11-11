import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getArticles = asyncHandler(async(req, res) => {
    // console.log("Called")
    const {category} = req.body;
    if(!category || category.trim() === '') {
        throw new ApiError(401, "Category is required");
    }

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // console.log("Data: ", data.articles);

    return res.status(200).json(
        new ApiResponse(200, data, "Articles fetched successfully")
    );
});

export const getFilteredNews = asyncHandler(async(req, res) => {
    const {searchQuery} = req.body;
    if(!searchQuery || searchQuery.trim() === '') {
        throw new ApiError(401, "Search Query is required!");
    }

    const url = `https://newsapi.org/v2/everything?q=${searchQuery
    .trim()
    .toLowerCase()}&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Filtered Backend Data: ", data);

    return res.status(200).json(
        new ApiResponse(200, data, "Filtered News Fetched Successfully")
    );
});