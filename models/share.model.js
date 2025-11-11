import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

shareSchema.index({sharedBy: 1, newsId: 1}, {unique: true});

export default mongoose.model("Share", shareSchema);
