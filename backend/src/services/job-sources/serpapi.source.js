const axios = require('axios');

class SerpApiJobSource {
  constructor() { this.name = 'serpapi-google-jobs'; }
  async fetch({ skills = [], location = '' } = {}) {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) return [];
    const params = { engine: 'google_jobs', q: `${skills.slice(0, 5).join(' ') || 'software developer'} jobs`, api_key: apiKey, google_domain: 'google.com', hl: 'en' };
    if (location) params.location = location;
    const { data } = await axios.get('https://serpapi.com/search.json', { params, timeout: 10000 });
    return (data.jobs_results || []).map(job => this.normalize(job));
  }
  normalize(job) {
    const apply = job.apply_options?.[0]?.link || job.apply_link || job.share_link;
    const posted = job.detected_extensions?.posted_at || job.extensions?.find(x => /ago|today|yesterday/i.test(x));
    return { title: job.title || 'Untitled Job', company: job.company_name || 'Unknown Company', location: job.location || 'Remote', description: job.description || job.job_description || '', salary: job.detected_extensions?.salary || '', source: this.name, jobUrl: apply || `https://www.google.com/search?q=${encodeURIComponent(`${job.title || ''} ${job.company_name || ''} jobs`)}`, externalJobId: String(job.job_id || job.share_link || `${job.title}|${job.company_name}|${job.location}`), postedAt: this.parsePostedAt(posted), fetchedAt: new Date() };
  }
  parsePostedAt(value) { const hours = String(value || '').match(/(\d+)\s*hour/i); if (hours) return new Date(Date.now() - Number(hours[1]) * 3600000); const days = String(value || '').match(/(\d+)\s*day/i); return days ? new Date(Date.now() - Number(days[1]) * 86400000) : undefined; }
}
module.exports = SerpApiJobSource;
