const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load Google Service Account Credentials
const KEY_FILE_PATH = path.join(__dirname, '../keys/brainbox-443118-9bb63ff356c0.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

const shareFileWithPersonalAccount = async (fileId, email) => {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader', // Or 'writer' for edit access
        type: 'user',
        emailAddress: email, // Your personal Google account
      },
    });
  };
  
  exports.uploadFileToDrive = async (req, res) => {
    try {
      const { filePath, fileName, folderId, personalEmail } = req.body;
  
      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
      };
  
      const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath),
      };
  
      const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink, webContentLink',
      });
  
      // Share the uploaded file with your personal account
      if (personalEmail) {
        await shareFileWithPersonalAccount(response.data.id, personalEmail);
      }
  
      res.status(200).json({
        message: 'File uploaded and shared successfully',
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
  };
  
// List Files in Google Drive
exports.listFilesInDrive = async (req, res) => {
  try {
    const { folderId } = req.query;

    const query = folderId ? `'${folderId}' in parents` : null; // Optional folder filter
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, webViewLink)',
    });

    res.status(200).json({ files: response.data.files });
  } catch (err) {
    console.error('Error listing files:', err);
    res.status(500).json({ message: 'Error listing files', error: err.message });
  }
};

