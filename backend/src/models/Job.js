const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String, required: true },
  originalText: String,
  skills: [String],
  jobTitle: String,
  company: String,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);

