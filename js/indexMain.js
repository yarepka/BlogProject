// Init UI && Server
const ui = new UI();
const server = new Server();

// Navbar
const logo = document.querySelector("#main-nav .logo");
const search = document.getElementById("search");
const loginBtn = document.querySelector("#main-nav .login");
const signUpBtn = document.querySelector("#main-nav .signup");
const userBtn = document.querySelector("#main-nav .user");
const navBarDropdown = document.querySelector("#main-nav .dropdown");

// Trending
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

// Login/SignUp forms
const loginForm = document.getElementById("login");
const loginFormCloseBtn = document.getElementById("close-login");
const signUpRedirect = document.getElementById("signup-redirect")

const signUpForm = document.getElementById("signup");
const signUpFormCloseBtn = document.getElementById("close-signup");
const loginRedirect = document.getElementById("login-redirect");

// Popular posts controls
const hotBtn = document.querySelector(".controls .hot");
const newBtn = document.querySelector(".controls .new");
const cardBtn = document.querySelector(".controls .card");
const classicBtn = document.querySelector(".controls .classic");
const compactBtn = document.querySelector(".controls .compact");
const gridTypeBtn = document.querySelector(".controls .grid-type");

// Posts
const posts = document.querySelectorAll(".posts-container .post-wrapper");

// Page refresh
function refreshPage() {
  // "true" - will force the page to reload from the server
  // "false" - will reload from cache, if available
  window.location.reload(true);
  window.scrollTo(0, 0);
  console.log("Page refreshed");
}

function searchForPost(e) {
  console.log(`Searching for ${e.target.value} post`);
}

// Show Login Form
function showLogin(e) {
  console.log("Show Login Form");
  // hide sign up
  ui.hideForm(signUpForm);

  // unhide login
  ui.showForm(loginForm);

  e.preventDefault();
}

// Hide Login Form
function closeLogin(e) {
  console.log("Close Login Form");

  // hide login
  ui.hideForm(loginForm);

  e.preventDefault();
}

// Show Sign Up form
function showSignUp(e) {
  console.log("Show Sign Up Form");

  // hide login
  ui.hideForm(loginForm);

  // unhide login
  ui.showForm(signUpForm);

  e.preventDefault();
}

// Hide Sign Up form
function closeSignup(e) {
  console.log("Close Signup Form");

  // hide signup
  ui.hideForm(signUpForm);

  e.preventDefault();
}

function showHotPosts(e) {
  console.log("Show hot posts");

  e.preventDefault();
}

function showNewPosts(e) {
  console.log("Show new posts");

  e.preventDefault();
}

function changeToCard(e) {
  console.log("Grid changed to Card View");

  if (!cardBtn.classList.contains("current")) {
    classicBtn.classList.remove("current");
    compactBtn.classList.remove("current");
    cardBtn.classList.add("current");
  }

  posts.forEach(post => {
    post.className = "post-wrapper post-card";
  });

  e.preventDefault();
}

function changeToClassic(e) {
  console.log("Grid changed to Classic View");

  if (!classicBtn.classList.contains("current")) {
    cardBtn.classList.remove("current");
    compactBtn.classList.remove("current");
    classicBtn.classList.add("current");
  }

  posts.forEach(post => {
    post.className = "post-wrapper post-classic";
  });

  e.preventDefault();
}

function changeToCompact(e) {
  console.log("Grid changed to Compact View");

  if (!compactBtn.classList.contains("current")) {
    cardBtn.classList.remove("current");
    classicBtn.classList.remove("current");
    compactBtn.classList.add("current");
  }

  e.preventDefault();
}

// Event Listeners

// Navbar
logo.addEventListener("click", refreshPage);
search.addEventListener("keyup", searchForPost);
loginBtn.addEventListener("click", showLogin);
signUpBtn.addEventListener("click", showSignUp);
userBtn.addEventListener("click", (e) => {
  console.log("Show user dropdown");
  const icon = userBtn.querySelector("i:last-child");

  if (icon.classList.contains("fa-arrow-down")) {
    icon.className = "fa fa-arrow-up";
  } else {
    icon.className = "fa fa-arrow-down";
  }

  navBarDropdown.classList.toggle("no-display");

  e.preventDefault();
});

// Login / Signup forms
loginFormCloseBtn.addEventListener("click", closeLogin);
signUpRedirect.addEventListener("click", showSignUp);

signUpFormCloseBtn.addEventListener("click", closeSignup);
loginRedirect.addEventListener("click", showLogin);

// Login / Signup submit
document.getElementById("login-form").addEventListener("submit", (e) => {
  console.log("Login Submit");
  e.preventDefault();
})

document.getElementById("signup-form").addEventListener("submit", (e) => {
  console.log("Sign Up Submit");
  e.preventDefault();
})

// Trends
trendBoxWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("box-trend") || e.target.classList.contains("title") || e.target.classList.contains("text")) {
    console.log("Show Trending Post");
  }
})

// Popular posts controls
hotBtn.addEventListener("click", showHotPosts);
newBtn.addEventListener("click", showNewPosts);
cardBtn.addEventListener("click", changeToCard);
classicBtn.addEventListener("click", changeToClassic);
compactBtn.addEventListener("click", changeToCompact);
gridTypeBtn.addEventListener("click", (e) => {
  console.log("Dropdown with grid type shows up");

  e.preventDefault();
})
