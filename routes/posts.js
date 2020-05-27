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
  limits: { fileSize: 1000000 }, // 1mb - Image Max Size
  fileFilter: function (req, file, cb) {
    fileExtensionValidation(req, file, cb);
  }
}).single("post-image");


router.get("/new", (req, res) => {
  Post.find({}, {}, { skip: Number(req.query.skip), limit: Number(req.query.limit) }, (err, posts) => {
    if (!err) {
      res.json({ posts: posts, postsLength: posts.length });
    } else {
      console.log(err);
    }
  })
});

// return posts of authorized user
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
  upload(req, res, async err => {
    console.log("/add-post, file: ", req.file);
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.json({ status: "ERROR", title: req.body.title, text: req.body.text, msg: "Image size must be less than 1 megabyte" })
      } else {
        console.log("Error while uploading: ", err);
        res.json({ status: "ERROR", title: req.body.title, text: req.body.text, msg: err });
      }
    } else {
      console.log("Image Successfully uploaded");
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
      if (req.file) {
        const absolutePath = path.resolve("./public/img/posts");
        const destination = req.file.destination;
        const filename = req.file.filename;

        // create directory
        const date = newPost.creationDate.getDate(); // example 27
        const month = newPost.creationDate.getMonth(); // 0 - 11, not 1 - 12
        const year = newPost.creationDate.getFullYear();
        const directoryName = `${date}${month}${year}`;

        // directory with this name does not exists
        if (!fs.existsSync(`${absolutePath}/${directoryName}`)) {
          // create directory
          fs.mkdirSync(`${absolutePath}/${directoryName}`);
        }

        // renaming the file
        const oldPathName = `${destination}${filename}`;
        const newName = `${directoryName}/${newPost._id}${filename.substring(filename.indexOf("."), filename.length)}`;
        const newPathName = `${destination}${newName}`;
        fs.rename(oldPathName, newPathName, err => {
          if (err) console.log("ERROR while renaming: ", err);
        });

        newPost.imageName = newName;
      }

      console.log("newPost:", newPost);

      newPost.save();

      res.json({ status: "OK" });
    }
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