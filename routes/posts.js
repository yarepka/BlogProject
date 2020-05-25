const express = require("express");
const router = express.Router();

// models
const Community = require("../models/community");

router.get("/add-post", (req, res) => {
  Community.find({}, (err, communities) => {
    if (!err) {
      if (communities.length > 0) {
        res.render("add-post", { communities: communities });
      }
    }
  });
})

router.get("/:id", (req, res) => {
  res.render("blog");
})



module.exports = router;