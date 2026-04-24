const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: String,
  filePath: { type: String, required: true },
  extractedText: String,
  skills: [String],
  matchingJobs: [{
    title: String,
    company: String,
    location: String,
    link: String,
    snippet: String
  }],
  fileSize: Number,
  mimeType: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CV', cvSchema);

