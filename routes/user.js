const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");
const cs = require("../util/checkSubscribtions");
const cl = require("../util/checkLogged");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// models
const User = require("../models/user");
const Post = require("../models/post");
const Profile = require("../models/profile");
const Community = require("../models/community");
const ProfileSubscribtionsBucket = require("../models/buckets/profileSubscribtionsBucket");

const csrfProtection = csrf();

// multer configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'img'),
  filename: function (req, file, cb) {
    cb(null, path.join('profiles', `test${path.extname(file.originalname).toLowerCase()}`));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1mb - Image Max Size
  fileFilter: function (req, file, cb) {
    fileExtensionValidation(req, file, cb);
  }
}).single("profile-image");

router.post("/upload-image", cl.isLoggedIn, (req, res) => {
  upload(req, res, async err => {
    if (err) {
      console.log(err);
      return res.json({ status: "ERROR" });
    } else {
      console.log("Profile Image Successfully uploaded");

      // get profile
      const profile = await Profile.findOne({ userId: req.user._id });

      if (req.file) {
        // delete old profile image if it's name is not equals to logo_big.png which is default image for every profile
        if (profile.mainImageName !== "logo_big.png") {
          const oldImageName = profile.mainImageName;
          const oldImagePath = path.join(__dirname, '..', 'public', 'img', oldImageName);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath), err => {
              if (err) console.log(err);
            };
            console.log("deleted");
          }
        }

        // rename the file
        const destination = req.file.destination;
        const filename = req.file.filename;

        const newFileName = path.join('profiles', `${profile._id}${Math.abs(new Date().getTime())}${path.extname(filename).toLowerCase()}`);
        const oldPathImage = path.join(destination, filename);
        const newPathImage = path.join(destination, newFileName);
        fs.renameSync(oldPathImage, newPathImage, err => {
          if (err) console.log("ERROR while renaming: ", err);
        })
        console.log("renamed");

        // set profile image to the new file name
        profile.mainImageName = newFileName;
        profile.save();

        console.log("before return")
        // return json with status: "OK" and new profile image path
        return res.json({ status: "OK", profileImageName: profile.mainImageName });
      }
    }
  })
});

router.use(csrfProtection);

router.get("/signup", cl.notLoggedIn, (req, res) => {
  res.json({
    csrfToken: req.csrfToken()
  });
});

router.get("/login", cl.notLoggedIn, (req, res) => {
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
  cl.notLoggedIn,
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
  cl.notLoggedIn,
  passport.authenticate("local.signup"),
  (req, res) => {
    res.json({ status: "OK" });
  }
);

router.get("/logout", cl.isLoggedIn, (req, res, next) => {
  req.logout();
  res.json({ status: "OK" });
});

router.get("/profile", cl.isLoggedIn, async (req, res) => {
  communities = await Community.find({}, {}, { limit: 5 }, (err, communities) => {
    if (!err) {
      return communities;
    }
  });

  // get joined/NOT joined communities
  communitiesToReturn = await cs.checkSubscribtions(communities, req.user);

  // get profile
  const profile = await Profile.findOne({ userId: req.user._id });

  // check is there any posts for this user
  const post = await Post.findOne({ userId: req.user._id });

  let hasPosts = true;
  if (!post) hasPosts = false;

  const date = req.user.createdOn;
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' })
  const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date);

  console.log(`${day}-${month}-${year}`)

  console.log("Before return");
  return res.render("profile", { communities: communitiesToReturn, profileImage: profile.mainImageName, hasPosts: hasPosts, cakeDay: `${month} ${day}, ${year}` });
});



module.exports = router;

// Check File Type
function fileExtensionValidation(req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}