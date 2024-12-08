const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const { sendMessage, getMessages, setChatPermissions } = require('../controllers/chatController');

// Send a message
router.post('/send', authenticateUser, sendMessage);

// Fetch messages for a group
router.get('/:groupId', authenticateUser, getMessages);

// Admin sets chat permissions
router.put('/permissions', authenticateUser, authorizeRoles(['Admin']), setChatPermissions);

module.exports = router;
