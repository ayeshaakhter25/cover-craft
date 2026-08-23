const CareerRoadmap = require('../models/CareerRoadmap');
const Match = require('../models/Match');
const Job = require('../models/Job');
const RoadmapService = require('../services/roadmap.service');

const generateRoadmap = async (req, res) => {
  try {
    const { jobId } = req.body;
    const matchQuery = { userId: req.user.id };
    if (jobId) matchQuery.jobId = jobId;
    const matches = await Match.find(matchQuery).populate('jobId').sort({ matchScore: -1 }).lean();
    if (!matches.length) return res.status(400).json({ error: 'No job matches found. Upload a CV and fetch jobs first.' });
    const selected = jobId ? matches[0] : matches[0];
    const targetRole = selected.jobId?.title || 'Your target role';
    const frequency = {};
    const sourceMatches = jobId ? matches : matches.slice(0, 20);
    sourceMatches.forEach(match => (match.missingSkills || []).forEach(skill => { frequency[skill] = (frequency[skill] || 0) + 1; }));
    const missingSkills = jobId ? selected.missingSkills || [] : Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    if (!missingSkills.length) return res.status(400).json({ error: 'No skill gaps found for this match.' });
    const plan = RoadmapService.build({ targetRole, missingSkills, frequency });
    const filter = jobId ? { userId: req.user.id, targetJobId: jobId } : { userId: req.user.id, targetJobId: { $exists: false } };
    const roadmap = await CareerRoadmap.findOneAndUpdate(filter, { $set: { targetJobId: jobId || undefined, targetRole, ...plan } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.status(201).json({ roadmap, message: 'Personalized roadmap generated' });
  } catch (error) { console.error('Roadmap generation error:', error.message); res.status(500).json({ error: 'Could not generate roadmap' }); }
};

const getRoadmaps = async (req, res) => { res.json({ roadmaps: await CareerRoadmap.find({ userId: req.user.id }).sort({ updatedAt: -1 }).lean() }); };

const updateSkillStatus = async (req, res) => {
  const allowed = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status' });
  const roadmap = await CareerRoadmap.findOneAndUpdate({ _id: req.params.roadmapId, userId: req.user.id, 'skills.name': req.params.skillName }, { $set: { 'skills.$.status': req.body.status } }, { new: true });
  if (!roadmap) return res.status(404).json({ error: 'Roadmap skill not found' });
  res.json({ roadmap });
};
module.exports = { generateRoadmap, getRoadmaps, updateSkillStatus };
