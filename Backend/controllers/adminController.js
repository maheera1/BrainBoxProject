const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Resource = require('../models/Resource');

exports.registerAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the Admin user
    const newAdmin = new User({
      fullName,
      email,
      passwordHash: hashedPassword,
      role: 'Admin',
      isApproved: true // Admins are automatically approved
    });

    await newAdmin.save();

    res.status(201).send({ message: 'Admin registered successfully!' });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const admin = await User.findOne({ email, role: 'Admin' });
    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Update `updatedAt`
    admin.updatedAt = new Date();
    await admin.save();

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.send({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

  exports.approveTeacher = async (req, res) => {
    const { id } = req.params;
  
    try {
      const teacher = await User.findById(id);
      if (!teacher || teacher.role !== 'Teacher') {
        return res.status(404).send({ message: 'Teacher not found' });
      }
  
      // Approve Teacher
      teacher.isApproved = true;
      await teacher.save();
  
      res.send({ message: 'Teacher approved successfully!' });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      // Fetch teachers and students separately
      const teachers = await User.find({ role: 'Teacher' });
      const students = await User.find({ role: 'Student' });
  
      // Send a structured response
      res.send({
        teachers,
        students,
      });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  

  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Expects an object of fields to update
    try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) return res.status(404).send({ message: 'User not found' });
       // Update `updatedAt`
    user.updatedAt = new Date();
    await user.save();
      res.send({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };

  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).send({ message: 'User not found' });
      res.send({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };

  // Fetch user details by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (err) {
    res.status(500).send({ message: "Server Error", error: err.message });
  }
};

  exports.getDeletionRequests = async (req, res) => {
    try {
      const requests = await Notification.find({ type: 'DeletionRequest' });
      res.send(requests);
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  exports.handleDeletionRequest = async (req, res) => {
    const { id } = req.params; // Deletion request ID
    const { action, userId } = req.body; // 'approve' or 'reject', and userId for both actions
    
    try {
      // Find the deletion request notification
      const request = await Notification.findById(id);
      if (!request) {
        return res.status(404).send({ message: 'Request not found' });
      }
  
      if (!userId) {
        return res.status(400).send({ message: 'UserId is required' });
      }
  
      if (action === 'approve') {
        // Find the user to delete using the passed userId
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
          return res.status(404).send({ message: 'User not found for deletion' });
        }
  
        // Delete the user if approved
        await User.findByIdAndDelete(userToDelete._id);
  
        // Mark the request as handled
        request.isRead = true;
        await request.save();
  
        res.send({ message: 'Request approved and user deleted successfully.' });
  
      } else if (action === 'reject') {
        // Find the user to reject using the passed userId
        const userToReject = await User.findById(userId);
        if (!userToReject) {
          return res.status(404).send({ message: 'User not found for rejection' });
        }
  
        // Notify the user about the rejection
        const rejectionNotification = new Notification({
          message: 'Your account deletion request has been rejected.',
          recipientRole: userToReject.role,
          data: { userId: userToReject._id }
        });
  
        await rejectionNotification.save();
  
        // Mark the deletion request as handled
        request.isRead = true;
        await request.save();
  
        res.send({ message: 'Request rejected successfully and user notified.' });
  
      } else {
        return res.status(400).send({ message: 'Invalid action. Please provide "approve" or "reject".' });
      }
    } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
  // View Admin Profile
// View Admin Profile
exports.viewProfile = async (req, res) => {
  try {
    // Find the admin by ID and ensure the role is "Admin"
    const admin = await User.findOne({ _id: req.user.id, role: "Admin" }).select("-passwordHash");
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send({ message: "Server Error", error: err.message });
  }
};


  // Admin sets permissions for a resource
exports.setResourcePermissions = async (req, res) => {
  const { resourceId, permissions } = req.body;

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).send({ message: 'Resource not found' });
    }

    // Ensure the user is an Admin
    if (req.user.role !== 'Admin') {
      return res.status(403).send({ message: 'Only Admin can set resource permissions' });
    }

    // Set permissions for the resource
    resource.permissions = permissions;
    await resource.save();

    res.send({ message: 'Permissions updated successfully', resource });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};