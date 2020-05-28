let postsToSkip = 0;
const postsLimit = 10;
let isLoading = true;
let isEnd = false;
const hash = {};

// Posts
// ------------------
// ------------------

// Get 10 posts
async function loadPosts(url) {
  // Fetch posts
  const resData = await Server.get(url);

  resData.posts.forEach(post => {
    if (!hash[post._id]) hash[post._id] = [];
  })

  resData.posts.forEach((post, index) => {
    const tempArr = hash[post._id];
    tempArr.push(index + postsToSkip);
    hash[post._id] = tempArr;
  })

  let shiftIndex = 0;

  for (id in hash) {
    const tempArr = hash[id];
    console.log("tempArr BEFORE delete: ", tempArr);
    if (tempArr.length > 1) {
      for (let i = 1; i < tempArr.length; i++) {
        const index = tempArr[i] % 10;
        // delete element from posts
        console.log(`Delete ${resData.posts[index + shiftIndex]} element, (tempArr[i] % 10) = ${index + shiftIndex}, shiftIndex: ${shiftIndex}`);
        resData.posts.splice(index + shiftIndex, 1);
        shiftIndex--;
        // delete element from hash
        tempArr.splice(i, 1);

        console.log("tempArr AFTER delete: ", tempArr);
      }
      hash[id] = tempArr;
    }
  }

  postsToSkip += resData.postsLength;
  console.log("postsToSkip: ", postsToSkip, "resData.postsLength: ", resData.postsLength);

  UI.appendPosts(postsContainer, currentLayout, resData.posts);
  console.log("resDat: ", resData, ", postsToSkip: ", postsToSkip, ", isLoading: ", isLoading);
  isLoading = false;
  if (resData.postsLength === 0) {
    isEnd = true;
  } else {
    isEnd = false;
  }
}


