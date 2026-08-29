const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  type: { type: String, default: 'HIGH_MATCH_JOB', required: true },
  channel: { type: String, enum: ['EMAIL'], required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], required: true },
  matchScore: { type: Number, required: true },
  sentAt: { type: Date, default: Date.now },
  error: String
}, { timestamps: true });

// A job can alert a given user via email only once.
notificationSchema.index({ userId: 1, jobId: 1, channel: 1 }, { unique: true });
module.exports = mongoose.model('Notification', notificationSchema);
