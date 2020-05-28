const mainCommunitySection = document.getElementById("main-community");


loadPosts(`${domain}/posts/community?id=${mainCommunitySection.dataset.id}&skip=${postsToSkip}&limit=${postsLimit}`);

// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (e) {
  if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20) && !isLoading && !isEnd) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/community?id=${mainCommunitySection.dataset.id}&skip=${postsToSkip}&limit=${postsLimit}`);
    }, 500);
  }
});