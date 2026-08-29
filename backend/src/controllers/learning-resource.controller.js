const LearningResourceService = require('../services/learning-resource.service');
const SavedLearningResource = require('../models/SavedLearningResource');

const searchResources = async (req, res) => { try { res.json({ resources: await LearningResourceService.find(req.query.skill) }); } catch (error) { res.status(400).json({ error: error.message }); } };
const getSavedResources = async (req, res) => { res.json({ resources: await SavedLearningResource.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean() }); };
const saveResource = async (req, res) => {
  const { skill, title, url, source, type, description, relevanceScore, difficulty } = req.body;
  if (!skill || !title || !url || !type) return res.status(400).json({ error: 'Incomplete resource data' });
  try { const resource = await SavedLearningResource.findOneAndUpdate({ userId: req.user.id, url }, { $setOnInsert: { userId: req.user.id, skill, title, url, source, type, description, relevanceScore, difficulty } }, { upsert: true, new: true }); res.status(201).json({ resource }); }
  catch (error) { res.status(500).json({ error: 'Could not save resource' }); }
};
const removeResource = async (req, res) => { const result = await SavedLearningResource.deleteOne({ _id: req.params.id, userId: req.user.id }); if (!result.deletedCount) return res.status(404).json({ error: 'Resource not found' }); res.json({ message: 'Resource removed' }); };
module.exports = { searchResources, getSavedResources, saveResource, removeResource };
