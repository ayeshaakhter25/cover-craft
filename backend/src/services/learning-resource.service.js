const axios = require('axios');

const CURATED = {
  Docker: { docs: ['Docker Get Started', 'https://docs.docker.com/get-started/', 'Docker’s official beginner guide.'], course: ['Docker Curriculum', 'https://docker-curriculum.com/', 'A free hands-on Docker course.'] },
  AWS: { docs: ['AWS Documentation', 'https://docs.aws.amazon.com/', 'Official AWS product documentation.'], course: ['AWS Skill Builder', 'https://explore.skillbuilder.aws/learn', 'Free AWS learning plans and digital training.'] },
  'CI/CD': { docs: ['GitHub Actions Documentation', 'https://docs.github.com/actions', 'Official guide to automated build, test, and deployment workflows.'], course: ['GitHub Skills', 'https://skills.github.com/', 'Free interactive GitHub learning courses.'] },
  TypeScript: { docs: ['TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Official TypeScript learning handbook.'], course: ['TypeScript for Beginners', 'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/', 'Free beginner-friendly TypeScript guide.'] },
  Kubernetes: { docs: ['Kubernetes Documentation', 'https://kubernetes.io/docs/home/', 'Official Kubernetes documentation and tutorials.'], course: ['Kubernetes Basics', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'Official interactive Kubernetes tutorial.'] },
  React: { docs: ['React Learn', 'https://react.dev/learn', 'Official React learning path.'], course: ['React Course', 'https://www.freecodecamp.org/news/tag/react/', 'Free React courses and tutorials.'] },
  'Node.js': { docs: ['Node.js Learn', 'https://nodejs.org/en/learn', 'Official Node.js learning documentation.'], course: ['Node.js Course', 'https://www.freecodecamp.org/news/tag/nodejs/', 'Free Node.js learning resources.'] },
  MongoDB: { docs: ['MongoDB Documentation', 'https://www.mongodb.com/docs/', 'Official MongoDB documentation.'], course: ['MongoDB University', 'https://learn.mongodb.com/', 'Free MongoDB courses and learning paths.'] }
};

class LearningResourceService {
  static baseResource(skill, title, url, source, type, description, relevanceScore, difficulty = 'Beginner') { return { skill, title, url, source, type, description, relevanceScore, difficulty }; }
  static async youtube(skill) {
    if (!process.env.YOUTUBE_API_KEY) return [this.baseResource(skill, `${skill} beginner tutorials on YouTube`, `https://www.youtube.com/results?search_query=${encodeURIComponent(`${skill} beginner tutorial`)}`, 'YouTube', 'Tutorial', `Search current beginner ${skill} tutorials on YouTube. Add YOUTUBE_API_KEY for ranked video results.`, 82, 'Beginner')];
    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', { params: { key: process.env.YOUTUBE_API_KEY, part: 'snippet', q: `${skill} beginner tutorial`, type: 'video', maxResults: 4, safeSearch: 'strict' } });
    return (data.items || []).map((item, index) => this.baseResource(skill, item.snippet.title, `https://www.youtube.com/watch?v=${item.id.videoId}`, 'YouTube', 'Tutorial', item.snippet.description, 95 - index * 3, 'Beginner'));
  }
  static async github(skill) {
    try {
      const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
      const { data } = await axios.get('https://api.github.com/search/repositories', { headers, params: { q: `${skill} tutorial stars:>5`, sort: 'stars', order: 'desc', per_page: 4 } });
      return (data.items || []).map((repo, index) => this.baseResource(skill, repo.full_name, repo.html_url, 'GitHub', 'Project', repo.description || `Open-source ${skill} project.`, 93 - index * 3, 'Medium'));
    } catch (error) {
      console.warn('GitHub resource search failed:', error.message);
      // Public GitHub search link works without a personal access token.
      return [this.baseResource(skill, `${skill} beginner projects on GitHub`, `https://github.com/search?q=${encodeURIComponent(`${skill} tutorial`)}&type=repositories`, 'GitHub', 'Project', `Browse open-source ${skill} tutorial projects on GitHub.`, 80, 'Medium')];
    }
  }
  static curated(skill) {
    const selection = CURATED[skill] || { docs: [`${skill} official documentation search`, `https://www.google.com/search?q=${encodeURIComponent(`${skill} official documentation`)}`, `Find the official ${skill} documentation.`], course: [`Free ${skill} courses`, `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`, `Free ${skill} tutorials and courses.`] };
    return [this.baseResource(skill, ...selection.docs.slice(0, 2), 'Official documentation', 'Documentation', selection.docs[2], 98, 'Beginner'), this.baseResource(skill, ...selection.course.slice(0, 2), 'Learning platform', 'Course', selection.course[2], 88, 'Beginner')];
  }
  static async find(skill) {
    const normalized = String(skill || '').trim(); if (!normalized) throw new Error('A skill is required');
    const [youtube, github] = await Promise.all([this.youtube(normalized), this.github(normalized)]);
    const unique = new Map(); [...this.curated(normalized), ...youtube, ...github].forEach(resource => { if (!unique.has(resource.url)) unique.set(resource.url, resource); });
    return [...unique.values()].sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
module.exports = LearningResourceService;
