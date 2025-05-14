// sockets/chatHandler.js
module.exports = (io, socket) => {
  socket.on("sendMessage", ({ matchId, message }) => {
    socket.to(matchId).emit("receiveMessage", message);
  });

  socket.on("joinChat", (matchId) => {
    socket.join(matchId);
  });
};
