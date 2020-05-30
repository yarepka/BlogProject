const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  communitySubscribtions: { type: Number, default: 0 },
  mainImageName: { type: String, default: 'logo.png' }
});

module.exports = mongoose.model("Profile", profileSchema);
