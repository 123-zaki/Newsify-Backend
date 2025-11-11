import News from "../models/news.model.js";

export const getNewsInRadius = async([long, lat], radius) => {
    console.log("Loc: ", lat, " ", long);
    // const nearbyNews = await News.find({
    //     location: {
    //         $geoWithin: {
    //             $centerSphere: [[long, lat], radius / 6371]
    //         }
    //     }
    // });

    const nearbyNews = await News.aggregate([
        {
            $match: {
                location: {
                    $geoWithin: {
                        $centerSphere: [[long, lat], radius / 6371]
                    }
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "newsId",
                as: 'Likes'
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'newsId',
                as: 'Comments'
            }
        },
        {
            $lookup: {
                from: 'shares',
                localField: '_id',
                foreignField: 'newsId',
                as: 'Shares'
            }
        },
        {
            $addFields: {
                Likes: {
                    $size: {
                        $ifNull: ["$Likes", []]
                    }
                },
                Comments: {
                    $size: {
                        $ifNull: ["$Comments", []]
                    }
                },
                Shares: {
                    $size: {
                        $ifNull: ["$Shares", []]
                    }
                }
            }
        }
    ]);

    return nearbyNews;
};