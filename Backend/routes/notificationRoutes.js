// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all notifications for Admin
router.get('/', authenticateUser, authorizeRoles(['Admin']), getNotifications);

// Mark notification as read
router.put('/:id/read', authenticateUser, authorizeRoles(['Admin']), markAsRead);

module.exports = router;
