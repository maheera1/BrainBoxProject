const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  approveTeacher,
  getAllUsers,
  updateUser,
  deleteUser,
  getDeletionRequests,
  handleDeletionRequest,
  setResourcePermissions,
  viewProfile,
  getUserById
} = require('../controllers/adminController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

// Admin Registration & Login
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
// View Admin Profile
router.get('/profile', authenticateUser, viewProfile);

// Approve Teacher
router.put('/approve/:id', authenticateUser, authorizeRoles(['Admin']), approveTeacher);

// User Management
router.get('/users', authenticateUser, authorizeRoles(['Admin']), getAllUsers);
router.put('/users/:id', authenticateUser, authorizeRoles(['Admin']), updateUser);
router.delete('/users/:id', authenticateUser, authorizeRoles(['Admin']), deleteUser);

// Fetch a single user by ID
router.get("/users/:id", authenticateUser, authorizeRoles(["Admin"]), getUserById);

// Handle Deletion Requests
router.get('/deletion-requests', authenticateUser, authorizeRoles(['Admin']), getDeletionRequests);
router.put('/deletion-requests/:id', authenticateUser, authorizeRoles(['Admin']), handleDeletionRequest);

router.put('/resource/permissions', authenticateUser, authorizeRoles(['Admin']), setResourcePermissions);

module.exports = router;
