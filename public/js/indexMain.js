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
  const posts = await Server.get("posts.json");
  UI.appendPosts(postsContainer, currentLayout, posts);
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