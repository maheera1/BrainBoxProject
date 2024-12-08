const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  recipientRole: {
    type: String,
    default: 'Admin', // Default recipient is Admin, can be changed if needed
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Additional information (e.g., teacherId, userId)
  },
  type: {
    type: String,
    enum: ['General', 'DeletionRequest'], // Define types for better categorization
    default: 'General',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user making the request
    ref: 'User',
    required: function () {
      return this.type === 'DeletionRequest';
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
