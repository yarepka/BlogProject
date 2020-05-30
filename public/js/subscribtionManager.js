async function manageClick(button, communityId) {
  if (button.classList.contains("join")) {
    // join community
    const isJoined = await join(communityId);
    if (isJoined) changeButton(button, "quit");
  } else if (button.classList.contains("quit")) {
    // quit community
    const isQuit = await quit(communityId);
    if (isQuit) changeButton(button, "join");
  }
}

async function join(communityId) {
  const resData = await Server.post(`${domain}/communities/join`, { communityId: communityId });
  if (resData.status === "OK") return true;
  return false;
}
async function quit(communityId) {
  const resData = await Server.post(`${domain}/communities/quit`, { communityId: communityId });
  if (resData.status === "OK") return true;
  return false;
}

function changeButton(button, newClass) {
  if (newClass === "join") {
    if (button.classList.contains("quit")) button.classList.remove("quit");
    button.classList.add("join");
    button.textContent = "join";
  } else if (newClass === "quit") {
    if (button.classList.contains("join")) button.classList.remove("join");
    button.classList.add("quit");
    button.textContent = "quit";
  }
}