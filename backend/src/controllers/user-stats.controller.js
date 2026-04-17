const CV = require('../models/CV');
const Job = require('../models/Job');
const Match = require('../models/Match');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get user dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count user's CVs uploaded
    const cvCount = await CV.countDocuments({ userId });

    // Count user's saved jobs
    const jobsCount = await Job.countDocuments({ userId });

    // Count user's generated covers (TODO: if separate Cover model exists, count from there; using matches as proxy for now)
const coversCount = 0; // No Cover model, set to 0

    // Get average match score
    const oid = new mongoose.Types.ObjectId(userId);
    const matchStats = await Match.aggregate([
      { $match: { userId: oid } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$matchScore' },
          count: { $sum: 1 }
        }
      }
    ]);
    const avgMatchScore = matchStats.length > 0 ? Math.round(matchStats[0].avgScore) : 0;

    // Get user info
    const user = await User.findById(userId).select('name');

    res.json({
      userName: user?.name || 'User',
      cvUploads: cvCount,
      jobsSaved: jobsCount,
      avgMatchScore,
      coversGenerated: coversCount
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Get user's recent matches
const getRecentMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)  // Show more matches
      .populate('jobId', 'jobTitle company')
      .lean();

    const recentMatches = matches.map(match => ({
      id: match._id,
      score: Math.round(match.matchScore),
      jobTitle: match.jobId?.jobTitle || 'Untitled Job',
      company: match.jobId?.company || 'Unknown Company',
      createdAt: match.createdAt
    }));

    res.json(recentMatches);
  } catch (error) {
    console.error('Recent matches error:', error);
    res.status(500).json({ message: 'Error fetching recent matches' });
  }
};

// Delete a specific match
const deleteMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.id;

    const deletedMatch = await Match.findOneAndDelete({ 
      _id: matchId, 
      userId: userId  // Ensure user can only delete their own matches
    });

    if (!deletedMatch) {
      return res.status(404).json({ message: 'Match not found or unauthorized' });
    }

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({ message: 'Error deleting match' });
  }
};

module.exports = {
  getDashboardStats,
  getRecentMatches,
  deleteMatch
};
