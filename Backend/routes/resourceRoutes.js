const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware'); // Import authentication middleware
const { getAllResources } = require('../controllers/resourceController'); // Import the controller method

// Route to view all resources
router.get('/resources', authenticateUser, getAllResources);

module.exports = router;
