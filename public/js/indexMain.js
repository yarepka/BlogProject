let postsQuantity = 0;
const postsLimit = 10;
let isLoading = true;

// Trends
// ------------------
// ------------------
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

loadPosts();

// Posts
// ------------------
// ------------------

// Get 10 posts
async function loadPosts() {
  // Fetch posts
  const resData = await Server.get(`${domain}/posts/new?skip=${postsQuantity}&limit=${postsLimit}`);
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
  if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20)) {
    window.setTimeout(() => {
      loadPosts();
    }, 500);
  }
});