// Init
const textareaTitle = document.querySelector("#add-post-form .title");
const textareaText = document.querySelector("#add-post-form .text");
const dropdownBtn = document.querySelector("#post-creation .dropdown-button");
const communityChoice = document.getElementById("community-choice");

const dropdownCommunityList = document.querySelector("#post-creation .community-list");

// Functions
// -------------------------
// -------------------------
function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (1 + o.scrollHeight) + "px";
}

function toggleDropDown(e) {
  console.log("toggle");
  dropdownCommunityList.classList.toggle("no-display");

  const icon = document.querySelector(".icon-arrow");;

  if (icon.classList.contains("fa-arrow-down")) {
    icon.classList.remove("fa-arrow-down");
    icon.classList.add("fa-arrow-up");
  } else {
    icon.classList.remove("fa-arrow-up");
    icon.classList.add("fa-arrow-down");
  }

  e.preventDefault();
}

function showDropDown(e) {
  dropdownCommunityList.classList.remove("no-display");

  const icon = document.querySelector(".icon-arrow");;
  if (!icon.classList.contains("fa-arrow-up")) {
    icon.classList.remove("fa-arrow-down");
    icon.classList.add("fa-arrow-up");
  }

  e.preventDefault();
}

function closeDropDown(e) {
  if (!dropdownCommunityList.classList.contains("no-display")) {
    dropdownCommunityList.classList.add("no-display");
  }

  const icon = document.querySelector(".icon-arrow");;
  if (!icon.classList.contains("fa-arrow-down")) {
    icon.classList.remove("fa-arrow-up");
    icon.classList.add("fa-arrow-down");
  }

  e.preventDefault();
}

function hideAllListItems() {
  console.log("HIDE ALL");
  const lis = dropdownCommunityList.querySelectorAll("li");

  lis.forEach(li => {
    if (!li.classList.contains("no-display")) li.classList.add("no-display");
  });
}

function showLiByName(name) {
  const nameRegExp = new RegExp(name, "i");
  const lis = dropdownCommunityList.querySelectorAll("li");
  lis.forEach(li => {
    const communityName = li.querySelector(".community-name").textContent;
    if (communityName.match(nameRegExp) !== null) {
      li.classList.remove("no-display");
    }
  })
}

// Event Listeners
// -------------------------
// -------------------------

// Text areas
textareaTitle.addEventListener("keyup", (e) => {
  textAreaAdjust(textareaTitle);
});

textareaText.addEventListener("keyup", (e) => {
  textAreaAdjust(textareaText);
});


// Community Input
communityChoice.addEventListener("focus", (e) => {
  showDropDown(e);
})

communityChoice.addEventListener("keyup", (e) => {
  hideAllListItems();
  showLiByName(communityChoice.value.trim());
})

// Dropdown List
dropdownCommunityList.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("community-button"))
    communityChoice.value = e.target.querySelector(".community-name").textContent.trim();

  if (e.target.classList.contains("image")) {
    const btn = e.target.parentElement;
    communityChoice.value = btn.querySelector(".community-name").textContent.trim();
  }

  if (e.target.classList.contains("community-name"))
    communityChoice.value = e.target.textContent.trim();

  e.preventDefault();
})

// Window
window.addEventListener("click", (e) => {
  if (!e.target.classList.contains("community-choice") && !e.target.classList.contains("icon-search") && !e.target.classList.contains("icon-arrow") && !e.target.classList.contains("dropdown-button")) {
    closeDropDown(e);
  }
})

dropdownBtn.addEventListener("click", toggleDropDown);
