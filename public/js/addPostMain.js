// Init
const textareaTitle = document.querySelector("#add-post-form .title");
const textareaText = document.querySelector("#add-post-form .text");
const dropdownBtn = document.querySelector("#post-creation .dropdown-button");
const communityChoice = document.getElementById("community-choice");

const dropdownCommunityList = document.querySelector("#post-creation .community-list");
const addPostForm = document.getElementById("add-post-form");

// Functions
// -------------------------
// -------------------------
function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (1 + o.scrollHeight) + "px";
}

async function isCommunityExists(input) {
  const resData = await Server.post(`${domain}/communities/checkCommunity`, { communityName: input.value.trim() });

  if (!resData.isCommunityExists) {
    UI.showError(input, `Community \"${input.value}\" does not exists`);
    return false;
  } else {
    UI.showSuccess(input);
    return true;
  }
}

function toggleDropDown() {
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

}

function showDropDown() {
  dropdownCommunityList.classList.remove("no-display");

  const icon = document.querySelector(".icon-arrow");;
  if (!icon.classList.contains("fa-arrow-up")) {
    icon.classList.remove("fa-arrow-down");
    icon.classList.add("fa-arrow-up");
  }
}

function closeDropDown() {
  if (!dropdownCommunityList.classList.contains("no-display")) {
    dropdownCommunityList.classList.add("no-display");
  }

  const icon = document.querySelector(".icon-arrow");;
  if (!icon.classList.contains("fa-arrow-down")) {
    icon.classList.remove("fa-arrow-up");
    icon.classList.add("fa-arrow-down");
  }

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

textareaTitle.addEventListener("focus", (e) => {
  closeDropDown();
})

textareaText.addEventListener("keyup", (e) => {
  textAreaAdjust(textareaText);
});

textareaText.addEventListener("focus", (e) => {
  closeDropDown();
})


// Community Input
communityChoice.addEventListener("focus", (e) => {
  showDropDown();

  e.preventDefault();
})

communityChoice.addEventListener("keyup", (e) => {
  hideAllListItems();
  showLiByName(communityChoice.value.trim());
})

// Dropdown List
dropdownCommunityList.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("community-button")) {
    communityChoice.value = e.target.querySelector(".community-name").textContent.trim();
    closeDropDown();
  }

  if (e.target.classList.contains("image")) {
    const btn = e.target.parentElement;
    communityChoice.value = btn.querySelector(".community-name").textContent.trim();
    closeDropDown();
  }

  if (e.target.classList.contains("community-name")) {
    communityChoice.value = e.target.textContent.trim();
    closeDropDown();
  }

  e.preventDefault();
})

dropdownBtn.addEventListener("click", e => {
  toggleDropDown();
  e.preventDefault();
});

// Add post form
addPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // check if signUpPassword and signUpConfirmPassword are empty or not
  const required = checkRequired([communityChoice, textareaTitle]);

  const community = await isCommunityExists(communityChoice);
  console.log(required, community);

  if (required && community) {
    console.log("SUBMIT");
    // const resData = await Server.post(`${domain}/posts/add-post`, { community: communityChoice.value.trim(), title: textareaTitle.value.trim(), text: textareaText.value.trim() });
    // console.log("resData: ", resData);

    const res = await fetch(`${domain}/posts/add-post`, {
      method: "POST",
      body: new FormData(addPostForm)
    });

    const resData = await res.json();

    if (resData.status === "ERROR") {
      textareaTitle.value = resData.title;
      textareaText.value = resData.text;
      UI.showError(document.querySelector(".custom-file-upload"), resData.msg);
    } else {
      window.location.href = `${domain}/user/profile`;
    }
  }
})