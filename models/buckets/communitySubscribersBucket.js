const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// community to subscribers relationship
const communitySubscribersBucketSchema = new Schema({
  communityId: { type: Schema.Types.ObjectId, ref: "Community" },
  subscribersCount: { type: Number, required: true },
  subscribers: [{
    profileId: { type: Schema.Types.ObjectId, ref: "Profile" }
  }]
});


module.exports = mongoose.model("CommunitySubscribersBucket", communitySubscribersBucketSchema);