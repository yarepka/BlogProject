const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsBucketSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  commentsCount: { type: Number, required: true },
  lastAddedDate: { type: Date, required: true },
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true },
    postedDate: { type: Date, required: true },
    text: { type: String, required: true }
  }]
});

module.exports = mongoose.model("CommentsBucket", commentsBucketSchema);