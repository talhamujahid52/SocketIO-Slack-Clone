const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

io.on("connection", (socket, req) => {
  socket.emit("messageFromServer", { data: "Welcome to socketio Server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.join("level1");
  // socket.to("level1").emit("joined", `${socket.id} I have jined level 1 room`);
  io.of('/').to('level1').emit('joined', `${socket.id} says I have jined level`)

  // socket.on("newMessageToServer", (msg) => {
  //   console.log(msg);
  //   io.emit("messageToClients", { text: msg.text });
  //   io.of("/").emit("messageToClients", { text: msg.text });
  // });
  // setTimeout(() => {
  //   io.of("/admin").emit(
  //     "welcome",
  //     "Welcome to admin namespace, from main namespace"
  //   );
  // }, [2000]);
});

io.of("/admin").on("connection", (socket) => {
  console.log("Someone connected to admin namespace!");
  io.of("/admin").emit("welcome", "Welcome to admin channel");
});
