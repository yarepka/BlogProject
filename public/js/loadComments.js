let commentsToSkip = 0;
let commentsLimit = 20;
const bucketsLimit = 1;
let isLoading = true;
let isEnd = false;
const hash = {};

// comments container
const commentsContainer = document.querySelector(".post-comments");

// Comments
// ------------------
// ------------------

// Get 20 comments
async function loadComments(url) {
  // Fetch comments
  const resData = await Server.get(url);

  cleanList(hash, resData.comments, commentsToSkip);
  commentsToSkip += resData.commentsQuantity;

  UI.appendComments(commentsContainer, resData.comments);
  isLoading = false;
  if (resData.commentsQuantity === 0) {
    console.log("End");
    isEnd = true;
  } else {
    isEnd = false;
  }
}
