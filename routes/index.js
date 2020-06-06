const express = require("express");
const router = express.Router();

const Post = require('../models/post');

router.get("/", async (req, res) => {
  const trends = await Post.find({}, { title: 1, imageName: 1 }).sort({ rating: -1, creationDate: -1 }).limit(4);

  console.log('trends: ', trends);
  // get trends
  res.render("index", { trends: trends });
})

module.exports = router;