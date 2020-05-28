let commentsBuckets = 0;
const postsLimit = 10;
let isLoading = true;
let isEnd = false;

// Posts
// ------------------
// ------------------

// Get 10 posts
async function loadPosts(url) {
  // Fetch posts
  const resData = await Server.get(url);
  postsQuantity += resData.postsLength;
  UI.appendPosts(postsContainer, currentLayout, resData.posts);
  console.log("resDat: ", resData, ", postsQuantity: ", postsQuantity, ", isLoading: ", isLoading);
  isLoading = false;
  if (resData.postsLength === 0) {
    isEnd = true;
  } else {
    isEnd = false;
  }
}
