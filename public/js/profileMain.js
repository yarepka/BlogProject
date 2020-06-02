const communitiesList = document.querySelector(".communities-list");
// image input
const imageFileInput = document.getElementById("image-file");
// add-profile-image form
const addProfileImageForm = document.getElementById("add-profile-image");
// add-profile-image submit button
const addProfileImageBtn = document.getElementById("add-profile-image-submit");
// profile image
const profileImage = document.querySelector(".profile-image");

loadPosts(`${domain}/posts/userposts?skip=${postsToSkip}&limit=${postsLimit}`);

// Event Listeners
// ---------------------
// ---------------------

// Image input 
// ---------------------
// ---------------------
imageFileInput.addEventListener("change", (e) => {
  console.log("change image");
  addProfileImageBtn.click();
})

// Add Profile Image form
// ---------------------
// ---------------------
addProfileImageForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("addProfileImageForm submit");
  const res = await fetch(`${domain}/user/upload-image`, {
    method: "POST",
    body: new FormData(addProfileImageForm)
  });

  const resData = await res.json();

  if (resData.status !== "ERROR") {
    console.log("Change Image");
    profileImage.setAttribute("src", `./img/${resData.profileImageName}`);
  }
})

// Communities List
// ---------------------
// ---------------------
communitiesList.addEventListener("click", (e) => {
  if (e.target.classList.contains("join") || e.target.classList.contains("quit")) {
    e.preventDefault();
    manageClick(e.target, e.target.parentElement.dataset.id);
  }
})

// Window
// ---------------------
// ---------------------
window.addEventListener("scroll", (e) => {
  if (((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 20)) && !isLoading && !isEnd) {
    isLoading = true;
    window.setTimeout(() => {
      loadPosts(`${domain}/posts/userposts?skip=${postsToSkip}&limit=${postsLimit}`);
    }, 500);
  }
});