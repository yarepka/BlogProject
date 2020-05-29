let postsToSkip = 0;
const postsLimit = 10;
let isLoading = true;
let isEnd = false;
const hash = {};

// Posts
// ------------------
// ------------------

// Get 10 posts
async function loadPosts(url) {
  // Fetch posts
  const resData = await Server.get(url);

  // Clean posts
  cleanList(hash, resData.posts, postsToSkip);
  postsToSkip += resData.postsLength;
  
  UI.appendPosts(postsContainer, currentLayout, resData.posts);
  isLoading = false;
  if (resData.postsLength === 0) {
    isEnd = true;
  } else {
    isEnd = false;
  }
}


