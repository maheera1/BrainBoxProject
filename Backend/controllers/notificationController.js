const Notification = require('../models/Notification');

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from the token

    let query = {};

    if (role === 'Admin') {
      // Admin gets notifications specific to their role
      query.recipientRole = 'Admin';
    } else {
      // Teachers and Students get notifications for their role or user-specific notifications
      query = {
        $or: [
          { recipientRole: role }, // Role-specific notifications (e.g., 'Teacher' or 'Student')
          { 'data.userId': id },   // User-specific notifications
        ],
      };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.send({ notifications });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.send({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};
