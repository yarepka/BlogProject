const express = require("express");
const router = express.Router();

// models
const Community = require("../models/community");

router.get("/", (req, res) => {
  console.log("User: ", req.user);
  res.render("index");
})

router.get("/profile", (req, res) => {
  res.render("profile");
})

router.get("/community/:id", (req, res) => {
  Community.findOne({ _id: req.params.id }, (err, community) => {
    if (!err) {
      if (community) {
        res.render("community", { community: community });
      }
    }
  });
})

router.get("/communities", (req, res) => {
  Community.find({}, (err, communities) => {
    if (!err) {
      if (communities.length > 0) {
        res.render("communities", { communities: communities.reverse() });
      }
    }
  });
})

router.get("/blog", (req, res) => {
  res.render("blog");
})

router.get("/add-post", (req, res) => {
  res.render("add-post");
})

module.exports = router;