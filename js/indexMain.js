// Init UI && Server
// ------------------
// ------------------
const server = new Server();

// Trends
// ------------------
// ------------------
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

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
let currentGrid = "card";

loadPosts();

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

function changePostGrid(type) {
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
  });

  document.querySelector(".controls .dropdown").className = "dropdown no-display";
  document.querySelector(".controls > ul:last-child > li:last-child i").className = "fa fa-arrow-down";
}

// Change Post Grid to "post-card"
function changeToCard(e) {
  currentGrid = "card";
  changePostGrid("card");
  e.preventDefault();
}

// Change Post Grid to "post-classic"
function changeToClassic(e) {
  currentGrid = "classic"
  changePostGrid("classic");
  e.preventDefault();
}

// Change Post Grid to "post-compact"
function changeToCompact(e) {
  currentGrid = "compact";
  changePostGrid("compact");
  e.preventDefault();
}

// Get 10 posts
async function loadPosts() {
  // Fetch posts
  const posts = await server.get("posts.json");

  UI.appendPosts(postsContainer, currentGrid, posts);
}
// Event Listeners
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------

// Popular posts controls
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

// Posts
// ------------------------
// ------------------------
postsContainer.addEventListener("click", e => {
  console.log(e.target);

  if (e.target.classList.contains("fa-arrow-up")) {
    console.log("Arrow Up");
  }

  if (e.target.classList.contains("fa-arrow-down")) {
    console.log("Arrow Down");
  }
  if (e.target.tagName !== "I" && e.target.tagName !== "A" && !e.target.classList.contains("posts-container") && !e.target.classList.contains("comments-quantity")) {
    console.log("Blog");
    window.location.href = "https://github.com/yarepka";
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