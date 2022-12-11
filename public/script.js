const socket = io("http://localhost:9000", {
  transports: ["websocket", "polling"],
});
const socket2 = io("http://localhost:9000/admin", {
  transports: ["websocket", "polling"],
});
// socket.on("connect", () => {
//   console.log(socket.id);
// });
// socket2.on("connect", () => {
//   console.log("Admin socket ", socket2.id);
// });
socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});
socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", {
    data: "Data From the Client on Main nameSpace!",
  });
});

socket.on("joined", (msg) => {
  console.log("joined Message", msg);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", {
    text: newMessage,
  });
});

// socket.on("messageToClients", (msg) => {
//   console.log(msg);
//   document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
// });
