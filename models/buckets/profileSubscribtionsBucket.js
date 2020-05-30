const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// profile to subscribtions relationship
const profileSubscribtionsBucketSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "Profile" },
  subscribtionsCount: { type: Number, default: 0 },
  subscribtions: [{
    communityId: { type: Schema.Types.ObjectId, ref: "Community" }
  }]
});

module.exports = mongoose.model("ProfileSubscribtionsBucket", profileSubscribtionsBucketSchema);