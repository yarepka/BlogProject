const express = require("express");
const router = express.Router();
const cs = require("../util/checkSubscribtions");
const cl = require("../util/checkLogged");

// models
const Post = require("../models/post");
const Community = require("../models/community");
const Profile = require("../models/profile");
const CommunitySubscribersBucket = require("../models/buckets/communitySubscribersBucket");
const ProfileSubscribtionsBucket = require("../models/buckets/profileSubscribtionsBucket");

router.get("/", async (req, res) => {
  const communities = await Community.find({}, (err, communities) => {
    if (!err) {
      return communities;
    }
  });

  communitiesToReturn = await cs.checkSubscribtions(communities, req.user);

  return res.render("communities", { communities: communitiesToReturn });
})

router.post("/checkCommunity", (req, res) => {
  Community.findOne({ name: req.body.communityName }, (err, community) => {
    if (!err) {
      if (community) {
        res.json({ isCommunityExists: true });
      } else {
        res.json({ isCommunityExists: false });
      }
    }
  })
})

router.post("/join", cl.isLoggedIn, async (req, res) => {
  const communityId = req.body.communityId;
  let isAlreadyJoined = false;

  // get profile by userId 
  const profile = await Profile.findOne({ userId: req.user._id }, (err, profile) => {
    if (!err) {
      if (profile) {
        return profile;
      } else {
        return null;
      }
    }
  });

  if (profile) {
    // check if profile is already joined community in profileSubscribtionsBucket
    const profileSubscribtionsBuckets = await ProfileSubscribtionsBucket.find({ profileId: profile._id }, (err, profileSubscribtionsBuckets) => {
      if (!err) {
        return profileSubscribtionsBuckets;
      }
    });

    if (profileSubscribtionsBuckets.length > 0) {
      for (let i = 0; i < profileSubscribtionsBuckets.length && !isAlreadyJoined; i++) {
        for (let j = 0; j < profileSubscribtionsBuckets[i].subscribtions.length && !isAlreadyJoined; j++) {
          if (String(profileSubscribtionsBuckets[i].subscribtions[j].communityId) === communityId) {
            isAlreadyJoined = true;
          }
        }
      }
    }

    // if joined return res.json({status: "ERROR"})
    if (isAlreadyJoined) return res.json({ status: "ERROR", msg: "Current user profile is already joined this community" });

    // if not joined 
    // try to get profileSubscribtionBucket which has less than 20 subscribtions
    const profileSubscribtionBucket = await ProfileSubscribtionsBucket.findOne({ profileId: profile._id, subscribtionsCount: { $lte: 19 } }, (err, bucket) => {
      if (!err) {
        if (bucket) {
          return bucket;
        } else {
          return null;
        }
      }
    });

    const newSubscribtion = {
      communityId: communityId
    };

    // if no such profileSubscribtionBucket then create the new one
    if (profileSubscribtionBucket === null) {
      const newProfileSubscribtionBucket = new ProfileSubscribtionsBucket({
        profileId: profile._id,
        subscribtionsCount: 1,
        subscribtions: [newSubscribtion]
      });

      newProfileSubscribtionBucket.save();
    } else {
      // if found profileSubscribtionBucket then add new subscribtion and increment subscribtionsCount
      profileSubscribtionBucket.subscribtionsCount++;
      profileSubscribtionBucket.subscribtions.push(newSubscribtion);

      profileSubscribtionBucket.save();
    }

    // try to find communitySubscribersBucket which has less than 20 suscribers by communityId
    const communitySubscribersBucket = await CommunitySubscribersBucket.findOne({ communityId: communityId, subscribersCount: { $lte: 19 } }, (err, bucket) => {
      if (!err) {
        if (bucket) {
          return bucket;
        } else {
          return null;
        }
      }
    })

    const newSubscriber = {
      profileId: profile._id
    };

    // if not found, then create the new one
    if (communitySubscribersBucket === null) {
      const newCommunitySubscribersBucket = new CommunitySubscribersBucket({
        communityId: communityId,
        subscribersCount: 1,
        subscribers: [newSubscriber]
      });

      newCommunitySubscribersBucket.save();
    } else {
      // if found then add new subscriber
      communitySubscribersBucket.subscribersCount++;
      communitySubscribersBucket.subscribers.push(newSubscriber);
      communitySubscribersBucket.save();
    }

    return res.json({ status: "OK" });
  }

  return res.json({ status: "ERROR", msg: "Profile can't be found" });
})

