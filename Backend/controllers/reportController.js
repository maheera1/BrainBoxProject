const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const Resource = require('../models/Resource');
const Group = require('../models/Group');
const { renderPDF, handleError } = require('../utils/pdfUtils');

// Generate HTML Report
const generateHTML = async (templatePath, data) => {
  try {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  } catch (err) {
    console.error('Error generating HTML:', err);
    throw new Error('Template generation failed');
  }
};

// Generate User Activity Report
exports.generateUserActivityReport = async (req, res) => {
  try {
    const users = await User.find();
    const reportData = await Promise.all(
      users.map(async (user) => {
        const messagesSent = await ChatMessage.countDocuments({ sender: user._id });
        const resourcesShared = await Resource.countDocuments({ uploadedBy: user._id });
        return {
          name: user.fullName,
          email: user.email,
          role: user.role,
          lastActive: user.updatedAt ? user.updatedAt.toDateString() : 'Never',
          messagesSent,
          resourcesShared,
        };
      })
    );

    const compiledData = {
      date: new Date().toDateString(),
      users: reportData,
    };

    const html = await generateHTML('./templates/userActivityReport.html', compiledData);
    const filePath = await renderPDF(html, 'UserActivityReport.pdf');

    res.status(200).json({
      message: 'Report generated successfully',
      filePath,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Generate Resource Engagement Report
exports.generateResourceEngagementReport = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'fullName');
    const reportData = resources.map((resource) => ({
      title: resource.title,
      type: resource.resourceType,
      uploader: resource.uploadedBy ? resource.uploadedBy.fullName : 'Unknown',
      views: resource.views || 0,
      tags: resource.tags ? resource.tags.join(', ') : 'None',
    }));

    const compiledData = {
      date: new Date().toDateString(),
      resources: reportData,
    };

    const html = await generateHTML('./templates/resourceEngagementReport.html', compiledData);
    const filePath = await renderPDF(html, 'ResourceEngagementReport.pdf');

    res.status(200).json({
      message: 'Report generated successfully',
      filePath,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Generate Group Summary Report
exports.generateGroupSummaryReport = async (req, res) => {
  try {
    const groups = await Group.find().populate('createdBy', 'fullName');
    const reportData = await Promise.all(
      groups.map(async (group) => {
        const messages = await ChatMessage.countDocuments({ groupId: group._id });
        return {
          name: group.name,
          subject: group.subject,
          creator: group.createdBy ? group.createdBy.fullName : 'Unknown',
          members: group.members.length,
          messages,
        };
      })
    );

    const compiledData = {
      date: new Date().toDateString(),
      groups: reportData,
    };

    const html = await generateHTML('./templates/groupSummaryReport.html', compiledData);
    const filePath = await renderPDF(html, 'GroupSummaryReport.pdf');

    res.status(200).json({
      message: 'Report generated successfully',
      filePath,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Download Report
exports.downloadReport = (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(__dirname, '../reports', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      handleError(res, err);
    }
  });
};
