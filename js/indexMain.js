// Init UI && Server
// ------------------
// ------------------
const ui = new UI();
const server = new Server();

// Navbar
// ------------------
// ------------------
const logo = document.querySelector("#main-nav .logo");
const search = document.getElementById("search");
const loginBtn = document.querySelector("#main-nav .login");
const signUpBtn = document.querySelector("#main-nav .signup");
const userBtn = document.querySelector("#main-nav .user");
const navBarDropdown = document.querySelector("#main-nav .dropdown");

// Trending
// ------------------
// ------------------
const trendBoxWrapper = document.querySelector(".box-trend-wrapper");

// Login / Sign Up forms
// ------------------
// ------------------

// Login
const loginForm = document.getElementById("login");
const loginFormCloseBtn = document.getElementById("close-login");
const signUpRedirect = document.getElementById("signup-redirect");
const loginSubmitForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Sign Up
const signUpForm = document.getElementById("signup");
const signUpFormCloseBtn = document.getElementById("close-signup");
const loginRedirect = document.getElementById("login-redirect");
const signUpSubmitForm = document.getElementById("signup-form");
const signUpEmail = document.getElementById("signup-email");
const signUpPassword = document.getElementById("signup-password");
const signUpConfirmPassword = document.getElementById("signup-confirm-password");

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


// Navbar Functions
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------
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


// Login / Sign Up functions
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------
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

  // clean form error/success messages
  ui.cleanSubmitForm([loginEmail, loginPassword]);

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

  // clean form error/success messages
  ui.cleanSubmitForm([signUpEmail, signUpPassword, signUpConfirmPassword]);

  e.preventDefault();
}




// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(String(input.value.trim()).toLowerCase())) {
    ui.showSuccess(input);
  } else {
    ui.showError(input, "Email is not valid")
  }
}

// Check password match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    ui.showError(input2, "Passwords do not match");
  }
}

getFieldName(signUpSubmitForm.querySelector("#signup-confirm-password"));

// Get fieldname
function getFieldName(input) {
  let cutted = input.id.charAt(input.id.indexOf("-") + 1).toUpperCase() + input.id.slice(input.id.indexOf("-") + 2, input.id.length);

  let dashIndex = cutted.indexOf("-");
  while (dashIndex !== -1) {
    cutted = cutted.slice(0, dashIndex) + " " + cutted.slice(dashIndex + 1);
    dashIndex = cutted.indexOf("-");
  }

  return cutted;
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      ui.showError(input, `${getFieldName(input)} is required`)
    } else {
      ui.showSuccess(input);
    }
  });
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    ui.showError(input, `${getFieldName(input)} must be at least ${min} characters`);
  } else if (input.value.length > max) {
    ui.showError(input, `${getFieldName(input)} must be less than ${max} characters`);
  } else {
    ui.showSuccess(input);
  }
}

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

loadPosts();

// Get 10 posts
async function loadPosts() {
  // Fetch posts
  const posts = await server.get("posts.json");

  ui.appendPosts(postsContainer, currentGrid, posts);
}
// Event Listeners
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------

// Navbar
// ------------------------
// ------------------------
logo.addEventListener("click", refreshPage);
search.addEventListener("keyup", searchForPost);
loginBtn.addEventListener("click", showLogin);
signUpBtn.addEventListener("click", showSignUp);
userBtn.addEventListener("click", (e) => {
  const icon = userBtn.querySelector("i:last-child");

  if (icon.classList.contains("fa-arrow-down")) {
    icon.className = "fa fa-arrow-up";
  } else {
    icon.className = "fa fa-arrow-down";
  }

  navBarDropdown.classList.toggle("no-display");

  e.preventDefault();
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

// Login / Signup forms
// ------------------------
// ------------------------
loginFormCloseBtn.addEventListener("click", closeLogin);
signUpRedirect.addEventListener("click", showSignUp);

signUpFormCloseBtn.addEventListener("click", closeSignup);
loginRedirect.addEventListener("click", showLogin);

// Login / Signup submit forms
// ------------------------
// ------------------------
loginSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkRequired([loginEmail, loginPassword]);
  checkLength(loginPassword, 6, 25);
  checkEmail(loginEmail);

  if (loginEmail.parentElement.classList.contains("success") && loginPassword.parentElement.classList.contains("success")) {
    console.log("Login Form Submit");
  }
})

signUpSubmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkRequired([signUpEmail, signUpPassword, signUpConfirmPassword]);
  checkEmail(signUpEmail);
  checkLength(signUpPassword, 6, 25);
  checkPasswordsMatch(signUpPassword, signUpConfirmPassword);

  if (signUpEmail.parentElement.classList.contains("success") && signUpPassword.parentElement.classList.contains("success") && signUpConfirmPassword.parentElement.classList.contains("success")) {
    console.log("Sign Up Form Submit");
  }
})

// Trends
// ------------------------
// ------------------------
trendBoxWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("box-trend") || e.target.classList.contains("title") || e.target.classList.contains("text")) {
    console.log("Show Trending Post");
  }
})

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


// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", function (ev) {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
    loadPosts();
  }
});