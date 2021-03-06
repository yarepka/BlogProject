// Popular posts controls
// ------------------
// ------------------
const hotBtn = document.querySelector(".controls .hot");
const newBtn = document.querySelector(".controls .new");
const cardBtn = document.querySelector(".controls .card");
const classicBtn = document.querySelector(".controls .classic");
const compactBtn = document.querySelector(".controls .compact");
const gridTypeBtn = document.querySelector(".controls .grid-type");
const gridTypeDropdown = document.querySelector(".controls .dropdown");
const cardControlsBtn = document.querySelector(".controls .dropdown .card");
const classicControlsBtn = document.querySelector(".controls .dropdown .classic");
const compactControlsBtn = document.querySelector(".controls .dropdown .compact");

// Posts
// ------------------
// ------------------
const postsContainer = document.querySelector(".posts-container");
let currentLayout = "card";

// Posts functions
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------
function showHotPosts(e) {
  console.log("Show hot posts");

  e.preventDefault();
}

function showNewPosts(e) {
  console.log("Show new posts");

  e.preventDefault();
}

function changePostLayout(type) {
  // Delete current from all buttons
  classicBtn.classList.remove("current");
  compactBtn.classList.remove("current");
  cardBtn.classList.remove("current");

  const typeLowerCase = type.toLowerCase();

  switch (typeLowerCase) {
    case "card": cardBtn.classList.add("current"); break;
    case "classic": classicBtn.classList.add("current"); break;
    case "compact": compactBtn.classList.add("current"); break;
  }

  // get posts from post-container
  const posts = Array.from(postsContainer.children);

  posts.forEach(post => {
    post.className = `post-wrapper post-${typeLowerCase}`;
    if (!post.querySelector(".post-content img")) post.classList.add("no-image");
  });

  document.querySelector(".controls .dropdown").className = "dropdown no-display";
  document.querySelector(".controls > ul:last-child > li:last-child i").className = "fa fa-arrow-down";
}

// Change posts layout to "post-card"
function changeToCard(e) {
  currentLayout = "card";
  changePostLayout("card");
  e.preventDefault();
}

// Change posts layout to "post-classic"
function changeToClassic(e) {
  currentLayout = "classic"
  changePostLayout("classic");
  e.preventDefault();
}

// Change posts layout to "post-compact"
function changeToCompact(e) {
  currentLayout = "compact";
  changePostLayout("compact");
  e.preventDefault();
}

async function vote(post, decision) {
  const postIdToVote = post.dataset.id;
  const resData = await Server.post(`${domain}/posts/vote`, { postId: postIdToVote, voteDecision: decision });
  console.log("E: ", post.querySelector(".rating-quantity"));
  post.querySelector(".rating-quantity").textContent = resData.postRating;
}

// Event Listeners
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------

// Popular posts controls Event Listeners
// ------------------------
// ------------------------
hotBtn.addEventListener("click", showHotPosts);
newBtn.addEventListener("click", showNewPosts);
cardBtn.addEventListener("click", changeToCard);
classicBtn.addEventListener("click", changeToClassic);
compactBtn.addEventListener("click", changeToCompact);
cardControlsBtn.addEventListener("click", changeToCard);
classicControlsBtn.addEventListener("click", changeToClassic);
compactControlsBtn.addEventListener("click", changeToCompact);

// Posts Event Listeners
// ------------------------
// ------------------------
postsContainer.addEventListener("click", e => {

  if (e.target.classList.contains("fa-arrow-up")) {
    console.log("Arrow Up");
    vote(e.target.parentElement.parentElement, 1);
  }

  if (e.target.classList.contains("fa-arrow-down")) {
    console.log("Arrow Down");
    vote(e.target.parentElement.parentElement, -1);
  }

  if (e.target.tagName !== "I" && e.target.tagName !== "A" && !e.target.classList.contains("posts-container") && !e.target.classList.contains("comments-quantity")) {
    // we need to get element with "post-wrapper" class
    // because it contains id of the post in "data-id" attribute
    let parent = e.target;
    while (!parent.classList.contains("post-wrapper")) {
      parent = parent.parentElement;
    }
    window.location.href = `/posts/${parent.dataset.id}`;
  }
});

gridTypeBtn.addEventListener("click", (e) => {
  const icon = gridTypeBtn.querySelector("i:last-child");

  if (icon.classList.contains("fa-arrow-down")) {
    icon.className = "fa fa-arrow-up";
  } else {
    icon.className = "fa fa-arrow-down";
  }

  gridTypeDropdown.classList.toggle("no-display");

  e.preventDefault();
});