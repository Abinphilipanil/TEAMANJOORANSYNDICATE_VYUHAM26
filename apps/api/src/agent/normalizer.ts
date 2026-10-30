import { SkillCategory } from '@af03/contracts';

interface CanonicalSkill {
  canonicalName: string;
  category: SkillCategory;
  aliases: string[];
}

export class SkillNormalizer {
  private static TAXONOMY: CanonicalSkill[] = [
    // Languages
    { canonicalName: 'JavaScript', category: 'language', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
    { canonicalName: 'TypeScript', category: 'language', aliases: ['typescript', 'ts'] },
    { canonicalName: 'Python', category: 'language', aliases: ['python', 'py', 'python3'] },
    { canonicalName: 'Java', category: 'language', aliases: ['java', 'jdk', 'jvm'] },
    { canonicalName: 'C++', category: 'language', aliases: ['c++', 'cpp'] },
    { canonicalName: 'Go', category: 'language', aliases: ['golang', 'go lang'] },
    { canonicalName: 'Rust', category: 'language', aliases: ['rust', 'rustlang'] },
    { canonicalName: 'SQL', category: 'database', aliases: ['sql', 'structured query language'] },
    { canonicalName: 'HTML / CSS', category: 'language', aliases: ['html', 'html5', 'css', 'css3'] },
    { canonicalName: 'Bash / Shell', category: 'language', aliases: ['bash', 'sh', 'shell scripting', 'powershell', 'zsh'] },

    // Frontend Frameworks & Libraries
    { canonicalName: 'React.js', category: 'framework', aliases: ['react', 'react.js', 'reactjs'] },
    { canonicalName: 'Next.js', category: 'framework', aliases: ['next', 'next.js', 'nextjs'] },
    { canonicalName: 'Vue.js', category: 'framework', aliases: ['vue', 'vue.js', 'vuejs'] },
    { canonicalName: 'Tailwind CSS', category: 'library', aliases: ['tailwind', 'tailwindcss'] },
    { canonicalName: 'Redux / Zustand', category: 'library', aliases: ['redux', 'zustand', 'state management'] },

    // Backend & API
    { canonicalName: 'Node.js & Express', category: 'framework', aliases: ['node', 'node.js', 'nodejs', 'express', 'express.js', 'expressjs'] },
    { canonicalName: 'NestJS', category: 'framework', aliases: ['nest', 'nestjs'] },
    { canonicalName: 'FastAPI', category: 'framework', aliases: ['fastapi', 'fast api'] },
    { canonicalName: 'Django', category: 'framework', aliases: ['django', 'drf'] },
    { canonicalName: 'Spring Boot', category: 'framework', aliases: ['spring', 'spring boot', 'springboot'] },
    { canonicalName: 'RESTful API Design', category: 'architecture', aliases: ['rest', 'restful', 'rest api', 'apis', 'web apis'] },
    { canonicalName: 'GraphQL', category: 'architecture', aliases: ['graphql', 'apollo'] },

    // Databases
    { canonicalName: 'PostgreSQL', category: 'database', aliases: ['postgres', 'postgresql', 'psql'] },
    { canonicalName: 'MongoDB', category: 'database', aliases: ['mongo', 'mongodb'] },
    { canonicalName: 'MySQL', category: 'database', aliases: ['mysql'] },
    { canonicalName: 'Redis', category: 'database', aliases: ['redis', 'caching'] },
    { canonicalName: 'Vector Databases', category: 'database', aliases: ['pinecone', 'chroma', 'chromadb', 'milvus', 'weaviate', 'qdrant', 'vector search'] },

    // Cloud & DevOps
    { canonicalName: 'Docker & Containerization', category: 'cloud_devops', aliases: ['docker', 'container', 'containers', 'containerization'] },
    { canonicalName: 'Kubernetes (K8s)', category: 'cloud_devops', aliases: ['k8s', 'kubernetes', 'helm'] },
    { canonicalName: 'AWS / Cloud Services', category: 'cloud_devops', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'cloud'] },
    { canonicalName: 'CI/CD Pipelines', category: 'cloud_devops', aliases: ['ci/cd', 'cicd', 'github actions', 'gitlab ci', 'jenkins'] },
    { canonicalName: 'Terraform', category: 'tool', aliases: ['terraform', 'iac', 'infrastructure as code'] },
    { canonicalName: 'Linux Administration', category: 'domain_knowledge', aliases: ['linux', 'ubuntu', 'debian', 'centos'] },

    // AI & Data
    { canonicalName: 'Machine Learning Fundamentals', category: 'domain_knowledge', aliases: ['machine learning', 'ml', 'scikit-learn', 'sklearn'] },
    { canonicalName: 'PyTorch / Deep Learning', category: 'framework', aliases: ['pytorch', 'torch', 'deep learning', 'tensorflow', 'keras'] },
    { canonicalName: 'LLM Agent Architectures & RAG', category: 'architecture', aliases: ['llm', 'rag', 'langchain', 'langgraph', 'llamaindex', 'agents', 'prompt engineering'] },
    { canonicalName: 'Pandas / Data Analysis', category: 'library', aliases: ['pandas', 'numpy', 'polars', 'data analysis'] },
    { canonicalName: 'Data Warehousing', category: 'database', aliases: ['snowflake', 'bigquery', 'redshift', 'dbt'] },

    // Security & Tools
    { canonicalName: 'Git & Version Control', category: 'tool', aliases: ['git', 'github', 'gitlab', 'version control'] },
    { canonicalName: 'OWASP Security & AppSec', category: 'domain_knowledge', aliases: ['owasp', 'appsec', 'security', 'penetration testing', 'burp suite'] },
    { canonicalName: 'Testing (Jest / Playwright)', category: 'tool', aliases: ['jest', 'vitest', 'cypress', 'playwright', 'unit testing'] }
  ];

  public static normalize(rawSkill: string): { canonicalName: string; category: SkillCategory } {
    const cleaned = rawSkill.trim().toLowerCase();

    for (const item of SkillNormalizer.TAXONOMY) {
      if (item.canonicalName.toLowerCase() === cleaned) {
        return { canonicalName: item.canonicalName, category: item.category };
      }
      for (const alias of item.aliases) {
        if (alias === cleaned || cleaned.includes(alias)) {
          return { canonicalName: item.canonicalName, category: item.category };
        }
      }
    }

    // Capitalize first letters as generic fallback
    const titleCased = rawSkill
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    return {
      canonicalName: titleCased,
      category: 'tool',
    };
  }

  public static matchSkillInText(text: string): Array<{ canonicalName: string; category: SkillCategory; snippet: string }> {
    const results: Array<{ canonicalName: string; category: SkillCategory; snippet: string }> = [];
    const lowerText = text.toLowerCase();

    for (const item of SkillNormalizer.TAXONOMY) {
      for (const alias of item.aliases) {
        const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const match = regex.exec(text);
        if (match) {
          const start = Math.max(0, match.index - 30);
          const end = Math.min(text.length, match.index + alias.length + 30);
          const snippet = text.substring(start, end).replace(/[\r\n]+/g, ' ').trim();
          results.push({
            canonicalName: item.canonicalName,
            category: item.category,
            snippet: `...${snippet}...`
          });
          break; // Avoid duplicate matches for same canonical item
        }
      }
    }

    return results;
  }
}

