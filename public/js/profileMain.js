const communitiesList = document.querySelector(".communities-list");

loadPosts(`${domain}/posts/userposts?skip=${postsToSkip}&limit=${postsLimit}`);

// Event Listeners
// ---------------------
// ---------------------

// Communities List
// ---------------------
// ---------------------
communitiesList.addEventListener("click", (e) => {
  if (e.target.classList.contains("join") || e.target.classList.contains("quit")) {
    e.preventDefault();
    manageClick(e.target, e.target.parentElement.dataset.id);
  }
})

// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", (e) => {
  if (((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20)) && !isLoading && !isEnd) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/userposts?skip=${postsToSkip}&limit=${postsLimit}`);
    }, 500);
  }
});