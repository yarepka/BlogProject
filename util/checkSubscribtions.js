const Profile = require("../models/profile");
const ProfileSubscribtionsBucket = require("../models/buckets/profileSubscribtionsBucket");

exports.checkSubscribtions = async (communities, user) => {
  if (!user) return communities;
  const tempCommunities = {};
  if (communities.length > 0) {
    communities.forEach(community => {
      const newObject = { ...community.toObject(), isJoined: false };
      // tempCommunities.push(newObject);
      tempCommunities[community._id] = newObject;
    })
  }

  // get profile
  const profile = await Profile.findOne({ userId: user._id }, (err, profile) => {
    if (!err) {
      if (profile) {
        return profile;
      } else {
        return null;
      }
    }
  });

  if (!profile) return communities;

  // get profileSubscribtionBucket
  const profileSubscribtionBuckets = await ProfileSubscribtionsBucket.find({ profileId: profile._id }, (err, buckets) => {
    if (!err) {
      return buckets;
    }
  });

  // if profile has any subscribtions
  if (profileSubscribtionBuckets.length > 0) {
    for (let i = 0; i < profileSubscribtionBuckets.length; i++) {
      for (let j = 0; j < profileSubscribtionBuckets[i].subscribtions.length; j++) {
        if (tempCommunities[profileSubscribtionBuckets[i].subscribtions[j].communityId])
          tempCommunities[profileSubscribtionBuckets[i].subscribtions[j].communityId].isJoined = true;
      }
    }
  }

  const communitiesToReturn = [];
  for (var id in tempCommunities) {
    communitiesToReturn.push(tempCommunities[id]);
  }

  return communitiesToReturn;
}