function joinRoom(roomName) {
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span`;
  });

  nsSocket.on("historyCatchup", (history) => {
    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    history.forEach((msg) => {
      const newMessage = buildHTML(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMessage;
      messageUl.scrollTo(0, messageUl.scrollHeight);
    });
  });
  nsSocket.on("updateMembers", (members) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${members} <span class="glyphicon glyphicon-user"></span`;
    document.querySelector(".curr-room-text").innerHTML = `${roomName}`;
  });

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    console.log(e.target.value);
    let messages = Array.from(document.getElementsByClassName("message-text"));
    console.log(messages);
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // the msg does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
