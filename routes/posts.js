const express = require("express");
const fs = require('fs');
const cl = require("../util/checkLogged");
const multer = require("multer");
const path = require("path");
const router = express.Router();
require('../public/js/globalFunctions');


// models
const Community = require("../models/community");
const Post = require("../models/post");
const CommentsBucket = require("../models/buckets/commentsBucket");
const PostVotersBucket = require("../models/buckets/postVotersBucket");

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
router.get("/userposts", cl.isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user._id;
    const skip = Number(req.query.skip);
    const limit = Number(req.query.limit);
    Post.find({ userId: userId }, {}, { sort: { creationDate: "-1" }, skip: skip, limit: limit }, (err, posts) => {
      if (!err) {
        console.log(`postsLength: ${posts.length}`);
        res.json({ posts: posts, postsLength: posts.length });
      } else {
        console.log(err);
      }
    });
  }
});

router.get("/add-post", cl.isLoggedIn, (req, res) => {
  Community.find({}, (err, communities) => {
    if (!err) {
      if (communities.length > 0) {
        res.render("add-post", { communities: communities });
      }
    }
  });
})

router.post("/add-post", cl.isLoggedIn, (req, res) => {
  upload(req, res, async err => {
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

router.post("/add-new-comment", cl.isLoggedIn, async (req, res) => {
  const postId = req.body.postId;
  const commentText = req.body.commentText;
  console.log("req.body.postId", postId);
  console.log("req.body.commentText", commentText);

  // get commentsBucket
  const commentsBucket = await CommentsBucket.findOne({ postId: postId, commentsCount: { $lte: 19 } }, (err, commentsBucket) => {
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

  console.log("CommentsBucket", commentsBucket);

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

  await Post.findOne({ _id: postId }, (err, post) => {
    if (!err) {
      post.commentsQuantity++;
      post.save();
    } else {
      console.log(err);
    }
  })

  res.json({ status: "OK" });
})

router.get("/comments", async (req, res) => {
  const commentsToSkip = Number(req.query.skip);
  const commentsLimit = Number(req.query.limit);
  const postId = req.query.postId;

  let totalCommentsSkipped = 0;
  let indexToStart = 0;
  let bucketsToSkip = 0;
  let isSkipped = false;
  let isFetched = false;
  let comments = [];

  let commentsBucket = await CommentsBucket.findOne({ postId: postId }, {}, { sort: { lastAddedDate: "-1" }, skip: bucketsToSkip, limit: 1 }, (err, commentsBucket) => {
    if (!err) {
      if (commentsBucket) {
        return commentsBucket;
      } else {
        return null;
      }
    }
  });


  // skipping comments
  if (commentsToSkip === 0 || commentsBucket === null) isSkipped = true;
  while (!isSkipped && totalCommentsSkipped < commentsToSkip && commentsBucket !== null) {
    if ((totalCommentsSkipped + commentsBucket.comments.length) < commentsToSkip) {
      bucketsToSkip++;
      totalCommentsSkipped += commentsBucket.comments.length;
      commentsBucket = await CommentsBucket.findOne({ postId: postId }, {}, { sort: { lastAddedDate: "-1" }, skip: bucketsToSkip, limit: 1 }, (err, commentsBucket) => {
        if (!err) {
          if (commentsBucket) {
            return commentsBucket;
          } else {
            return null;
          }
        }
      });
    } else {
      isSkipped = true;
      indexToStart = commentsToSkip - totalCommentsSkipped;
      totalCommentsSkipped += commentsToSkip - totalCommentsSkipped;
      if (indexToStart === commentsLimit) {
        indexToStart = 0;
        bucketsToSkip++;
      }
    }
  }

  console.log(`commentsToSkip: ${commentsToSkip}\ntotalCommentsSkipped: ${totalCommentsSkipped}\nindexToStart: ${indexToStart}\nbucketsToSkip: ${bucketsToSkip}\nisSkipped: ${isSkipped}`);

  // fetching comments
  if (isSkipped) {
    if (indexToStart > 0) {
      const tempArr = [];

      for (let i = indexToStart; i < commentsBucket.comments.length; i++) {
        tempArr.push(commentsBucket.comments[(commentsLimit - i) - 1]);
      }

      tempArr.forEach(tempComment => {
        if (comments.length < commentsLimit) {
          comments.push(tempComment);
        } else {
          isFetched = true;
        }
      });

      bucketsToSkip++;
    }

    while (!isFetched) {
      commentsBucket = await CommentsBucket.findOne({ postId: postId }, {}, { sort: { lastAddedDate: "-1" }, skip: bucketsToSkip, limit: 1 }, (err, commentsBucket) => {
        if (!err) {
          if (commentsBucket) {
            return commentsBucket;
          } else {
            return null;
          }
        }
      });

      if (commentsBucket !== null) {
        const tempArr = commentsBucket.comments.slice();
        tempArr.reverse();
        tempArr.forEach(tempComment => {
          if (comments.length < commentsLimit) {
            comments.push(tempComment);
          } else {
            isFetched = true;
          }
        });
        bucketsToSkip++;
      } else {
        isFetched = true;
      }
    }
  }

  console.log("comments.length before return: ", comments.length);

  res.json({ commentsQuantity: comments.length, comments: comments });
});


router.post("/vote", cl.isLoggedIn, async (req, res) => {
  const postId = req.body.postId;
  let voteDecision = Number(req.body.voteDecision) >= 0 ? 1 : -1;
  let isVoted = false;

  // check if user is already voted
  const postVotersBuckets = await PostVotersBucket.find({ postId: postId }, (err, postVotersBuckets) => {
    if (!err) {
      if (postVotersBuckets.length > 0) {
        return postVotersBuckets;
      } else {
        return null;
      }
    }
  });

  if (postVotersBuckets !== null) {
    for (let i = 0; i < postVotersBuckets.length && !isVoted; i++) {
      const votes = postVotersBuckets[i].votes;
      console.log("votes: ", votes);
      for (let j = 0; j < votes.length && !isVoted; j++) {
        if (String(votes[j].userId) === String(req.user._id)) {
          console.log("User found");
          if (Number(votes[j].vote) === voteDecision) {
            voteDecision = 0;
            isVoted = true;
            break;
          } else {
            console.log("Vote Changed to ", voteDecision);
            votes[j].vote = voteDecision;
            if (voteDecision < 0) {
              voteDecision += -1;
            } else if (voteDecision > 0) {
              voteDecision += 1;
            }
            isVoted = true;
            postVotersBuckets[i].save();
            break;
          }
        }
      }
    }
  }

  if (!isVoted) {
    const vote = {
      userId: req.user._id,
      vote: voteDecision
    };

    const postVotersBucket = await PostVotersBucket.findOne({ postId: postId, votesCount: { $lte: 19 } }, (err, postVotersBucket) => {
      if (!err) {
        return postVotersBucket;
      } else {
        console.log(err);
        res.json({ status: "ERROR", errorMessage: err });
      }
    });

    if (postVotersBucket === null) {
      const newPostVotersBucket = new PostVotersBucket({
        postId: postId,
        votesCount: 1,
        votes: [vote]
      });

      newPostVotersBucket.save();
    } else {
      postVotersBucket.votesCount++;
      postVotersBucket.votes.push(vote);
      postVotersBucket.save();
    }
  }

  const post = await Post.findOne({ _id: postId }, (err, post) => {
    if (!err) {
      if (post) {
        return post;
      }
    } else {
      console.log(err);
    }
  });

  post.rating += voteDecision;

  post.save();

  res.json({ status: "OK", postRating: post.rating });
});



router.get("/find/:text", async (req, res) => {
  const text = req.params.text;
  const regex = new RegExp(text);

  const postsByTitle = await Post.find({ title: { $regex: regex, $options: "i" } }, { title: 1 });
  const postsByText = await Post.find({ text: { $regex: regex, $options: "i" } }, { text: 1 });

  res.json({ postsByTitle: postsByTitle, postsByText: postsByText });
})


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