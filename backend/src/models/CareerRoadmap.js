const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true }, priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  difficulty: { type: String, enum: ['Beginner', 'Medium', 'Advanced'], required: true }, estimatedHours: { type: Number, required: true }, reason: String,
  topics: [String], status: { type: String, enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], default: 'NOT_STARTED' }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, targetRole: { type: String, required: true },
  skills: [skillSchema], weeks: [{ week: Number, title: String, skills: [String], topics: [String], estimatedHours: Number }]
}, { timestamps: true });

roadmapSchema.index({ userId: 1, targetJobId: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('CareerRoadmap', roadmapSchema);
