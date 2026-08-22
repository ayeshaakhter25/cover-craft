const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, default: 'Unknown Company', trim: true },
  location: { type: String, default: 'Remote', trim: true },
  description: { type: String, default: '' },
  skills: { type: [String], default: [] },
  salary: { type: String, default: '' },
  source: { type: String, default: 'manual', required: true },
  jobUrl: { type: String, default: '' },
  // Leave absent for manual records so the source/id uniqueness index applies
  // only to externally fetched jobs.
  externalJobId: { type: String },
  postedAt: Date,
  fetchedAt: { type: Date, default: Date.now },
  // Legacy manual-JD support
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalText: String,
  jobTitle: String,
  savedAt: { type: Date, default: Date.now }
}, { timestamps: true });

jobSchema.index({ source: 1, externalJobId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Job', jobSchema);

