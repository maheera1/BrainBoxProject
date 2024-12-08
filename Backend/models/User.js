const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }, // Hashed password for secure storage
  role: { type: String, enum: ['Admin', 'Teacher', 'Student'], required: true },
  isApproved: { type: Boolean, default: false }, // Approval required for Teachers
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For Students added by a Teacher
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
