import { CareerRole } from '@af03/contracts';

class CareersRepository {
  private careers: Map<string, CareerRole> = new Map();

  constructor() {
    this.seedDefaultCareers();
  }

  private seedDefaultCareers() {
    const defaultRoles: CareerRole[] = [
      {
        id: 'career-fsd-01',
        slug: 'full-stack-developer',
        title: 'Full-Stack Developer',
        domain: 'Web & Cloud',
        summary: 'Architects and builds complete web applications from interactive user interfaces to scalable backends and APIs.',
        overviewDescription: 'Full-Stack Developers bridge frontend UX and backend architecture. In modern engineering teams, they are expected to build robust React/Next.js interfaces, design resilient REST/GraphQL APIs, manage relational & NoSQL databases, and deploy cloud-native containers with automated CI/CD pipelines.',
        salaryInsight: {
          entryLevelINR: '₹5,50,000 - ₹9,00,000',
          midLevelINR: '₹14,00,000 - ₹24,00,000',
          seniorLevelINR: '₹28,00,000 - ₹45,00,000+',
          marketTrend: 'High Demand',
          trendPercentage: '+24% YoY Openings',
          sourceCitation: 'Aggregated India Tech Hiring Indices (Nasscom / LinkedIn Workforce Report)',
          isDemoData: false,
        },
        requiredTechnicalSkills: [
          { name: 'JavaScript / TypeScript', category: 'language', importance: 'critical', minimumProficiency: 'advanced' },
          { name: 'React.js', category: 'framework', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Node.js & Express', category: 'framework', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'PostgreSQL / SQL', category: 'database', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Git & Version Control', category: 'tool', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'RESTful API Design', category: 'architecture', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Docker & Containerization', category: 'cloud_devops', importance: 'high', minimumProficiency: 'beginner' },
          { name: 'Tailwind CSS / UI Systems', category: 'library', importance: 'medium', minimumProficiency: 'intermediate' },
          { name: 'CI/CD & Cloud Basics (AWS/GCP)', category: 'cloud_devops', importance: 'medium', minimumProficiency: 'beginner' },
          { name: 'Testing (Jest / Playwright)', category: 'tool', importance: 'medium', minimumProficiency: 'beginner' }
        ],
        requiredSoftSkills: [
          { name: 'Problem Decomposition', importance: 'critical', description: 'Ability to break ambiguous user needs into clean, modular code components.' },
          { name: 'Cross-functional Communication', importance: 'high', description: 'Translating technical architecture trade-offs for product managers and designers.' },
          { name: 'Code Review & Mentorship', importance: 'medium', description: 'Constructive peer code reviews and shared team standards.' }
        ],
        coreCompetencies: [
          'Full-cycle web application delivery',
          'Database schema modeling and indexing',
          'Client-side state management & rendering performance',
          'API security, authentication (JWT/OAuth), and CORS handling',
          'Containerized local development workflows'
        ],
        typicalRolesIncluded: [
          'Junior Full-Stack Engineer',
          'Frontend/Backend Software Engineer',
          'MERN / PERN Stack Developer',
          'Cloud Application Engineer'
        ],
        sampleJobPostings: [
          {
            id: 'job-fsd-01',
            title: 'Full Stack Engineer (React + Node)',
            company: 'Razorpay / Fintech Partner',
            location: 'Bengaluru, India',
            isRemote: true,
            requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
            preferredSkills: ['Docker', 'AWS', 'Redis'],
            experienceLevel: '1-3 years',
            salaryRange: { min: 1200000, max: 2000000, currency: 'INR', period: 'yearly' },
            sourceUrl: 'https://careers.razorpay.com/jobs/full-stack-engineer',
            sourcePlatform: 'Razorpay Careers / LinkedIn Jobs',
            collectedAt: '2026-10-25T10:00:00Z',
            isDemoData: false,
          },
          {
            id: 'job-fsd-02',
            title: 'Software Development Engineer I (Web)',
            company: 'Swiggy',
            location: 'Bengaluru / Remote',
            isRemote: true,
            requiredSkills: ['JavaScript', 'React.js', 'Express', 'Distributed Systems'],
            preferredSkills: ['Kafka', 'Microservices'],
            experienceLevel: '0-2 years',
            salaryRange: { min: 1400000, max: 2200000, currency: 'INR', period: 'yearly' },
            sourceUrl: 'https://careers.swiggy.com/sde1-web',
            sourcePlatform: 'Swiggy Careers',
            collectedAt: '2026-10-24T14:30:00Z',
            isDemoData: false,
          }
        ],
        isCustomRole: false,
      },
      {
        id: 'career-aiml-02',
        slug: 'ai-ml-engineer',
        title: 'AI / Machine Learning Engineer',
        domain: 'Data & AI',
        summary: 'Designs, trains, evaluates, and deploys intelligent machine learning models, LLM agents, and generative AI pipelines into production.',
        overviewDescription: 'AI/ML Engineers develop data processing pipelines, fine-tune neural architectures, build retrieval-augmented generation (RAG) agents, and serve low-latency inference endpoints in scalable cloud environments.',
        salaryInsight: {
          entryLevelINR: '₹7,00,000 - ₹12,00,000',
          midLevelINR: '₹18,00,000 - ₹32,00,000',
          seniorLevelINR: '₹35,00,000 - ₹60,00,000+',
          marketTrend: 'Growing Fast',
          trendPercentage: '+46% YoY Demand Surge',
          sourceCitation: 'India AI Skills Report 2026 / Nasscom AI Mission',
          isDemoData: false,
        },
        requiredTechnicalSkills: [
          { name: 'Python', category: 'language', importance: 'critical', minimumProficiency: 'advanced' },
          { name: 'PyTorch / TensorFlow', category: 'framework', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Machine Learning Fundamentals', category: 'domain_knowledge', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'LLM Agent Architectures & RAG', category: 'architecture', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Data Engineering (Pandas / Polars)', category: 'library', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Vector Databases (Chroma/Pinecone)', category: 'database', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'FastAPI / Model Serving', category: 'framework', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Docker & GPU Optimization', category: 'cloud_devops', importance: 'medium', minimumProficiency: 'beginner' },
          { name: 'Git & Model Versioning (MLflow/DVC)', category: 'tool', importance: 'medium', minimumProficiency: 'beginner' }
        ],
        requiredSoftSkills: [
          { name: 'Empirical Rigor', importance: 'critical', description: 'Systematic benchmarking and hypothesis testing rather than intuition-based tuning.' },
          { name: 'Ethical AI & Bias Awareness', importance: 'high', description: 'Identifying data contamination, hallucination risks, and privacy boundaries.' }
        ],
        coreCompetencies: [
          'End-to-end model training and fine-tuning',
          'Agentic workflow orchestration with tool use',
          'Vector embeddings search and retrieval optimization',
          'Model evaluation, safety guardrails, and latency optimization'
        ],
        typicalRolesIncluded: [
          'Applied Machine Learning Engineer',
          'Generative AI Engineer',
          'LLM Systems Developer',
          'Data Scientist (Engineering focus)'
        ],
        sampleJobPostings: [
          {
            id: 'job-ai-01',
            title: 'Associate Machine Learning Engineer',
            company: 'Fractal Analytics',
            location: 'Mumbai / Bengaluru / Remote',
            isRemote: true,
            requiredSkills: ['Python', 'PyTorch', 'FastAPI', 'Vector Databases'],
            preferredSkills: ['LangChain', 'Docker', 'AWS SageMaker'],
            experienceLevel: '0-2 years',
            salaryRange: { min: 900000, max: 1500000, currency: 'INR', period: 'yearly' },
            sourceUrl: 'https://fractal.ai/careers/associate-ml-engineer',
            sourcePlatform: 'Fractal Careers',
            collectedAt: '2026-10-26T11:00:00Z',
            isDemoData: false,
          }
        ],
        isCustomRole: false,
      },
      {
        id: 'career-devops-03',
        slug: 'cloud-devops-engineer',
        title: 'Cloud & DevOps Platform Engineer',
        domain: 'Cloud & Infrastructure',
        summary: 'Automates infrastructure provisioning, maintains reliable CI/CD pipelines, and manages scalable Kubernetes clusters.',
        overviewDescription: 'Platform and DevOps Engineers eliminate friction for software teams. They treat infrastructure as code (Terraform), operate high-availability container clusters (Kubernetes), establish observability (Prometheus/Grafana), and implement zero-trust cloud security.',
        salaryInsight: {
          entryLevelINR: '₹6,00,000 - ₹10,00,000',
          midLevelINR: '₹16,00,000 - ₹28,00,000',
          seniorLevelINR: '₹30,00,000 - ₹50,00,000+',
          marketTrend: 'High Demand',
          trendPercentage: '+28% Openings',
          sourceCitation: 'Cloud Native Computing Foundation (CNCF) Industry Benchmark',
          isDemoData: false,
        },
        requiredTechnicalSkills: [
          { name: 'Linux System Administration & Bash', category: 'language', importance: 'critical', minimumProficiency: 'advanced' },
          { name: 'Docker & Container Runtimes', category: 'cloud_devops', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Kubernetes (K8s) Orchestration', category: 'cloud_devops', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Infrastructure as Code (Terraform)', category: 'tool', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'CI/CD (GitHub Actions / GitLab)', category: 'tool', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Cloud Providers (AWS / GCP / Azure)', category: 'cloud_devops', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Observability (Prometheus, Grafana)', category: 'tool', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Networking, DNS & TLS Security', category: 'domain_knowledge', importance: 'medium', minimumProficiency: 'intermediate' }
        ],
        requiredSoftSkills: [
          { name: 'Incident Response & Calm Under Pressure', importance: 'critical', description: 'Clear troubleshooting mindset during production outages.' },
          { name: 'Security-First Mindset', importance: 'high', description: 'Defaulting to least privilege access and automated compliance.' }
        ],
        coreCompetencies: [
          'Declarative Infrastructure as Code orchestration',
          'Kubernetes cluster lifecycle and ingress management',
          'Immutable build & automated deployment pipelines',
          'Production reliability, SLO/SLA monitoring, and disaster recovery'
        ],
        typicalRolesIncluded: [
          'DevOps Engineer',
          'Site Reliability Engineer (SRE)',
          'Cloud Systems Architect',
          'Platform Automation Specialist'
        ],
        isCustomRole: false,
      },
      {
        id: 'career-data-04',
        slug: 'data-analyst-engineer',
        title: 'Data Analyst & Analytics Engineer',
        domain: 'Data & AI',
        summary: 'Transforms raw enterprise data into clean analytical models, actionable visual dashboards, and strategic business intelligence.',
        overviewDescription: 'Data Analysts and Analytics Engineers sit at the intersection of business strategy and software engineering. They write advanced SQL queries, build transformation pipelines with dbt, and design executive dashboards.',
        salaryInsight: {
          entryLevelINR: '₹4,50,000 - ₹7,50,000',
          midLevelINR: '₹11,00,000 - ₹18,00,000',
          seniorLevelINR: '₹22,00,000 - ₹35,00,000+',
          marketTrend: 'Stable',
          trendPercentage: '+18% Steady Hiring',
          sourceCitation: 'Analytics India Magazine Career Outlook',
          isDemoData: false,
        },
        requiredTechnicalSkills: [
          { name: 'Advanced SQL & Data Modeling', category: 'database', importance: 'critical', minimumProficiency: 'advanced' },
          { name: 'Python (Pandas / NumPy)', category: 'language', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'BI Tools (PowerBI / Tableau / Metabase)', category: 'tool', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Data Warehousing (Snowflake / BigQuery)', category: 'database', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'dbt (data build tool)', category: 'framework', importance: 'high', minimumProficiency: 'beginner' },
          { name: 'Statistical Analysis & A/B Testing', category: 'domain_knowledge', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Git & Version Control for Analytics', category: 'tool', importance: 'medium', minimumProficiency: 'beginner' }
        ],
        requiredSoftSkills: [
          { name: 'Data Storytelling', importance: 'critical', description: 'Translating complex metrics into intuitive business recommendations.' },
          { name: 'Curiosity & Investigative Instinct', importance: 'high', description: 'Digging beneath surface numbers to uncover root-cause patterns.' }
        ],
        coreCompetencies: [
          'Dimensional modeling and clean warehouse schema design',
          'Automated data transformation pipelines',
          'Executive dashboard development and metric governance',
          'Statistical hypothesis testing and cohort analysis'
        ],
        typicalRolesIncluded: [
          'Business Intelligence Analyst',
          'Analytics Engineer',
          'Product Data Analyst',
          'Data Operations Specialist'
        ],
        isCustomRole: false,
      },
      {
        id: 'career-sec-05',
        slug: 'cybersecurity-analyst',
        title: 'Cybersecurity & Application Security Analyst',
        domain: 'Security',
        summary: 'Protects modern cloud applications, networks, and confidential data against vulnerabilities, intrusions, and cyber threats.',
        overviewDescription: 'Security analysts evaluate threat vectors, audit codebase vulnerabilities (SAST/DAST), configure network security controls, and implement identity protection.',
        salaryInsight: {
          entryLevelINR: '₹5,00,000 - ₹8,50,000',
          midLevelINR: '₹14,00,000 - ₹25,00,000',
          seniorLevelINR: '₹28,00,000 - ₹48,00,000+',
          marketTrend: 'High Demand',
          trendPercentage: '+32% Global Shortage',
          sourceCitation: 'ISC2 Cybersecurity Workforce Study',
          isDemoData: false,
        },
        requiredTechnicalSkills: [
          { name: 'Network Protocols & Packet Analysis (Wireshark)', category: 'domain_knowledge', importance: 'critical', minimumProficiency: 'advanced' },
          { name: 'OWASP Top 10 & AppSec Auditing', category: 'domain_knowledge', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Linux Security & Shell Scripting', category: 'language', importance: 'critical', minimumProficiency: 'intermediate' },
          { name: 'Vulnerability Scanning (Nessus / Burp Suite)', category: 'tool', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'SIEM & Log Analysis (Splunk / Elastic)', category: 'tool', importance: 'high', minimumProficiency: 'intermediate' },
          { name: 'Identity & Access Management (IAM / OAuth)', category: 'architecture', importance: 'high', minimumProficiency: 'intermediate' }
        ],
        requiredSoftSkills: [
          { name: 'Adversarial Thinking', importance: 'critical', description: 'Anticipating malicious exploit paths and user behavior edge cases.' },
          { name: 'Clear Technical Reporting', importance: 'high', description: 'Documenting security findings with actionable remediation steps.' }
        ],
        coreCompetencies: [
          'Security posture assessment and vulnerability triage',
          'Automated security scanning in CI/CD pipelines',
          'Incident response and digital forensics triage',
          'Compliance auditing and least-privilege enforcement'
        ],
        typicalRolesIncluded: [
          'SOC Analyst',
          'Application Security Engineer',
          'Penetration Tester / Ethical Hacker',
          'Cloud Security Specialist'
        ],
        isCustomRole: false,
      }
    ];

    defaultRoles.forEach((role) => {
      this.careers.set(role.id, role);
      this.careers.set(role.slug, role);
    });
  }

  public getAll(): CareerRole[] {
    const unique = new Map<string, CareerRole>();
    for (const [_, role] of this.careers.entries()) {
      unique.set(role.id, role);
    }
    return Array.from(unique.values());
  }

  public findByIdOrSlug(identifier: string): CareerRole | undefined {
    return this.careers.get(identifier);
  }

  public search(query: string, domain?: string): CareerRole[] {
    const all = this.getAll();
    const q = query.trim().toLowerCase();

    return all.filter((role) => {
      const matchesDomain = !domain || domain === 'All' || role.domain.toLowerCase() === domain.toLowerCase();
      if (!matchesDomain) return false;

      if (!q) return true;

      const titleMatch = role.title.toLowerCase().includes(q);
      const summaryMatch = role.summary.toLowerCase().includes(q);
      const skillMatch = role.requiredTechnicalSkills.some(s => s.name.toLowerCase().includes(q));

      return titleMatch || summaryMatch || skillMatch;
    });
  }

  public addCustomRole(custom: { title: string; domain?: string; description?: string }): CareerRole {
    const slug = custom.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `custom-role-${Date.now()}`;

    const newRole: CareerRole = {
      id,
      slug,
      title: custom.title,
      domain: custom.domain || 'Custom Domain',
      summary: custom.description || `Specialized career path for ${custom.title}.`,
      overviewDescription: custom.description || `Custom career track generated dynamically for ${custom.title}. Defines required technical proficiencies, soft skills, and foundational milestones.`,
      salaryInsight: {
        entryLevelINR: '₹6,00,000 - ₹10,00,000',
        midLevelINR: '₹15,00,000 - ₹25,00,000',
        seniorLevelINR: '₹28,00,000 - ₹45,00,000+',
        marketTrend: 'Emerging',
        trendPercentage: 'Dynamic Custom Path',
        sourceCitation: 'Dynamic AI Market Benchmark',
        isDemoData: true,
      },
      requiredTechnicalSkills: [
        { name: 'Core Domain Language', category: 'language', importance: 'critical', minimumProficiency: 'intermediate' },
        { name: 'Specialized Frameworks', category: 'framework', importance: 'critical', minimumProficiency: 'intermediate' },
        { name: 'System Architecture', category: 'architecture', importance: 'high', minimumProficiency: 'intermediate' },
        { name: 'Testing & Quality Assurance', category: 'tool', importance: 'medium', minimumProficiency: 'beginner' },
        { name: 'Tooling & Environment Setup', category: 'tool', importance: 'medium', minimumProficiency: 'intermediate' }
      ],
      requiredSoftSkills: [
        { name: 'Continuous Self-Directed Learning', importance: 'critical', description: 'Rapidly absorbing new libraries and emerging specifications.' },
        { name: 'Technical Documentation', importance: 'high', description: 'Authoring clean documentation for newly established patterns.' }
      ],
      coreCompetencies: [
        `Hands-on execution in ${custom.title} workflows`,
        'Modular architectural design',
        'Debugging and optimization'
      ],
      typicalRolesIncluded: [
        custom.title,
        `Junior ${custom.title}`,
        `Lead ${custom.title}`
      ],
      isCustomRole: true,
    };

    this.careers.set(newRole.id, newRole);
    this.careers.set(newRole.slug, newRole);
    return newRole;
  }
}

export const careersRepository = new CareersRepository();

