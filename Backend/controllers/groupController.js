const Group = require('../models/Group');
const Notification = require('../models/Notification');

// Admin views all groups
// Admin views all groups
exports.getGroups = async (req, res) => {
    try {
      const groups = await Group.find()
        .populate('createdBy', 'fullName email') // Populates creator details
        .populate('members.user', 'fullName email'); // Populates member details
      res.send(groups);
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  

// Admin approves a group created by a Teacher
exports.approveGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }

    if (req.user.role !== 'Admin') {
      return res.status(403).send({ message: 'Only Admin can approve groups' });
    }

    group.approved = true;
    await group.save();

    // Notify Teacher about approval
    const notification = new Notification({
      recipientRole: 'Teacher',
      message: `Your group "${group.name}" has been approved by the Admin.`,
      data: { groupId: group._id },
    });
    await notification.save();

    res.send({ message: 'Group approved successfully', group });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Admin edits group details (name, description, etc.)
exports.editGroup = async (req, res) => {
  const { id } = req.params;
  const { name, subject, description } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }

    // Ensure the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ message: 'Only Admin can edit groups' });
    }

    group.name = name || group.name;
    group.subject = subject || group.subject;
    group.description = description || group.description;

    await group.save();
    res.send(group);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Admin removes a member from the group
exports.removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }

    // Ensure the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ message: 'Only Admin can remove members' });
    }

    group.members = group.members.filter((m) => m.user.toString() !== memberId);
    await group.save();

    res.send({ message: 'Member removed successfully', group });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Admin deletes a group
exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the group by ID
      const group = await Group.findById(id);
      if (!group) {
        return res.status(404).send({ message: 'Group not found' });
      }
  
      // Ensure the user is an Admin
      if (req.user.role !== 'Admin') {
        return res.status(403).send({ message: 'Only Admin can delete groups' });
      }
  
      // Delete the group
      await Group.deleteOne({ _id: id });
  
      res.send({ message: 'Group deleted successfully' });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
// Block user from joining group
// Block user from joining group
exports.blockUser = async (req, res) => {
    const { groupId, userId } = req.body;
  
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).send({ message: 'Group not found' });
      }
  
      if (req.user.role !== 'Admin') {
        return res.status(403).send({ message: 'Only Admin can block users' });
      }
  
      // Check if the user is already blocked
      if (group.blockedUsers.includes(userId)) {
        return res.status(400).send({ message: 'User is already blocked' });
      }
  
      // Add the user to the blockedUsers array
      group.blockedUsers.push(userId);
  
      // Remove the user from the group if they're a member
      group.members = group.members.filter(member => member.user.toString() !== userId);
  
      await group.save();
  
      res.send({ message: 'User blocked from joining the group and removed from members', group });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
  // Unblock user from joining group
  exports.unblockUser = async (req, res) => {
    const { groupId, userId } = req.body; // Group and User to unblock
  
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).send({ message: 'Group not found' });
      }
  
      // Ensure the user is an Admin
      if (req.user.role !== 'Admin') {
        return res.status(403).send({ message: 'Only Admin can unblock users' });
      }
  
      // Check if user is not blocked
      if (!group.blockedUsers.includes(userId)) {
        return res.status(400).send({ message: 'User is not blocked' });
      }
  
      // Remove the user from the blockedUsers array
      group.blockedUsers = group.blockedUsers.filter(user => user.toString() !== userId);
      await group.save();
  
      res.send({ message: 'User unblocked and can now join the group', group });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  