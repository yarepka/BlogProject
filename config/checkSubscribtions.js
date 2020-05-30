const Profile = require("../models/profile");
const ProfileSubscribtionsBucket = require("../models/buckets/profileSubscribtionsBucket");

exports.checkSubscribtions = async (communities, user) => {
  if (!user) return communities;
  communitiesToReturn = [];
  if (communities.length > 0) {
    communities.forEach(community => {
      const newObject = { ...community.toObject(), isJoined: false };
      communitiesToReturn.push(newObject);
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

  if (profileSubscribtionBuckets.length > 0) {
    let changed = 0;
    // loop through subscribtions and change isJoined of communities which are part of subscribtions
    for (let i = 0; i < profileSubscribtionBuckets.length && changed < communitiesToReturn.length; i++) {
      for (let j = 0; j < profileSubscribtionBuckets[i].subscribtions.length && changed < communitiesToReturn.length; j++) {
        for (let k = 0; k < communitiesToReturn.length && changed < communitiesToReturn.length; k++) {
          if (String(communitiesToReturn[k]._id) === String(profileSubscribtionBuckets[i].subscribtions[j].communityId)) {
            communitiesToReturn[k].isJoined = true;
            changed++;
          }
        }
      }
    }
  }

  return communitiesToReturn;
}