router.post("/quit", cl.isLoggedIn, async (req, res) => {
  const communityId = req.body.communityId;
  let isSubscribtionExists = false;
  let isDeleted = false;

  // get profile
  const profile = await Profile.findOne({ userId: req.user._id }, (err, profile) => {
    if (!err) {
      if (profile) {
        return profile;
      } else {
        return null;
      }
    }
  });

  if (profile) {
    // get profileSubscribtionsBuckit check if communityId is in subscribtions
    const profileSubscribtionsBuckets = await ProfileSubscribtionsBucket.find({ profileId: profile._id }, (err, profileSubscribtionsBuckets) => {
      if (!err) {
        return profileSubscribtionsBuckets;
      }
    });

    if (profileSubscribtionsBuckets.length > 0) {
      for (i = 0; i < profileSubscribtionsBuckets.length && !isSubscribtionExists; i++) {
        for (j = 0; j < profileSubscribtionsBuckets[i].subscribtions.length && !isSubscribtionExists; j++) {
          if (String(profileSubscribtionsBuckets[i].subscribtions[j].communityId) === communityId) {
            isSubscribtionExists = true;

            // delete subscribtion and decriment subscribtionsCount
            profileSubscribtionsBuckets[i].subscribtions.splice(j, 1);
            profileSubscribtionsBuckets[i].subscribtionsCount--;

            if (profileSubscribtionsBuckets[i].subscribtionsCount <= 0) {
              await ProfileSubscribtionsBucket.deleteOne({ _id: profileSubscribtionsBuckets[i]._id });
            } else {
              profileSubscribtionsBuckets[i].save();
            }
          }
        }
      }
    }

    // if subscribtion does not exists
    if (!isSubscribtionExists) return res.json({ status: "ERROR", msg: "You are trying to quit the community which you not joined to" });

    // get communitySubscribersBuckets by communityId
    const communitySubscribersBuckets = await CommunitySubscribersBucket.find({ communityId: communityId }, (err, buckets) => {
      if (!err) {
        return buckets;
      }
    })

    for (let i = 0; i < communitySubscribersBuckets.length && !isDeleted; i++) {
      for (let j = 0; j < communitySubscribersBuckets[i].subscribers.length && !isDeleted; j++) {
        // find subscriber in subscribers by profile id and delete it
        if (String(communitySubscribersBuckets[i].subscribers[j].profileId) === String(profile._id)) {
          // delete
          communitySubscribersBuckets[i].subscribers.splice(j, 1);
          communitySubscribersBuckets[i].subscribersCount--;

          if (communitySubscribersBuckets[i].subscribersCount <= 0) {
            await CommunitySubscribersBucket.deleteOne({ _id: communitySubscribersBuckets[i]._id });
          } else {
            communitySubscribersBuckets[i].save();
          }

        }
      }
    }

    return res.json({ status: "OK" });
  }

  return res.json({ status: "ERROR", msg: "Profile can't be found" });
})


router.get("/:id", async (req, res) => {
  const community = await Community.find({ _id: req.params.id }, (err, community) => {
    if (!err) {
      return community;
    }
  });

  communitiesToReturn = await cs.checkSubscribtions(community, req.user);

  const post = await Post.findOne({ communityId: community._id });

  let hasPosts = true;
  if (!post) hasPosts = false;

  return res.render("community", { community: communitiesToReturn[0], hasPosts: hasPosts });
})

module.exports = router;