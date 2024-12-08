const express = require('express');
const {
  uploadFileToDrive,
  listFilesInDrive,
} = require('../controllers/googleDriveController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to upload file to Google Drive
router.post('/upload', authenticateUser, uploadFileToDrive);

// Route to list files in Google Drive
router.get('/list', authenticateUser, listFilesInDrive);

module.exports = router;
