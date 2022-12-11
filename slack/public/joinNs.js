function joinNs(endPoint,username) {
  if (nsSocket) {
    nsSocket.close();
    // document
    //   .querySelector("#user-input")
    //   .removeEventListener("submit", formSubmission);
  }
  nsSocket = io(`http://localhost:9000${endPoint}`, {
    transports: ["websocket", "polling"],
    query: {
      username,
    },
  });
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });

    Array.from(document.getElementsByClassName("room")).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log("someOne clicked on, ", e.target.innerText);
        joinRoom(e.target.innerText);
      });
    });

    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    console.log("topRoom ", topRoomName);
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    const newHTML = buildHTML(msg);
    console.log(msg);
    document.querySelector("#messages").innerHTML += newHTML;
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  nsSocket.emit("newMessageToServer", {
    text: newMessage,
  });
}

function buildHTML(msg) {
  const time = new Date(msg.time).toLocaleString();
  const newHTML = `<li>
<div class="user-image">
  <img src="${msg.avatar}" />
</div>
<div class="user-message">
  <div class="user-name-time">${msg.username} <span>${time}</span></div>
  <div class="message-text">
   ${msg.text}
  </div>
</div>
</li>`;

  return newHTML;
}
