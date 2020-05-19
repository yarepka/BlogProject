// Init
const textareaTitle = document.querySelector("#add-post-form .title");
const textareaText = document.querySelector("#add-post-form .text");
const dropdownBtn = document.querySelector("#post-creation .community-choice > div > a");

const dropdownCommunity = document.querySelector("#post-creation .community-list");

// Functions
function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (1 + o.scrollHeight) + "px";
}

// Event Listeners
textareaTitle.addEventListener("keyup", (e) => {
  textAreaAdjust(textareaTitle);
});

textareaText.addEventListener("keyup", (e) => {
  textAreaAdjust(textareaText);
});

dropdownBtn.addEventListener("click", (e) => {
  dropdownCommunity.classList.toggle("no-display");

  const icon = dropdownBtn.querySelector("i");

  if (icon.classList.contains("fa-arrow-down")) {
    icon.classList.remove("fa-arrow-down");
    icon.classList.add("fa-arrow-up");
  } else {
    icon.classList.remove("fa-arrow-up");
    icon.classList.add("fa-arrow-down");
  }

  e.preventDefault();
});