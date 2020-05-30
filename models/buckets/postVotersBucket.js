const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postVotersBucketSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  votesCount: { type: Number, required: true },
  votes: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    vote: { type: Number, required: true }
  }]
});

module.exports = mongoose.model("PostVotersBucket", postVotersBucketSchema);