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

    // A dashboard "analysis" means a user deliberately analysed their CV
    // against a pasted JD. Background job matches belong on the Jobs page.
    const matches = await Match.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('jobId', 'title jobTitle company source userId')
      .lean();

    const recentMatches = matches
      .filter(match => match.analysisType === 'MANUAL' || (match.jobId?.source === 'manual' && String(match.jobId?.userId) === String(userId)))
      .slice(0, 10)
      .map(match => ({
      id: match._id,
      score: Math.round(match.matchScore),
      jobTitle: match.jobId?.title || match.jobId?.jobTitle || 'Untitled Job',
      company: match.jobId?.company || 'Unknown Company',
      createdAt: match.createdAt
    }));

    res.json(recentMatches);
  } catch (error) {
    console.error('Recent matches error:', error);
    res.status(500).json({ message: 'Error fetching recent matches' });
  }
};

// Get all persisted details for one analysis. Ownership is enforced by userId.
const getMatchDetail = async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('cvId', 'originalName filename skills extractedText')
      .populate('jobId', 'title jobTitle company location description originalText skills jobUrl source')
      .lean();
    if (!match || (!match.analysisType && match.jobId?.source !== 'manual') || (match.analysisType === 'AUTOMATED')) return res.status(404).json({ message: 'Analysis not found' });
    res.json({
      id: match._id, matchScore: match.matchScore, matchingSkills: match.matchingSkills || [],
      missingSkills: match.missingSkills || [], createdAt: match.createdAt, cv: match.cvId,
      job: match.jobId ? {
        title: match.jobId.title || match.jobId.jobTitle || 'Untitled Job', company: match.jobId.company,
        location: match.jobId.location, description: match.jobId.description || match.jobId.originalText || '',
        skills: match.jobId.skills || [], jobUrl: match.jobId.jobUrl, source: match.jobId.source
      } : null
    });
  } catch (error) { res.status(500).json({ message: 'Error fetching analysis details' }); }
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
  getMatchDetail,
  deleteMatch
};
