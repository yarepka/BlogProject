// Navbar Init
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------
const navbar = document.getElementById("main-nav");
const dropdown = document.querySelector("#main-nav .dropdown");
const logo = document.querySelector("#main-nav .logo");
let scrolled = false;


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

// Event Listeners
// -------------------------
// -------------------------
// -------------------------
// -------------------------
// -------------------------


// Navbar
logo.addEventListener("click", refreshPage);

// Window
window.onscroll = function () {
  if (dropdown.classList.contains("no-display")) {
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