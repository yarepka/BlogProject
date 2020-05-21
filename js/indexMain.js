// Init UI && Server
// ------------------
// ------------------
const server = new Server();

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
  const posts = await server.get("posts.json");

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
window.addEventListener("scroll", function (ev) {
  console.log("window.innerHeight = ", window.innerHeight);
  console.log("window.pageYOffset = ", window.pageYOffset);
  console.log("document.body.offsetHeight = ", document.body.offsetHeight);
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
    window.setTimeout(() => {
      loadPosts();
    }, 500);
  }
});