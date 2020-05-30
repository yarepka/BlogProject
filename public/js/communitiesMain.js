const communitiesList = document.querySelector(".communities-list");

// Event Listeners
// ----------------------
// ----------------------

// Communities List
communitiesList.addEventListener("click", (e) => {
  if (e.target.classList.contains("join") || e.target.classList.contains("quit")) {
    e.preventDefault();
    manageClick(e.target, e.target.parentElement.dataset.id);
  }
})