const CV = require('../models/CV');
const Job = require('../models/Job');
const Match = require('../models/Match');
const JobHistory = require('../models/JobHistory');
const SkillService = require('./skill.service');
const JobSourceService = require('./job-source.service');

class JobSyncService {
  static running = false;

  static async sync() {
    if (this.running) return { skipped: true, reason: 'A sync is already running' };
    this.running = true;
    try {
      const cvs = await CV.find({ skills: { $exists: true, $ne: [] } }).select('_id userId skills').lean();
      const groups = new Map();
      for (const cv of cvs) groups.set(cv.skills.slice(0, 5).map(s => s.toLowerCase()).sort().join('|'), cv.skills);
      const fetched = (await Promise.all([...groups.values()].map(skills => JobSourceService.fetchAll({ skills })))).flat();
      let newJobs = 0;
      for (const rawJob of fetched) {
        const skills = SkillService.extractSkills(rawJob.description);
        const jobData = { ...rawJob, skills };
        const existing = await Job.findOne({ source: rawJob.source, externalJobId: rawJob.externalJobId });
        const job = existing || await Job.create(jobData);
        if (existing) { await Job.updateOne({ _id: job._id }, { $set: { fetchedAt: new Date(), description: rawJob.description, skills } }); continue; }
        newJobs++;
        for (const cv of cvs) {
          const result = SkillService.calculateMatchScore(cv.skills || [], skills);
          await Match.updateOne({ userId: cv.userId, cvId: cv._id, jobId: job._id }, { $set: { matchScore: result.matchScore, matchingSkills: result.matchingSkills, missingSkills: result.missingSkills } }, { upsert: true });
          await JobHistory.updateOne({ userId: cv.userId, jobId: job._id }, { $setOnInsert: { state: 'NEW' } }, { upsert: true });
        }
      }
      return { fetched: fetched.length, newJobs, cvs: cvs.length };
    } finally { this.running = false; }
  }

  static start() {
    const interval = Number(process.env.JOB_SYNC_INTERVAL_MS || (process.env.NODE_ENV === 'production' ? 900000 : 60000));
    setTimeout(() => this.sync().catch(error => console.error('Initial job sync failed:', error.message)), 5000);
    setInterval(() => this.sync().catch(error => console.error('Scheduled job sync failed:', error.message)), interval);
    console.log(`Job scheduler enabled: every ${Math.round(interval / 60000)} minute(s)`);
  }
}
module.exports = JobSyncService;
