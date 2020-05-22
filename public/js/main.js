const domain = "http://localhost:3000";

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
const loginRedirect = document.getElementById("login-redirect");
const loginSubmitForm = document.getElementById("login-form");
const loginPassword = document.getElementById("login-password");
const loginUsername = document.getElementById("login-username");
const loginCsrf = document.getElementById("login-csrf");

// Sign Up
const signUpForm = document.getElementById("signup");
const signUpFormCloseBtn = document.getElementById("close-signup");
const signUpRedirect = document.getElementById("signup-redirect");
const signUpSubmitForm = document.getElementById("signup-form");
const signUpUsername = document.getElementById("signup-username");
const signUpPassword = document.getElementById("signup-password");
const signUpConfirmPassword = document.getElementById("signup-confirm-password");
const signUpCsrf = document.getElementById("signup-csrf");


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
async function showLogin(e) {
  console.log("Show Login Form");

  // get csrf
  const resObject = await Server.get(`${domain}/user/login`);

  // set csrf
  loginCsrf.value = resObject.csrfToken;

  // hide sign up
  UI.hideForm(signUpForm);

  // clean sign up form
  UI.cleanSubmitForm([signUpUsername, signUpPassword, signUpConfirmPassword]);

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
  UI.cleanSubmitForm([loginUsername, loginPassword]);

  e.preventDefault();
}

// Show Sign Up form
async function showSignUp(e) {
  console.log("Show Sign Up Form");

  // get csrf
  const resObject = await Server.get(`${domain}/user/signup`);

  // set csrf
  signUpCsrf.value = resObject.csrfToken;

  // hide login
  UI.hideForm(loginForm);

  // clean login form
  UI.cleanSubmitForm([loginUsername, loginPassword]);

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
  UI.cleanSubmitForm([signUpUsername, signUpPassword, signUpConfirmPassword]);

  e.preventDefault();
}

// Check username
async function isUsernameAvailable(input) {
  /* https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username */
  const re = /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  if (re.test(String(input.value.trim()))) {
    const resData = await Server.post(`${domain}/user/checkUsername`, { username: input.value.trim() }, { "CSRF-Token": signUpCsrf.value });
    if (resData.isUsernameRegistered) {
      UI.showError(input, "Username is already taken");
      return false;
    } else {
      UI.showSuccess(input);
      return true;
    }
  } else {
    UI.showError(input, "Invalid username");
    return false;
  }
}

// Check password match
function checkPasswordsMatch(input1, input2) {
  if (input1.value.trim() !== input2.value.trim()) {
    UI.showError(input2, "Passwords do not match");
    UI.showError(input1, "Passwords do not match");
    return false;
  }

  return true;
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
  let errorsCount = 0;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      UI.showError(input, `${getFieldName(input)} is required`);
      errorsCount++;
    } else {
      UI.showSuccess(input);
    }
  });

  return errorsCount > 0 ? false : true;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    UI.showError(input, `${getFieldName(input)} must be at least ${min} characters`);
    return false;
  } else if (input.value.length > max) {
    UI.showError(input, `${getFieldName(input)} must be less than ${max} characters`);
    return false;
  } else {
    UI.showSuccess(input);
    return true;
  }
}

// Helper functions
//-----------------
//-----------------
function getRoute(url) {
  const route = url.slice(domain.length, url.length);

  return route;
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

logo.addEventListener("click", refreshPage);

// Login / Signup forms
// ------------------------
// ------------------------
if (loginBtn) loginBtn.addEventListener("click", showLogin);
if (signUpBtn) signUpBtn.addEventListener("click", showSignUp);
loginFormCloseBtn.addEventListener("click", closeLogin);
signUpRedirect.addEventListener("click", showSignUp);

signUpFormCloseBtn.addEventListener("click", closeSignup);
loginRedirect.addEventListener("click", showLogin);

// Login / Signup submit forms
// ------------------------
// ------------------------
loginSubmitForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const required = checkRequired([loginUsername, loginPassword]);
  const usernameLength = checkLength(loginUsername, 6, 25);
  const passwordLength = checkLength(loginPassword, 6, 25);

  if (required && usernameLength && passwordLength) {
    const res = await Server.post(`${domain}/user/signin`, { username: loginUsername.value, password: loginPassword.value }, { "CSRF-Token": loginCsrf.value });

    if (res.status === "OK") {
      window.location.href = `${domain}${getRoute(window.location.href)}`;
    } else {
      if (res.errorType === "username") {
        UI.showError(loginUsername, res.errorMsg);
      } else if (res.errorType === "password") {
        UI.showError(loginPassword, res.errorMsg);
      }
    }
  }
})

signUpSubmitForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const required = checkRequired([signUpPassword, signUpConfirmPassword]);
  const usernameUnique = await isUsernameAvailable(signUpUsername);
  const password = checkLength(signUpPassword, 6, 25);
  const confirmPassword = checkLength(signUpConfirmPassword, 6, 25);
  const passwordsMatch = checkPasswordsMatch(signUpPassword, signUpConfirmPassword);

  if (required && password && confirmPassword && passwordsMatch && usernameUnique) {
    await Server.post(`${domain}/user/signup`, { username: signUpUsername.value, password: signUpPassword.value }, { "CSRF-Token": signUpCsrf.value });
    console.log(`${domain}${getRoute(window.location.href)}`);
  }
});

// Window
window.addEventListener("mousedown", e => {
  if (e.target.id === "login") closeLogin(e);
  else if (e.target.id === "signup") closeSignup(e);
})