const express = require("express");
const {
  sendMessage,
  getMessages,
  getUserConversations,
  getOrCreateConversation,
  markMessageAsSeen,
  getUnreadCount,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");
const { body } = require("express-validator");
const { runValidation } = require("../middleware/validator");

const router = express.Router();

// Get all user conversations
router.get("/conversations", protect, getUserConversations);

// Get or create conversation for a match
router.get("/conversations/match/:matchId", protect, getOrCreateConversation);

// Get messages for a conversation
router.get("/conversations/:conversationId/messages", protect, getMessages);

// Send message
router.post(
  "/messages",
  [
    protect,
    body("conversationId")
      .notEmpty()
      .withMessage("Conversation ID is required"),
    body("text").trim().notEmpty().withMessage("Message text is required"),
    body("messageType")
      .optional()
      .isIn(["text", "image", "file"])
      .withMessage("Invalid message type"),
    runValidation,
  ],
  sendMessage
);

// Mark message as seen
router.patch("/messages/:messageId/seen", protect, markMessageAsSeen);

// Get unread message count
router.get("/unread-count", protect, getUnreadCount);

// Legacy routes (keep for backward compatibility)
router.post("/", protect, sendMessage);
router.get("/:matchId", protect, getMessages);

module.exports = router;
