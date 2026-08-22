const mongoose = require('mongoose');

const jobHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  state: { type: String, enum: ['NEW', 'VIEWED', 'SAVED', 'APPLIED', 'REJECTED'], default: 'NEW' }
}, { timestamps: true });

jobHistorySchema.index({ userId: 1, jobId: 1 }, { unique: true });
module.exports = mongoose.model('JobHistory', jobHistorySchema);
