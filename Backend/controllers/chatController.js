const ChatMessage = require('../models/ChatMessage');
const Group = require('../models/Group');
const Resource = require('../models/Resource');

// Send a message
exports.sendMessage = async (req, res) => {
    const { groupId, message, resourceId } = req.body;
    const userId = req.user.id;
  
    try {
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).send({ message: 'Group not found' });
      }
  
      // Check if chat is disabled for students and if the user is a student
      if (!group.chatSettings.enableChatForStudents && req.user.role === 'Student') {
        return res.status(403).send({ message: 'Chat is disabled for students in this group.' });
      }
  
      // Save the chat message
      const chatMessage = new ChatMessage({
        groupId,
        sender: userId,
        message,
        resourceId,
      });
  
      await chatMessage.save();
  
      // Update `updatedAt` for the user
      const user = await User.findById(userId);
      if (user) {
        user.updatedAt = new Date();
        await user.save();
      }
  
      res.status(201).send(chatMessage);
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
// Fetch messages for a group
exports.getMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await ChatMessage.find({ groupId })
      .populate('sender', 'fullName role')
      .populate('resourceId', 'title url');
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Admin sets chat permissions
exports.setChatPermissions = async (req, res) => {
  const { groupId, enableChatForStudents } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(
      groupId,
      { 'chatSettings.enableChatForStudents': enableChatForStudents },
      { new: true }
    );

    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }

    res.status(200).send({ message: 'Chat permissions updated successfully', group });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};
