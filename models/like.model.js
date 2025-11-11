import mongoose from "mongoose";

const likeSchema =new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
        required: true,
        index: true
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, {timestamps: true});

likeSchema.index({likedBy: 1, newsId: 1}, {unique: true});

export default mongoose.model("Like", likeSchema);