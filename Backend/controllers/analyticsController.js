const User = require('../models/User');
const Resource = require('../models/Resource');
const ChatMessage = require('../models/ChatMessage');
const Group = require('../models/Group');

// Get active users
exports.getActiveUsers = async (req, res) => {
  const { timeframe = '24h' } = req.query; // Optional timeframe query parameter
  const timeMapping = { '24h': 1, '7d': 7, '30d': 30 };
  const days = timeMapping[timeframe] || 1; // Default to 24 hours

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const activeUsers = await User.countDocuments({ updatedAt: { $gte: since } });
    res.status(200).send({ activeUsers });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Get most popular resources
exports.getPopularResources = async (req, res) => {
  try {
    const popularResources = await Resource.find()
      .sort({ views: -1 }) // Assuming a `views` field tracks resource popularity
      .limit(5);
    res.status(200).send(popularResources);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Get engagement summaries
exports.getEngagementSummary = async (req, res) => {
  try {
    const messageCount = await ChatMessage.countDocuments();
    const resourceCount = await Resource.countDocuments();
    const activeGroups = await Group.countDocuments({ 'members.0': { $exists: true } }); // Groups with members

    res.status(200).send({
      messageCount,
      resourceCount,
      activeGroups,
    });
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};

// Additional analytics (optional)
exports.getTopContributors = async (req, res) => {
  try {
    const topContributors = await User.aggregate([
      { $match: { role: 'Student' } }, // Focus on students, but this can be adjusted
      {
        $lookup: {
          from: 'chatmessages', // MongoDB collection name for ChatMessage
          localField: '_id',
          foreignField: 'sender',
          as: 'messages',
        },
      },
      { $project: { fullName: 1, messageCount: { $size: '$messages' } } },
      { $sort: { messageCount: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).send(topContributors);
  } catch (err) {
    res.status(500).send({ message: 'Server Error', error: err.message });
  }
};
