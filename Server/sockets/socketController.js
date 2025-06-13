const chatHandler = require("./chatHandler");
const notifHandler = require("./notifHandler");
const socketAuth = require("../middleware/socketAuth");

const socketController = (io) => {
  // Use socket authentication middleware
  io.use(socketAuth);

  // Track online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`✅ User connected: ${socket.user.name} (${userId})`);

    // Add user to online users
    onlineUsers.set(userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date(),
    });

    // Broadcast user online status
    socket.broadcast.emit("userOnline", userId);

    // Join user to their personal room for notifications
    socket.join(`user_${userId}`);

    // Setup chat handler
    chatHandler(io, socket);

    // Setup notification handler
    notifHandler(io, socket);

    // Handle user going offline
    socket.on("disconnect", (reason) => {
      console.log(`❌ User disconnected: ${socket.user.name} (${reason})`);

      // Remove from online users
      onlineUsers.delete(userId);

      // Broadcast user offline status
      socket.broadcast.emit("userOffline", userId);
    });

    // Handle manual status updates
    socket.on("updateStatus", (status) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).status = status;
        socket.broadcast.emit("userStatusUpdate", { userId, status });
      }
    });

    // Send current online users to newly connected user
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // Utility function to get online users
  io.getOnlineUsers = () => {
    return Array.from(onlineUsers.values());
  };

  // Utility function to check if user is online
  io.isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Utility function to send notification to specific user
  io.sendNotificationToUser = (userId, notification) => {
    io.to(`user_${userId}`).emit("notificationReceived", notification);
  };
};

module.exports = socketController;
