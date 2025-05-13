// /routes/chats.js
const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/chats
router.post('/', protect, sendMessage);

// @route   GET /api/chats/:matchId
router.get('/:matchId', protect, getMessages);

module.exports = router;
