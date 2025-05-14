// sockets/notifHandler.js
module.exports = (io, socket) => {
  socket.on("subscribeNotifications", (userId) => {
    socket.join(`notif_${userId}`);
  });

  socket.on("sendNotification", ({ userId, notification }) => {
    io.to(`notif_${userId}`).emit("receiveNotification", notification);
  });
};
