// get date string from Date object
function getDateString(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return `${interval} ${intervalType} ago`;
}

function cleanList(hash, elements, toSkip) {
  elements.forEach(element => {
    if (!hash[element._id]) hash[element._id] = [];
  })

  elements.forEach((element, index) => {
    const tempArr = hash[element._id].slice();
    tempArr.push(index + toSkip);
    hash[element._id] = tempArr;
  })

  let shiftIndex = 0;

  for (id in hash) {
    const tempArr = hash[id].slice();
    if (tempArr.length > 1) {
      for (let i = 1; i < tempArr.length; i++) {
        const index = tempArr[i] % 10;
        // delete element from elements
        elements.splice(index + shiftIndex, 1);
        shiftIndex--;
        // delete element from hash
        tempArr.splice(i, 1);
      }
      hash[id] = tempArr;
    }
  }
}