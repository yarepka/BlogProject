const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema({
  name: { type: String, required: true },
  amountOfSubscribers: { type: Number, required: true },
  mainImagePath: { type: String, required: true }
});

module.exports = mongoose.model("Community", communitySchema);