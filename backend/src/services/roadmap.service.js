const SKILL_GUIDES = {
  Docker: { difficulty: 'Medium', hours: 8, topics: ['Containers and images', 'Dockerfile', 'Docker Compose', 'Containerise one project'] },
  AWS: { difficulty: 'Medium', hours: 12, topics: ['IAM fundamentals', 'EC2 deployment', 'S3 storage', 'Deploy a portfolio project'] },
  'CI/CD': { difficulty: 'Advanced', hours: 10, topics: ['Build and test workflow', 'GitHub Actions', 'Environment secrets', 'Automated deployment'] },
  TypeScript: { difficulty: 'Medium', hours: 10, topics: ['Types and interfaces', 'Generics', 'React with TypeScript', 'Convert an existing component'] },
  Kubernetes: { difficulty: 'Advanced', hours: 16, topics: ['Pods and deployments', 'Services', 'ConfigMaps and secrets', 'Deploy containerised app'] },
  React: { difficulty: 'Medium', hours: 12, topics: ['Components and hooks', 'State management', 'API integration', 'Build a responsive project'] },
  'Node.js': { difficulty: 'Medium', hours: 12, topics: ['Node runtime', 'Express API', 'Authentication', 'Deploy an API'] },
  MongoDB: { difficulty: 'Medium', hours: 8, topics: ['Documents and collections', 'CRUD', 'Mongoose models', 'Data modelling'] },
  Python: { difficulty: 'Beginner', hours: 10, topics: ['Core syntax', 'Functions and modules', 'Virtual environments', 'Build a small automation'] },
  SQL: { difficulty: 'Medium', hours: 10, topics: ['SELECT and filtering', 'Joins', 'Aggregation', 'Schema design'] }
};

class RoadmapService {
  static build({ targetRole, missingSkills, frequency = {} }) {
    const unique = [...new Set(missingSkills)].slice(0, 8);
    const skills = unique.map((name, index) => {
      const guide = SKILL_GUIDES[name] || { difficulty: 'Medium', hours: 8, topics: [`${name} foundations`, `Core ${name} concepts`, `Guided practice`, `Portfolio mini-project`] };
      const occurrences = frequency[name] || 1;
      const priority = occurrences >= 3 || index < 2 ? 'High' : occurrences >= 2 || index < 4 ? 'Medium' : 'Low';
      return { name, priority, difficulty: guide.difficulty, estimatedHours: guide.hours, reason: `Requested by ${occurrences} matched job${occurrences === 1 ? '' : 's'} for ${targetRole}.`, topics: guide.topics, status: 'NOT_STARTED' };
    });
    return { skills, weeks: skills.map((skill, index) => ({ week: index + 1, title: `Week ${index + 1} — ${skill.name}`, skills: [skill.name], topics: skill.topics, estimatedHours: skill.estimatedHours })) };
  }
}
module.exports = RoadmapService;
