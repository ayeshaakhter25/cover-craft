const mongoose = require('mongoose');

const savedLearningResourceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true }, title: { type: String, required: true }, url: { type: String, required: true },
  source: String, type: { type: String, enum: ['Tutorial', 'Project', 'Documentation', 'Course'], required: true },
  description: String, relevanceScore: Number, difficulty: String
}, { timestamps: true });
savedLearningResourceSchema.index({ userId: 1, url: 1 }, { unique: true });
module.exports = mongoose.model('SavedLearningResource', savedLearningResourceSchema);
