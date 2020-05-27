let postsQuantity = 0;
const postsLimit = 10;
let isLoading = true;

loadPosts();

// Posts
// ------------------
// ------------------

// Get 10 posts
async function loadPosts(url) {
  console.log("LOAD POSTS");
  // Fetch posts
  const resData = await Server.get(`${domain}/posts/userposts?skip=${postsQuantity}&limit=${postsLimit}`);
  postsQuantity += resData.postsLength;
  UI.appendPosts(postsContainer, currentLayout, resData.posts);
  console.log("resDat: ", resData, ", postsQuantity: ", postsQuantity);
  isLoading = false;
}
// Event Listeners
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------


// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if (((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20)) && !isLoading) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts();
    }, 500);
  }
});