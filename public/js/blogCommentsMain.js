const postWrapper = document.querySelector(".post-wrapper");
const postId = postWrapper.dataset.id;

// Event Listeners
// ---------------------
// ---------------------
loadComments(`${domain}/posts/comments?skip=${commentsToSkip}&limit=${commentsLimit}&postId=${postId}`);


// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20) && !isLoading && !isEnd) {
    isLoading = true;
    window.setTimeout(() => {
      loadComments(`${domain}/posts/comments?skip=${commentsToSkip}&limit=${commentsLimit}&postId=${postId}`);
    }, 500);
  }
});