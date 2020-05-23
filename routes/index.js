const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("User: ", req.user);
  res.render("index");
})

router.get("/profile", (req, res) => {
  res.render("profile");
})

router.get("/community", (req, res) => {
  res.render("community");
})

router.get("/communities", (req, res) => {
  res.render("communities");
})

router.get("/blog", (req, res) => {
  res.render("blog");
})

router.get("/add-post", (req, res) => {
  res.render("add-post");
})

module.exports = router;