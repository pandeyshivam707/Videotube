import mongoose, { Schema } from "mongoose"

const playlistSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],  // array of video refs
  owner:       { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })


export const playList = mongoose.model("playList", playlistSchema)