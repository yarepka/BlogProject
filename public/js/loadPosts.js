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

  for (id in hash) {
    const tempArr = hash[id];
    console.log("tempArr: ", tempArr);
    if (tempArr.length > 1) {
      postsToSkip++;
      for (let i = 1; i < tempArr.length; i++) {
        // delete element from posts
        console.log(`Delete ${resData.posts[tempArr[i]]} element, (tempArr[i] % 10) = ${(tempArr[i] % 10)}`);
        resData.posts.splice((tempArr[i] % 10), 1);

        // delete element from hash
        tempArr.splice(i, 1);
      }
      hash[id] = tempArr;
    }
  }

  postsToSkip += resData.postsLength;

  UI.appendPosts(postsContainer, currentLayout, resData.posts);
  console.log("resDat: ", resData, ", postsToSkip: ", postsToSkip, ", isLoading: ", isLoading);
  isLoading = false;
  if (resData.postsLength === 0) {
    isEnd = true;
  } else {
    isEnd = false;
  }
}


