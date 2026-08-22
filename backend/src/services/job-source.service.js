const SerpApiJobSource = require('./job-sources/serpapi.source');
class JobSourceService {
  static sources = [new SerpApiJobSource()];
  static async fetchAll(criteria) { const results = await Promise.allSettled(this.sources.map(source => source.fetch(criteria))); return results.flatMap(result => result.status === 'fulfilled' ? result.value : []); }
}
module.exports = JobSourceService;
