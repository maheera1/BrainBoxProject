const bcrypt = require('bcrypt'); // For hashing passwords and comparing them
const jwt = require('jsonwebtoken'); // For generating and verifying JWT tokens
const User = require('../models/User'); // To interact with the User schema
const Group = require('../models/Group'); // To handle groups if needed in teacher logic
const Notification = require('../models/Notification'); // Import the Notification model
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

exports.registerTeacher = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Teacher account
    const newTeacher = new User({
      fullName,
      email,
      passwordHash: hashedPassword,
      role: 'Teacher',
      isApproved: false, // Pending admin approval
    });

    await newTeacher.save();

    // Create notification for Admin
    const notification = new Notification({
      message: `New teacher registered: ${fullName} (${email}). Awaiting approval.`,
      data: { teacherId: newTeacher._id },
    });

    await notification.save();

    res.status(201).send({ message: 'Teacher registration successful! Pending approval.' });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};  
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find teacher by email
    const teacher = await User.findOne({ email, role: 'Teacher' });
    if (!teacher) {
      return res.status(404).send({ message: 'Teacher not found' });
    }

    // Check if teacher is approved
    if (!teacher.isApproved) {
      return res.status(403).send({ message: 'Account not approved by Admin yet.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.passwordHash);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // Update `updatedAt`
    teacher.updatedAt = new Date();
    await teacher.save();

    // Generate JWT
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.send({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

  
  exports.addStudent = async (req, res) => {
    const { studentDetails } = req.body;
  
    try {
      const teacherId = req.user.id;
  
      // Ensure the requester is an approved teacher
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'Teacher' || !teacher.isApproved) {
        return res.status(403).send({ message: 'Unauthorized or unapproved teacher' });
      }
  
      // Validate and create student
      const existingStudent = await User.findOne({ email: studentDetails.email });
      if (existingStudent) {
        return res.status(400).send({ message: 'Student email already registered' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(studentDetails.password, salt);
  
      const newStudent = new User({
        ...studentDetails,
        passwordHash: hashedPassword,
        role: 'Student',
        isApproved: true,
        referredBy: teacherId
      });
  
      await newStudent.save();
  
      res.status(201).send({ message: 'Student added successfully!', student: newStudent });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Server Error', error: err.message });
    }
  };
  
  exports.viewProfile = async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).select('-passwordHash');
        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }
        res.send(teacher);
    } catch (err) {
        res.status(500).send({ message: 'Server Error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;

  try {
      const teacher = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
      if (!teacher) {
          return res.status(404).send({ message: 'Teacher not found' });
      }
       // Update `updatedAt`
    user.updatedAt = new Date();
    await user.save();
      res.send({ message: 'Profile updated successfully', teacher });
  } catch (err) {
      res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

exports.requestAccountDeletion = async (req, res) => {
    try {
        const notification = new Notification({
            message: `Teacher ${req.user.fullName} has requested account deletion.`,
            type: 'DeletionRequest',
            userId: req.user.id,
        });

        await notification.save();
        res.send({ message: 'Account deletion request submitted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Server Error', error: err.message });
    }
};

// Teacher creates a group (Admin will approve it)
exports.createGroup = async (req, res) => {
  const { name, subject, description } = req.body;
  const createdBy = req.user.id; // Teacher creating the group

  const newGroup = new Group({
    name,
    subject,
    description,
    createdBy,
    approved: false, // Pending approval by Admin
    members: [{ user: createdBy, role: 'Teacher' }],
  });

  try {
    const group = await newGroup.save();

    // Notify Admin about the new group created
    const notification = new Notification({
      recipientRole: 'Admin',
      message: `A new group "${name}" has been created and is awaiting approval.`,
      data: { groupId: group._id },
    });
    await notification.save();

    res.status(201).send(group);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Teacher uploads a resource (not tied to a group initially)
exports.uploadResource = async (req, res) => {
  const { title, resourceType, url, filePath, tags } = req.body;
  const uploadedBy = req.user.id; // Teacher who uploaded the resource

  try {
    // Create a new resource object (no group association initially)
    const newResource = new Resource({
      title,
      resourceType,
      url,
      filePath,
      tags,
      uploadedBy,
      permissions: {}, // Empty permissions initially
    });

    await newResource.save();

    res.status(201).send({ message: 'Resource uploaded successfully', resource: newResource });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};