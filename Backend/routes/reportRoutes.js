const express = require('express');
const {
  generateUserActivityReport,
  generateResourceEngagementReport,
  generateGroupSummaryReport,
  downloadReport
} = require('../controllers/reportController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/user-activity', authenticateUser, authorizeRoles(['Admin']), generateUserActivityReport);
router.get('/resource-engagement', authenticateUser, authorizeRoles(['Admin']), generateResourceEngagementReport);
router.get('/group-summary', authenticateUser, authorizeRoles(['Admin']), generateGroupSummaryReport);
router.get('/download/:filename', authenticateUser, authorizeRoles(['Admin']), downloadReport);

module.exports = router;
