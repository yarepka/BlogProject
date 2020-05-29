let commentsToSkip = 0;
let commentsLimit = 20;
const bucketsLimit = 1;
let isLoading = true;
let isEnd = false;
const hash = {};

// comments container
const commentsContainer = document.querySelector(".post-comments");

// Comments
// ------------------
// ------------------

// Get 20 comments
async function loadComments(url) {
  // Fetch comments
  const resData = await Server.get(url);

  resData.comments.forEach(comment => {
    if (!hash[comment._id]) hash[comment._id] = [];
  })

  resData.comments.forEach((comment, index) => {
    const tempArr = hash[comment._id].slice();
    tempArr.push(index + commentsToSkip);
    hash[comment._id] = tempArr;
  })

  let shiftIndex = 0;

  for (id in hash) {
    const tempArr = hash[id].slice();
    console.log("tempArr BEFORE delete: ", tempArr);
    if (tempArr.length > 1) {
      for (let i = 1; i < tempArr.length; i++) {
        const index = tempArr[i] % 10;
        // delete element from comments
        console.log(`Delete ${resData.comments[index + shiftIndex]} element, (tempArr[i] % 10) = ${index + shiftIndex}, shiftIndex: ${shiftIndex}`);
        resData.comments.splice(index + shiftIndex, 1);
        shiftIndex--;
        // delete element from hash
        tempArr.splice(i, 1);

        console.log("tempArr AFTER delete: ", tempArr);
      }
      hash[id] = tempArr;
    }
  }


  commentsToSkip += resData.commentsQuantity;
  UI.appendComments(commentsContainer, resData.comments);
  console.log("resData: ", resData, ", commentsToSkip: ", commentsToSkip, ", isLoading: ", isLoading);
  isLoading = false;
  if (resData.commentsQuantity === 0) {
    console.log("End");
    isEnd = true;
  } else {
    isEnd = false;
  }
}
