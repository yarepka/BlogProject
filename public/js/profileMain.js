// Event Listeners
// ---------------------
// ---------------------

// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if (((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20)) && !isLoading) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/userposts?skip=${postsQuantity}&limit=${postsLimit}`);
    }, 500);
  }
});