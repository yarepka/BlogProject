const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("User: ", req.user);
  res.render("index");
})

module.exports = router;