const mainCommunitySection = document.getElementById("main-community");
let joinBtn = document.querySelector(".join");
if (joinBtn === null) joinBtn = document.querySelector(".quit");

loadPosts(`${domain}/posts/community?id=${mainCommunitySection.dataset.id}&skip=${postsToSkip}&limit=${postsLimit}`);

// JoinBtn
// ---------------------
// ---------------------
joinBtn.addEventListener("click", e => {
  e.preventDefault();
  manageClick(e.target, mainCommunitySection.dataset.id);
});

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