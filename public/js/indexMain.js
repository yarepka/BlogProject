// Trends
// ------------------
// ------------------
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

loadPosts(`${domain}/posts/new?skip=${postsToSkip}&limit=${postsLimit}`);

// Event Listeners
// ---------------------
// ---------------------


// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20) && !isLoading && !isEnd) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/new?skip=${postsToSkip}&limit=${postsLimit}`);
    }, 500);
  }
});