const express = require('express');
const router = express.Router();
const {
  getActiveUsers,
  getPopularResources,
  getEngagementSummary,
  getTopContributors,
} = require('../controllers/analyticsController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

// Insights endpoints
router.get('/active-users', authenticateUser, authorizeRoles(['Admin']), getActiveUsers);
router.get('/popular-resources', authenticateUser, authorizeRoles(['Admin']), getPopularResources);
router.get('/engagement-summary', authenticateUser, authorizeRoles(['Admin']), getEngagementSummary);
router.get('/top-contributors', authenticateUser, authorizeRoles(['Admin']), getTopContributors);

module.exports = router;
