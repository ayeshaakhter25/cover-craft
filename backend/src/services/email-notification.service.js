const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

class EmailNotificationService {
  static transporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }

  static async sendHighMatchAlert({ user, job, match }) {
    const preferences = user.notificationPreferences || {};
    const threshold = preferences.minimumMatchScore ?? 80;
    // Existing accounts created before preferences were introduced have an
    // empty object. Treat a missing flag as the documented default: enabled.
    const emailEnabled = preferences.emailEnabled !== false;
    if (!emailEnabled || match.matchScore < threshold) return { skipped: true };
    const previous = await Notification.findOne({ userId: user._id, jobId: job._id, channel: 'EMAIL' });
    if (previous?.status === 'SENT') return { skipped: true, reason: 'already notified' };

    const transporter = this.transporter();
    if (!transporter) {
      await this.recordOutcome(previous, { userId: user._id, jobId: job._id, channel: 'EMAIL', status: 'FAILED', matchScore: match.matchScore, error: 'SMTP is not configured' });
      console.warn('Email alert skipped: SMTP is not configured');
      return { skipped: true, reason: 'SMTP is not configured' };
    }

    const strong = (match.matchingSkills || []).join(', ') || 'No skills identified';
    const missing = (match.missingSkills || []).join(', ') || 'None';
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: `🎯 New ${match.matchScore}% Match Job Found!`,
        text: `${job.title}\n${job.company}\n${job.location}\n\nMatch Score: ${match.matchScore}%\n\nStrong Skills: ${strong}\nMissing: ${missing}\n\nView Job: ${job.jobUrl || 'Link unavailable'}`
      });
      await this.recordOutcome(previous, { userId: user._id, jobId: job._id, channel: 'EMAIL', status: 'SENT', matchScore: match.matchScore, error: undefined });
      return { sent: true };
    } catch (error) {
      await this.recordOutcome(previous, { userId: user._id, jobId: job._id, channel: 'EMAIL', status: 'FAILED', matchScore: match.matchScore, error: error.message });
      console.error(`Email notification failed for ${user.email}:`, error.message);
      return { sent: false, error: error.message };
    }
  }

  static async recordOutcome(previous, values) {
    if (previous) return Notification.updateOne({ _id: previous._id }, { $set: { ...values, sentAt: new Date() } });
    return Notification.create(values);
  }
}
module.exports = EmailNotificationService;
