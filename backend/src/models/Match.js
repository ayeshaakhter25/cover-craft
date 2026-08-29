const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cvId: { type: mongoose.Schema.Types.ObjectId, ref: 'CV' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  matchScore: { type: Number, required: true },
  matchingSkills: [String],
  missingSkills: [String],
  // MANUAL means the user pasted a JD and deliberately ran Analysis.
  // AUTOMATED is created by the background job matcher.
  analysisType: { type: String, enum: ['MANUAL', 'AUTOMATED'], default: 'AUTOMATED' },
  createdAt: { type: Date, default: Date.now }
});

matchSchema.index({ userId: 1, cvId: 1, jobId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Match', matchSchema);

