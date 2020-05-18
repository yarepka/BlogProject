// Navbar Init
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------

// Navbar
// ------------------
// ------------------
const navbar = document.getElementById("main-nav");
const search = document.getElementById("search");
const loginBtn = document.querySelector("#main-nav .login");
const signUpBtn = document.querySelector("#main-nav .signup");
const userBtn = document.querySelector("#main-nav .user");
const navBarDropdown = document.querySelector("#main-nav .dropdown");
const logo = document.querySelector("#main-nav .logo");

let scrolled = false;

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
  console.log("Page refreshed");
  window.location.href = "/";
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
  UI.hideForm(signUpForm);

  // clean sign up form
  UI.cleanSubmitForm([signUpEmail, signUpPassword, signUpConfirmPassword]);

  // unhide login
  UI.showForm(loginForm);

  e.preventDefault();
}

// Hide Login Form
function closeLogin(e) {
  console.log("Close Login Form");

  // hide login
  UI.hideForm(loginForm);

  // clean form error/success messages
  UI.cleanSubmitForm([loginEmail, loginPassword]);

  e.preventDefault();
}

// Show Sign Up form
function showSignUp(e) {
  console.log("Show Sign Up Form");

  // hide login
  UI.hideForm(loginForm);

  // clean login form
  UI.cleanSubmitForm([loginEmail, loginPassword]);

  // unhide login
  UI.showForm(signUpForm);

  e.preventDefault();
}

// Hide Sign Up form
function closeSignup(e) {
  console.log("Close Signup Form");

  // hide signup
  UI.hideForm(signUpForm);

  // clean form error/success messages
  UI.cleanSubmitForm([signUpEmail, signUpPassword, signUpConfirmPassword]);

  e.preventDefault();
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(String(input.value.trim()).toLowerCase())) {
    UI.showSuccess(input);
  } else {
    UI.showError(input, "Email is not valid")
  }
}

// Check password match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    UI.showError(input1, "Passwords do not match");
    UI.showError(input2, "Passwords do not match");
  }
}

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
      UI.showError(input, `${getFieldName(input)} is required`)
    } else {
      UI.showSuccess(input);
    }
  });
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    UI.showError(input, `${getFieldName(input)} must be at least ${min} characters`);
  } else if (input.value.length > max) {
    UI.showError(input, `${getFieldName(input)} must be less than ${max} characters`);
  } else {
    UI.showSuccess(input);
  }
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
search.addEventListener("keyup", searchForPost);
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



// Login / Signup forms
// ------------------------
// ------------------------
loginBtn.addEventListener("click", showLogin);
signUpBtn.addEventListener("click", showSignUp);
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
  checkLength(signUpConfirmPassword, 6, 25);
  checkPasswordsMatch(signUpPassword, signUpConfirmPassword);

  if (signUpEmail.parentElement.classList.contains("success") && signUpPassword.parentElement.classList.contains("success") && signUpConfirmPassword.parentElement.classList.contains("success")) {
    console.log("Sign Up Form Submit");
  }
});

// Navbar
logo.addEventListener("click", refreshPage);

// Window
window.onscroll = function () {
  if (navBarDropdown.classList.contains("no-display")) {
    // scrolled 100px or more
    if (window.pageYOffset > 100) {
      if (!scrolled) {
        navbar.style.transform = "translateY(-70px)";
      }
      // wait for 200ms
      setTimeout(function () {
        navbar.style.transform = "translateY(0)";
        scrolled = true;
      }, 300);
    } else {
      scrolled = false;
    }
  }
}