// Trends
// ------------------
// ------------------
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

// Event Listeners
// ---------------------
// ---------------------


// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20) && !isLoading) {
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/new?skip=${postsQuantity}&limit=${postsLimit}`);
    }, 500);
  }
});