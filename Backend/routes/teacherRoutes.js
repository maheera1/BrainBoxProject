const express = require('express');
const router = express.Router();
const { 
    registerTeacher, 
    loginTeacher, 
    addStudent, 
    viewProfile, 
    updateProfile, 
    requestAccountDeletion,
    createGroup,
    uploadResource
} = require('../controllers/teacherController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// Teacher Registration
router.post('/register', registerTeacher);

// Teacher Login
router.post('/login', loginTeacher);

// Add Student (Teacher adding a student)
router.post('/add-student', authenticateUser, addStudent);

// View Profile
router.get('/profile', authenticateUser, viewProfile);

// Update Profile
router.put('/profile', authenticateUser, updateProfile);

// Request Account Deletion
router.post('/deletion-request', authenticateUser, requestAccountDeletion);

router.get('/notifications', authenticateUser, authorizeRoles(['Admin', 'Teacher', 'Student']), getNotifications);
router.put('/notifications/:id/read', authenticateUser, markAsRead);

router.post('/groups', authenticateUser, authorizeRoles(['Teacher']), createGroup);

router.post('/upload-resource', authenticateUser, authorizeRoles(['Teacher', 'Admin']), uploadResource);

module.exports = router;
