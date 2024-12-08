const bcrypt = require('bcrypt'); // For hashing and comparing passwords
const jwt = require('jsonwebtoken'); // For generating and verifying JWT tokens
const User = require('../models/User'); // To interact with the User schema
const Notification = require('../models/Notification');
const Group = require('../models/Group');

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find student by email
    const student = await User.findOne({ email, role: 'Student' });
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Update `updatedAt`
    student.updatedAt = new Date();
    await student.save();

    // Generate JWT
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.send({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

  exports.viewProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('-passwordHash');
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.send(student);
    } catch (err) {
        res.status(500).send({ message: 'Server Error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;

  try {
      const student = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
      if (!student) {
          return res.status(404).send({ message: 'Student not found' });
      }
       // Update `updatedAt`
    user.updatedAt = new Date();
    await user.save();
      res.send({ message: 'Profile updated successfully', student });
  } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
  }
};


exports.requestAccountDeletion = async (req, res) => {
    try {
        const notification = new Notification({
            message: `Student ${req.user.fullName} has requested account deletion.`,
            type: 'DeletionRequest',
            userId: req.user.id,
        });

        await notification.save();
        res.send({ message: 'Account deletion request submitted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Server Error', error: err.message });
    }
};

// Student joins a group
// Student joins a group
exports.joinGroup = async (req, res) => {
  const { groupId } = req.body;
  const studentId = req.user.id; // Extract student ID from token

  try {
    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send({ message: 'Group not found' });
    }

    // Check if the group has blocked the student
    if (group.blockedUsers.includes(studentId)) {
      return res.status(403).send({ message: 'You are blocked from joining this group.' });
    }

    // Check if the student is already in the group
    const isAlreadyMember = group.members.some((member) => member.user.toString() === studentId);
    if (isAlreadyMember) {
      return res.status(400).send({ message: 'You are already a member of this group.' });
    }

    // Add the student to the group
    group.members.push({ user: studentId, role: 'Student' });
    await group.save();

    res.send({ message: 'Successfully joined the group.', group });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Student views all approved groups
exports.getApprovedGroups = async (req, res) => {
  try {
    // Fetch only approved groups
    const groups = await Group.find({ approved: true })
      .select('name subject description createdBy members')
      .populate('createdBy', 'fullName email') // Include teacher/admin who created the group
      .populate('members.user', 'fullName email'); // Include basic member info
    res.status(200).send(groups);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};
