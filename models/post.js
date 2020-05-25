const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String },
  communityId: { type: Schema.Types.ObjectId, ref: "Community" },
  communityName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  commentsQuantity: { type: Number, required: true },
  creationDate: { type: Date, required: true },
  imagePath: { type: String }
});

module.exports = mongoose.model("Post", postSchema);