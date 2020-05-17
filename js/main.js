const navbar = document.getElementById("main-nav");
const dropdown = document.querySelector("#main-nav .dropdown");
let scrolled = false;

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
      }, 600);
    } else {
      scrolled = false;
    }
  }
}