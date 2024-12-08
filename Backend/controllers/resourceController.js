const Resource = require('../models/Resource');

exports.getAllResources = async (req, res) => {
  try {
    // Fetch all resources
    const resources = await Resource.find()
      .populate('uploadedBy', 'fullName email') // Optionally, populate uploadedBy user info
      .select('title resourceType url filePath tags createdAt'); // Select only necessary fields

    // Send resources in response
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};
