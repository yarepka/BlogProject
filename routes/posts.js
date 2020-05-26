const express = require("express");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const router = express.Router();

// models
const Community = require("../models/community");
const Post = require("../models/post");

const storage = multer.diskStorage({
  destination: "./public/img/posts/",
  filename: function (req, file, cb) {
    cb(null, "test" + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    fileExtensionValidation(req, file, cb);
  }
}).single("post-image");


router.get("/userposts", (req, res) => {
  console.log("req.user._id: ", req.user._id, ", req.query.skip: ", Number(req.query.skip), "req.query.limit", Number(req.query.limit));
  Post.find({ userId: req.user._id }, {}, { skip: Number(req.query.skip), limit: Number(req.query.limit) }, (err, posts) => {
    if (!err) {
      console.log(`postsLength: ${posts.length}`);
      res.json({ posts: posts, postsLength: posts.length });
    } else {
      console.log(err);
    }
  });
});

router.get("/add-post", (req, res) => {
  Community.find({}, (err, communities) => {
    if (!err) {
      if (communities.length > 0) {
        res.render("add-post", { communities: communities });
      }
    }
  });
})

router.post("/add-post", (req, res) => {
  const p = new Promise((resolve, reject) => {
    upload(req, res, err => {
      console.log("/add-post, file: ", req.file);
      if (err) {
        console.log("Error while uploading: ", err);
        res.json({ status: "ERROR", title: req.body.title, text: req.body.text, msg: err });
      } else {
        console.log("Image Successfully uploaded");
        console.log("KRJGOIEWRJGIEOR: ", req.file);
        if (req.file) {
          resolve({ destination: req.file.destination, filename: filename = req.file.filename });
        } else {
          resolve(undefined);
        }
      }
    })
  });

  p.then(async (data) => {
    let newPost = new Post();
    const title = req.body.title;
    const text = req.body.text;

    await Community.findOne({ name: req.body.community }, (err, community) => {
      if (!err) {
        newPost.communityName = community.name;
        newPost.communityId = community._id;
      }
    });

    // Set post username and userId properties
    newPost.userId = req.user._id;
    newPost.username = req.user.username;

    // Set post title and text
    newPost.title = title;
    if (text) newPost.text = text;

    // Set pot rating and comments quantity
    newPost.rating = 0;
    newPost.commentsQuantity = 0;

    // Set post creation date
    newPost.creationDate = new Date();

    // Rename uploaded image
    if (data) {
      const oldPathName = `${data.destination}${data.filename}`;
      const newName = `${newPost._id}${data.filename.substring(data.filename.indexOf("."), data.filename.length)}`;
      const newPathName = `${data.destination}${newName}`;
      fs.rename(oldPathName, newPathName, err => {
        if (err) console.log("ERROR while renaming: ", err);
      });

      newPost.imageName = newName;
    }

    console.log("newPost:", newPost);

    newPost.save();

    res.json({ status: "OK" });
  })
})

router.get("/:id", (req, res) => {
  res.render("blog");
})

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