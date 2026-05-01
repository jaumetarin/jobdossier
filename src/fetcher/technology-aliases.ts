export type TechnologyAliasConfig = {
  canonical: string;
  patterns: RegExp[];
};

export const technologyAliases: TechnologyAliasConfig[] = [
  {
    canonical: 'react-native',
    patterns: [/\breact\s+native\b/i],
  },
  {
    canonical: 'react',
    patterns: [/\breact(?:\.js|js)?\b/i],
  },
  {
    canonical: 'redux',
    patterns: [/\bredux\b/i],
  },
  {
    canonical: 'next.js',
    patterns: [/\bnext(?:\.js|js)?\b/i],
  },
  {
    canonical: 'angular',
    patterns: [/\bangular(?:\s*\d+)?\b/i],
  },
  {
    canonical: 'vue',
    patterns: [/\bvue(?:\.js|js)?\b/i],
  },
  {
    canonical: 'javascript',
    patterns: [/\bjavascript\b/i],
  },
  {
    canonical: 'typescript',
    patterns: [/\btypescript\b/i],
  },
  {
    canonical: 'node.js',
    patterns: [/\bnode(?:\.js|js)?\b/i],
  },
  {
    canonical: 'java',
    patterns: [/\bjava\b/i],
  },
  {
    canonical: 'spring-boot',
    patterns: [/\bspring\s+boot\b/i],
  },
  {
    canonical: 'python',
    patterns: [/\bpython\b/i],
  },
  {
    canonical: 'django',
    patterns: [/\bdjango\b/i],
  },
  {
    canonical: 'fastapi',
    patterns: [/\bfastapi\b/i],
  },
  {
    canonical: 'flask',
    patterns: [/\bflask\b/i],
  },
  {
    canonical: 'dotnet',
    patterns: [/\b\.net\b/i, /\bdotnet\b/i, /\basp\.net\b/i],
  },
  {
    canonical: 'c#',
    patterns: [/\bc#\b/i],
  },
  {
    canonical: 'docker',
    patterns: [/\bdocker\b/i],
  },
  {
    canonical: 'kubernetes',
    patterns: [/\bkubernetes\b/i],
  },
  {
    canonical: 'aws',
    patterns: [/\baws\b/i],
  },
  {
    canonical: 'azure',
    patterns: [/\bazure\b/i],
  },
  {
    canonical: 'gcp',
    patterns: [/\bgcp\b/i, /\bgoogle\s+cloud\b/i],
  },
  {
    canonical: 'postgresql',
    patterns: [/\bpostgresql\b/i, /\bpostgres\b/i],
  },
  {
    canonical: 'sql',
    patterns: [/\bsql\b/i],
  },
  {
    canonical: 'mongodb',
    patterns: [/\bmongodb\b/i, /\bmongo\b/i],
  },
  {
    canonical: 'kafka',
    patterns: [/\bkafka\b/i],
  },
  {
    canonical: 'redis',
    patterns: [/\bredis\b/i],
  },
  {
    canonical: 'selenium',
    patterns: [/\bselenium\b/i],
  },
  {
    canonical: 'cypress',
    patterns: [/\bcypress\b/i],
  },
  {
    canonical: 'playwright',
    patterns: [/\bplaywright\b/i],
  },
  {
    canonical: 'microservices',
    patterns: [/\bmicroservices?\b/i],
  },
];
