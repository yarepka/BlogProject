const express = require("express");
const fs = require('fs');
const multer = require("multer");
const path = require("path");
const router = express.Router();
require('../public/js/globalFunctions');


// models
const Community = require("../models/community");
const Post = require("../models/post");
const CommentsBucket = require("../models/commentsBucket");

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


router.get("/community", (req, res) => {
  const communityId = req.query.id;
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);
  const testVariable = Number(req.query.testVariable); // does not exists
  if (Number.isNaN(testVariable)) console.log("NAN");
  console.log("communityId: ", communityId, ", skip: ", skip, "limit", limit);
  console.log("TEST VAR: ", testVariable);
  Post.find({ communityId: communityId }, {}, { sort: { creationDate: "-1" }, skip: skip, limit: limit }, (err, posts) => {
    if (!err) {
      res.json({ posts: posts, postsLength: posts.length });
    } else {
      console.log(err);
    }
  })
});

router.get("/new", (req, res) => {
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);
  console.log("skip: ", skip, "limit", limit);

  Post.find({}, {}, { sort: { creationDate: "-1" }, skip: skip, limit: limit }, (err, posts) => {
    if (!err) {
      res.json({ posts: posts, postsLength: posts.length });
    } else {
      console.log(err);
    }
  })
});

// return posts of authorized user
router.get("/userposts", (req, res) => {
  const userId = req.user._id;
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);
  console.log("userId: ", userId, ", skip: ", skip, ", limit: ", limit);
  Post.find({ userId: userId }, {}, { sort: { creationDate: "-1" }, skip: skip, limit: limit }, (err, posts) => {
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

router.post("/add-new-comment", async (req, res) => {
  const postId = req.body.postId;
  const commentText = req.body.commentText;
  console.log("req.body.postId", postId);
  console.log("req.body.commentText", commentText);

  // get commentsBucket
  const commentsBucket = await CommentsBucket.findOne({ postId: postId, commentsCount: { $lte: 20 } }, (err, commentsBucket) => {
    if (!err) {
      return commentsBucket;
    } else {
      console.log(err);
      res.json({ status: "ERROR", errorMessage: err });
    }
  });

  const now = new Date();
  const newComment = {
    userId: req.user._id,
    username: req.user.username,
    postedDate: now,
    text: commentText
  };

  // no commentsBucket with empty space
  if (commentsBucket === null) {
    // create new commentsBucket
    const newCommentsBucket = new CommentsBucket({
      postId: postId,
      commentsCount: 1,
      lastAddedDate: now,
      comments: [newComment]
    });

    newCommentsBucket.save();
  } else {
    commentsBucket.lastAddedDate = now;
    commentsBucket.commentsCount++;
    commentsBucket.comments.push(newComment);
    commentsBucket.save();
  }

  res.json({ status: "OK" });
})

router.get("/comments", (req, res) => {
  const postId = req.params.postId;
});

router.get("/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id }, (err, post) => {
    if (!err) {
      return post;
    } else {
      console.log(err);
    }
  });

  const community = await Community.findOne({ _id: post.communityId }, (err, community) => {
    if (!err) {
      return community;
    } else {
      console.log(err);
    }
  });

  res.render("blog", { post: post, community: community, creationDateString: getDateString(post.creationDate) });
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

// get date string from Date object
function getDateString(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return `${interval} ${intervalType} ago`;
}