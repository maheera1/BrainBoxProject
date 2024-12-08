const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher/Admin who created the group
  approved: { type: Boolean, default: false }, // Indicates if the group is approved by Admin
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
      role: { type: String, enum: ['Teacher', 'Student'], required: true } // Role within the group
    }
  ],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // New field for blocked users
  createdAt: { type: Date, default: Date.now },
  chatSettings: {
    enableChatForStudents: { type: Boolean, default: true }, // Whether students can chat
  },
  
});

module.exports = mongoose.model('Group', GroupSchema);
