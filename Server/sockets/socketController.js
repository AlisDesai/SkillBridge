// /sockets/socketController.js
const chatHandler = require("./chatHandler");
const notifHandler = require("./notifHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketController = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Socket auth failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.name);
    chatHandler(io, socket);
    notifHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketController;
