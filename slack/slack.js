const express = require("express");
const app = express();
const socketio = require("socket.io");
let namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on("connection", (socket, req) => {
  // console.log("handshake ", socket.handshake);
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  socket.emit("nsList", nsData);
});
// let username = "";
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    //JoinRoom Event
    nsSocket.on("joinRoom", async (roomToJoin, noOfUsersCallback) => {
      const roomToLeave = Array.from(nsSocket.rooms);
      nsSocket.leave(roomToLeave[1]);
      updateUsersInRoom(namespace, roomToLeave[1]);

      nsSocket.join(roomToJoin);
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle == roomToJoin;
      });
      nsSocket.emit("historyCatchup", nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
    });
    // newMEssageToServer Event
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: "http://via.placeholder.com/30",
      };
      const roomTitle = Array.from(nsSocket.rooms);
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle == roomTitle[1];
      });
      nsRoom.addMessage(fullMsg);
      // console.log("nsRoom , ", nsRoom);
      io.of(namespace.endpoint)
        .to(roomTitle[1])
        .emit("messageToClients", fullMsg);
    });
    //Next Event
  });
});

async function updateUsersInRoom(namespace, roomToJoin) {
  const usersInRoom = await io
    .of(namespace.endpoint)
    .in(roomToJoin)
    .allSockets();
  // console.log("totalCount, ", Array.from(usersInRoom).length);
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .emit("updateMembers", Array.from(usersInRoom).length);
}
