// Add comment
const addCommentForm = document.getElementById("add-comment-form");
const commentInput = document.getElementById("comment-input");
const addCommentBtn = document.querySelector(".btn-add-comment");

// disable comment btn by default

function disableAddCommentBtn() {
  addCommentBtn.disabled = true;
  if (!addCommentBtn.classList.contains("disabled"))
    addCommentBtn.classList.add("disabled");
}

function enableAddCommentBtn() {
  addCommentBtn.disabled = false;
  addCommentBtn.classList.remove("disabled");
}

function clearCommentInput() {
  commentInput.value = "";
  console.log("cleared");
}

function getCommentInputData() {
  return commentInput.value.trim();
}

// Add new comment
async function addComment(e) {
  e.preventDefault();

  const commentInputData = getCommentInputData();

  if (commentInputData === "") {
    console.log("Comment Input is Empty");
  } else {
    const res = await Server.post(`${domain}/posts/add-new-comment`, { postId: document.querySelector(".post-wrapper").dataset.id, commentText: commentInputData });
    clearCommentInput();
  }
}

// Event Listeners
addCommentForm.addEventListener("submit", addComment);

commentInput.addEventListener("keyup", (e) => {
  const commentInputData = getCommentInputData();
  console.log(commentInputData);
  if (commentInputData !== "")
    enableAddCommentBtn();
  else
    disableAddCommentBtn();
});