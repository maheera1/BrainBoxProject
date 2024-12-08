const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    groupId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Group',
      required: false // Now optional, so resources are not tied to any group by default
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    resourceType: { type: String, enum: ['PDF', 'Link', 'Video', 'Image'], required: true },
    url: { type: String }, // For external resources (e.g., YouTube, Google Drive)
    filePath: { type: String }, // For uploaded files
    tags: [{ type: String }], // Array of tags for categorization
    permissions: { 
      type: Map, 
      of: [String], 
      default: {} // Permissions will be managed later
    },
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Resource', ResourceSchema);
