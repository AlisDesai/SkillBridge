const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Match = require("../models/Match");
const ErrorResponse = require("../utils/errorResponse");

// Get or create conversation
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    // Check if match exists and user is part of it
    const match = await Match.findById(matchId);
    if (!match) {
      return next(new ErrorResponse("Match not found", 404));
    }

    if (!match.requester.equals(userId) && !match.receiver.equals(userId)) {
      return next(
        new ErrorResponse("Not authorized for this conversation", 403)
      );
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({ matchId })
      .populate("participants", "name")
      .populate("lastMessage");

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        matchId,
        participants: [match.requester, match.receiver],
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name")
        .populate("lastMessage");
    }

    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

// Get all conversations for a user
exports.getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "name")
      .populate("lastMessage")
      .populate("matchId", "status")
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text, messageType = "text" } = req.body;
    const senderId = req.user._id;

    // Check if conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return next(new ErrorResponse("Conversation not found", 404));
    }

    if (!conversation.participants.includes(senderId)) {
      return next(
        new ErrorResponse("Not authorized for this conversation", 403)
      );
    }

    // Create message
    const message = await Message.create({
      conversationId,
      matchId: conversation.matchId,
      sender: senderId,
      text: text.trim(),
      messageType,
    });

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    // Populate sender info
    await message.populate("sender", "name");

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return next(new ErrorResponse("Conversation not found", 404));
    }

    if (!conversation.participants.includes(userId)) {
      return next(
        new ErrorResponse("Not authorized for this conversation", 403)
      );
    }

    // Get messages with pagination
    const messages = await Message.find({ conversationId })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as seen (except sender's own messages)
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        seen: false,
      },
      {
        seen: true,
        seenAt: new Date(),
      }
    );

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ conversationId }),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Mark message as seen
exports.markMessageAsSeen = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return next(new ErrorResponse("Message not found", 404));
    }

    // Can't mark own message as seen
    if (message.sender.equals(userId)) {
      return next(new ErrorResponse("Cannot mark own message as seen", 400));
    }

    await message.markAsSeen();
    res.json({ message: "Message marked as seen" });
  } catch (err) {
    next(err);
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      sender: { $ne: userId },
      seen: false,
      conversationId: {
        $in: await Conversation.find({ participants: userId }).distinct("_id"),
      },
    });

    res.json({ unreadCount });
  } catch (err) {
    next(err);
  }
};
