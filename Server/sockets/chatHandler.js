const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io, socket) => {
  const userId = socket.userId;

  // Join a conversation room
  socket.on("joinConversation", async (conversationId) => {
    try {
      // Verify user is part of this conversation
      const conversation = await Conversation.findById(conversationId);
      if (conversation && conversation.participants.includes(userId)) {
        socket.join(conversationId);
        console.log(
          `📱 User ${socket.user.name} joined conversation: ${conversationId}`
        );

        // Notify other participants that user joined
        socket.to(conversationId).emit("userJoinedConversation", {
          userId,
          userName: socket.user.name,
          conversationId,
        });
      }
    } catch (error) {
      console.error("Error joining conversation:", error);
      socket.emit("error", { message: "Failed to join conversation" });
    }
  });

  // Leave a conversation room
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(
      `📱 User ${socket.user.name} left conversation: ${conversationId}`
    );

    // Notify other participants that user left
    socket.to(conversationId).emit("userLeftConversation", {
      userId,
      userName: socket.user.name,
      conversationId,
    });
  });

  // Handle sending messages
  socket.on("sendMessage", async (messageData) => {
    try {
      const { conversationId, text, messageType = "text" } = messageData;

      // Verify user is part of this conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        socket.emit("error", {
          message: "Not authorized for this conversation",
        });
        return;
      }

      // Create message in database
      const message = await Message.create({
        conversationId,
        matchId: conversation.matchId,
        sender: userId,
        text: text.trim(),
        messageType,
      });

      // Populate sender info
      await message.populate("sender", "name");

      // Update conversation with last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date(),
      });

      // Emit to all users in the conversation room
      io.to(conversationId).emit("messageReceived", {
        _id: message._id,
        conversationId: message.conversationId,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
        },
        text: message.text,
        messageType: message.messageType,
        seen: message.seen,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });

      console.log(
        `💬 Message sent in conversation ${conversationId} by ${socket.user.name}`
      );
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    const { conversationId, isTyping } = data;
    socket.to(conversationId).emit("userTyping", {
      userId,
      userName: socket.user.name,
      isTyping,
      conversationId,
    });
  });

  // Handle message seen status
  socket.on("markMessageSeen", async (data) => {
    try {
      const { messageId, conversationId } = data;

      // Update message as seen
      await Message.findByIdAndUpdate(messageId, {
        seen: true,
        seenAt: new Date(),
      });

      // Notify sender that message was seen
      socket.to(conversationId).emit("messageSeen", {
        messageId,
        seenBy: userId,
        seenAt: new Date(),
      });
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  });

  // Handle getting conversation history
  socket.on("getConversationHistory", async (data) => {
    try {
      const { conversationId, page = 1, limit = 50 } = data;

      // Verify user is part of this conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        socket.emit("error", {
          message: "Not authorized for this conversation",
        });
        return;
      }

      // Get messages
      const messages = await Message.find({ conversationId })
        .populate("sender", "name")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      socket.emit("conversationHistory", {
        conversationId,
        messages: messages.reverse(),
        page,
        hasMore: messages.length === limit,
      });
    } catch (error) {
      console.error("Error getting conversation history:", error);
      socket.emit("error", { message: "Failed to get conversation history" });
    }
  });
};
