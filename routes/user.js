const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");
const cs = require("../config/checkSubscribtions");

// models
const User = require("../models/user");
const Profile = require("../models/profile");
const Community = require("../models/community");
const ProfileSubscribtionsBucket = require("../models/buckets/profileSubscribtionsBucket");

const csrfProtection = csrf();

router.use(csrfProtection);

router.get("/signup", (req, res) => {
  res.json({
    csrfToken: req.csrfToken()
  });
});

router.get("/login", (req, res) => {
  res.json({
    csrfToken: req.csrfToken()
  });
});

router.post("/checkUsername", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!err) {
      res.set("Content-Type", "application/json");
      if (user) {
        console.log("Username is already taken");
        return res.json({ isUsernameRegistered: true });
      } else {
        console.log("Username is available");
        return res.json({ isUsernameRegistered: false });
      }
    }
  });
})

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/successLogin",
    failureRedirect: "/user/failureLogin",
    failureFlash: true
  }));

router.get("/successLogin", (req, res) => {
  res.set("Content-Type", "application/json");
  res.json({ status: "OK" });
})

router.get("/failureLogin", (req, res) => {
  res.set("Content-Type", "application/json");

  usernameError = req.flash("usernameError")[0];
  passwordError = req.flash("passwordError")[0];

  if (usernameError) {
    res.json({ status: "PROBLEM", errorType: "username", errorMsg: usernameError.message });
  } else if (passwordError) {
    res.json({ status: "PROBLEM", errorType: "password", errorMsg: passwordError.message });
  } else {
    res.json({ status: "OK" });
  }
})

router.post("/signup",
  passport.authenticate("local.signup"),
  (req, res) => {
    res.json({ status: "OK" });
  }
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.json({ status: "OK" });
});

router.get("/profile", async (req, res) => {
  communities = await Community.find({}, {}, { limit: 5 }, (err, communities) => {
    if (!err) {
      return communities;
    }
  });

  communitiesToReturn = await cs.checkSubscribtions(communities, req.user);

  return res.render("profile", { communities: communitiesToReturn });
})

module.exports = router;