// /controllers/chatController.js
const Message = require("../models/Message");

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { matchId, text } = req.body;

    const message = await Message.create({
      matchId,
      sender: req.user._id,
      text,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// Get chat history
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ matchId: req.params.matchId });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
