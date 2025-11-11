import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    urlToImage: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    location: {
        // longitude: {
        //     type: Number,
        //     required: true
        // },
        // latitude: {
        //     type: Number,
        //     required: true
        // }
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

newsSchema.index({location: '2dsphere'});

const News = mongoose.model("News", newsSchema);

export default News;