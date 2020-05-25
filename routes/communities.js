const express = require("express");
const router = express.Router();

// models
const Community = require("../models/community");

router.get("/", (req, res) => {
  Community.find({}, (err, communities) => {
    if (!err) {
      if (communities.length > 0) {
        res.render("communities", { communities: communities });
      }
    }
  });
})

router.post("/checkCommunity", (req, res) => {
  console.log("communityName: ", req.body.communityName);
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

router.get("/:id", (req, res) => {
  Community.findOne({ _id: req.params.id }, (err, community) => {
    if (!err) {
      if (community) {
        res.render("community", { community: community });
      }
    }
  });
})

module.exports = router;