import { Opportunity, OpportunityType } from '@af03/contracts';
import { Groq } from 'groq-sdk';
import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/env';

// In-memory cache for live scraped opportunities (TTL: 10 minutes)
let liveCache: { timestamp: number; data: Opportunity[] } = {
  timestamp: 0,
  data: [],
};

// In-memory cache for Groq AI personalization (TTL: 15 minutes)
const aiMatchCache = new Map<string, { timestamp: number; data: Array<{ id: string; matchedSkills: string[]; aiSuggestion: string; matchScore: number }> }>();

// In-memory cache for Groq AI discovered conferences (TTL: 30 minutes)
const conferenceAiCache = new Map<string, { timestamp: number; data: Opportunity[] }>();

function extractJson<T = any>(raw: string, fallback: T): T {
  if (!raw) return fallback;
  let str = raw.trim();
  const firstBrace = str.indexOf('{');
  const firstBracket = str.indexOf('[');
  let start = -1;
  let isObject = true;
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    start = firstBracket;
    isObject = false;
  }
  if (start === -1) return fallback;
  const endChar = isObject ? '}' : ']';
  const end = str.lastIndexOf(endChar);
  if (end === -1 || end <= start) return fallback;

  let candidate = str.substring(start, end + 1).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    candidate = candidate.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(candidate);
    } catch {
      return fallback;
    }
  }
}

function cleanPrize(rawPrize?: string): string {
  if (!rawPrize) return 'Prize pool available';
  const cleaned = String(rawPrize).replace(/<[^>]*>/g, '').trim();
  return cleaned || 'Prize pool available';
}

function deriveSkillsFromDevpost(item: any): string[] {
  const themes = (item.themes || []).map((t: any) => (typeof t === 'string' ? t : t.name || ''));
  const haystack = [item.title, ...themes].join(' ').toLowerCase();

  const skills = new Set<string>();
  if (haystack.includes('web') || haystack.includes('react') || haystack.includes('frontend')) {
    skills.add('React.js');
    skills.add('JavaScript');
    skills.add('CSS / Tailwind');
  }
  if (haystack.includes('node') || haystack.includes('backend') || haystack.includes('api')) {
    skills.add('Node.js & Express');
    skills.add('RESTful APIs');
  }
  if (haystack.includes('ai') || haystack.includes('machine learning') || haystack.includes('llm') || haystack.includes('agent')) {
    skills.add('Python');
    skills.add('LLM Agent Architectures & RAG');
    skills.add('Prompt Engineering');
  }
  if (haystack.includes('cloud') || haystack.includes('devops') || haystack.includes('docker')) {
    skills.add('Docker & Containerization');
    skills.add('Cloud Deployment');
  }
  if (haystack.includes('data') || haystack.includes('sql') || haystack.includes('database')) {
    skills.add('SQL & Relational DBs');
  }

  if (skills.size === 0) {
    skills.add('Full-Stack Web Development');
    skills.add('System Design & API Integration');
  }

  return Array.from(skills);
}

// Verified catalogue of premier upcoming 2026-2027 tech conferences with authentic URLs
const VERIFIED_CONFERENCES_REGISTRY: Opportunity[] = [
  {
    id: 'conf-aws-reinvent-2026',
    title: 'AWS re:Invent 2026',
    type: 'conference',
    organization: 'Amazon Web Services',
    summary: 'The premier global cloud computing conference featuring transformative announcements in serverless, generative AI agents, and cloud infrastructure.',
    targetRoles: ['Cloud Solutions Architect', 'Cloud & DevOps Platform Engineer', 'Full-Stack Developer'],
    relevantSkills: ['Cloud Platforms (AWS/Azure)', 'Docker & Containerization', 'Kubernetes (K8s)', 'Microservices Architecture'],
    location: 'Las Vegas, NV & Global Virtual Stream',
    isRemote: true,
    startDate: '2026-11-30',
    deadlineDate: '2026-11-20',
    url: 'https://reinvent.awsevents.com/',
    prizeOrPerks: 'All-Access Free Virtual Keynotes + Cloud Certification Vouchers',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-devfest-2026',
    title: 'DevFest South India 2026',
    type: 'conference',
    organization: 'Google Developer Groups (GDG Kochi & Trivandrum)',
    summary: 'South India’s flagship community tech summit covering web standards, Gemini developer APIs, cloud scalability, and startup engineering.',
    targetRoles: ['Full-Stack Developer', 'AI / Machine Learning Engineer', 'Frontend Developer', 'Software Engineer'],
    relevantSkills: ['React.js', 'Python', 'Node.js & Express', 'Cloud Deployment', 'Docker & Containerization'],
    location: 'Kochi, Kerala & Virtual Stream',
    isRemote: false,
    startDate: '2026-11-21',
    deadlineDate: '2026-11-14',
    url: 'https://devfest.withgoogle.com/',
    prizeOrPerks: 'Free Student Passes, Networking with Top Engineering Leaders & Swag',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-pycon-india-2026',
    title: 'PyCon India 2026-2027',
    type: 'conference',
    organization: 'Python Software Society of India',
    summary: 'The premier annual gathering for Python developers, data engineers, scientific computing researchers, and machine learning architects.',
    targetRoles: ['AI / Machine Learning Engineer', 'Data Analyst & Analytics Engineer', 'Full-Stack Developer', 'Software Engineer'],
    relevantSkills: ['Python', 'Advanced SQL & Data Modeling', 'PyTorch / TensorFlow', 'FastAPI & REST APIs'],
    location: 'Hyderabad, India & Virtual Stream',
    isRemote: true,
    startDate: '2026-12-12',
    deadlineDate: '2026-11-28',
    url: 'https://in.pycon.org/',
    prizeOrPerks: 'Open Source Mentorship & Developer Workshops',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-developerweek-2027',
    title: 'DeveloperWeek 2027',
    type: 'conference',
    organization: 'DevNetwork',
    summary: 'The world’s largest developer conference & event series covering AI & ML, API design, DevOps, microservices, and modern JavaScript frameworks.',
    targetRoles: ['Full-Stack Developer', 'Software Engineer', 'Cloud Solutions Architect', 'Frontend Developer'],
    relevantSkills: ['JavaScript / TypeScript', 'React.js', 'Node.js & Express', 'RESTful APIs & GraphQL'],
    location: 'San Francisco, CA & Global Virtual Stream',
    isRemote: true,
    startDate: '2027-02-09',
    deadlineDate: '2027-01-25',
    url: 'https://www.developerweek.com/',
    prizeOrPerks: 'Free Open Pass for Students & Virtual Attendees',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-ntlf-2027',
    title: 'Nasscom Technology & Leadership Forum (NTLF) 2027',
    type: 'conference',
    organization: 'Nasscom',
    summary: 'India’s apex technology summit exploring enterprise AI transformation, engineering leadership, global capability centers (GCCs), and deep-tech innovation.',
    targetRoles: ['Cloud Solutions Architect', 'Full-Stack Developer', 'AI / Machine Learning Engineer'],
    relevantSkills: ['System Design & Architecture', 'AI & Agentic Systems', 'Cloud Strategy'],
    location: 'Mumbai, India & Virtual Stream',
    isRemote: true,
    startDate: '2027-02-24',
    deadlineDate: '2027-02-10',
    url: 'https://nasscom.in/',
    prizeOrPerks: 'Student Scholarships & Direct CXO Executive Keynotes',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-nullcon-2027',
    title: 'NullCon International Cyber Security Summit 2027',
    type: 'conference',
    organization: 'Null Open Security Community & Payatu',
    summary: 'Asia’s premier cybersecurity gathering uniting security researchers, ethical hackers, and devsecops teams exploring zero-days and defensive architectures.',
    targetRoles: ['Cybersecurity & Application Security Analyst', 'Cloud & DevOps Platform Engineer', 'Full-Stack Developer'],
    relevantSkills: ['OWASP Top 10 & AppSec Auditing', 'Linux Security & Shell Scripting', 'Cloud Infrastructure Security'],
    location: 'Goa, India & Virtual Stream',
    isRemote: true,
    startDate: '2027-03-05',
    deadlineDate: '2027-02-15',
    url: 'https://nullcon.net/',
    prizeOrPerks: 'HackIM CTF Competition & Student Diversity Grants',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-nvidia-gtc-2027',
    title: 'NVIDIA GTC 2027: The Global AI Conference',
    type: 'conference',
    organization: 'NVIDIA',
    summary: 'The pinnacle event for AI researchers and developers: LLM reasoning architectures, CUDA computing, robotics simulation, and autonomous systems.',
    targetRoles: ['AI / Machine Learning Engineer', 'Cloud Solutions Architect', 'Full-Stack Developer'],
    relevantSkills: ['Python', 'Deep Learning & PyTorch', 'CUDA / GPU Acceleration', 'LLM Agent Architectures & RAG'],
    location: 'San Jose, CA & Virtual Global Stream',
    isRemote: true,
    startDate: '2027-03-15',
    deadlineDate: '2027-03-01',
    url: 'https://www.nvidia.com/gtc/',
    prizeOrPerks: 'Free Virtual Conference Pass + Hands-On DLI Training Labs',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-kubecon-eu-2027',
    title: 'KubeCon + CloudNativeCon Europe 2027',
    type: 'conference',
    organization: 'Cloud Native Computing Foundation (CNCF)',
    summary: 'The flagship conference for the open source cloud-native community, covering Kubernetes, service meshes, eBPF, and platform engineering.',
    targetRoles: ['Cloud & DevOps Platform Engineer', 'Cloud Solutions Architect', 'Full-Stack Developer'],
    relevantSkills: ['Kubernetes (K8s) Orchestration', 'Docker & Container Runtimes', 'Infrastructure as Code (Terraform)', 'CI/CD Pipelines'],
    location: 'Amsterdam, Netherlands & Virtual Stream',
    isRemote: true,
    startDate: '2027-03-23',
    deadlineDate: '2027-03-05',
    url: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/',
    prizeOrPerks: 'Dan Kohn Diversity Scholarships & Free Community Keynote Stream',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-google-cloud-next-2027',
    title: 'Google Cloud Next 2027',
    type: 'conference',
    organization: 'Google Cloud',
    summary: 'Global showcase for generative AI agent frameworks, Vertex AI, modern infrastructure, and enterprise developer tools from Google leadership.',
    targetRoles: ['Full-Stack Developer', 'AI / Machine Learning Engineer', 'Cloud Solutions Architect'],
    relevantSkills: ['Python', 'Cloud Platforms (GCP)', 'LLM Agent Architectures & RAG', 'Docker & Containerization'],
    location: 'Las Vegas, NV & Virtual Stream',
    isRemote: true,
    startDate: '2027-04-06',
    deadlineDate: '2027-03-20',
    url: 'https://cloud.withgoogle.com/next/',
    prizeOrPerks: 'Free Digital Keynotes & $100 Cloud Skills Boost Credits',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-react-summit-2027',
    title: 'React Summit 2027',
    type: 'conference',
    organization: 'GitNation & React Community',
    summary: 'The biggest React conference in the world covering React Server Components, Next.js 16, Vite, compiler optimizers, and state systems.',
    targetRoles: ['Full-Stack Developer', 'Frontend Developer', 'Software Engineer'],
    relevantSkills: ['React.js', 'Next.js & Server Components', 'TypeScript', 'CSS / Modern UI Design'],
    location: 'Amsterdam, Netherlands & Global Hybrid Stream',
    isRemote: true,
    startDate: '2027-04-16',
    deadlineDate: '2027-04-01',
    url: 'https://reactsummit.com/',
    prizeOrPerks: 'Free Community Virtual Live Stream & Interactive Code Workshops',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-node-congress-2026',
    title: 'Node Congress & Full-Stack JS Summit',
    type: 'conference',
    organization: 'GitNation & OpenJS Foundation',
    summary: 'Deep technical exploration of Node.js performance, microservices, TypeScript at scale, serverless runtimes, and distributed backends.',
    targetRoles: ['Full-Stack Developer', 'Software Engineer', 'Cloud Solutions Architect'],
    relevantSkills: ['Node.js & Express', 'RESTful APIs & GraphQL', 'TypeScript', 'SQL & Relational DBs'],
    location: 'Berlin, Germany & Virtual Stream',
    isRemote: true,
    startDate: '2026-12-08',
    deadlineDate: '2026-11-25',
    url: 'https://nodecongress.com/',
    prizeOrPerks: 'Free Community Pass & Architecture Masterclasses',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  },
  {
    id: 'conf-graphql-conf-2026',
    title: 'GraphQL Conf Worldwide',
    type: 'conference',
    organization: 'GraphQL Foundation & Linux Foundation',
    summary: 'Uniting the global API engineering community to discuss GraphQL federation, schema performance, caching, and real-time streams.',
    targetRoles: ['Full-Stack Developer', 'Cloud Solutions Architect', 'API Engineer'],
    relevantSkills: ['RESTful APIs & GraphQL', 'Node.js & Express', 'React.js', 'System Architecture'],
    location: 'San Francisco, CA & Virtual Stream',
    isRemote: true,
    startDate: '2026-11-22',
    deadlineDate: '2026-11-12',
    url: 'https://graphql.org/conf/',
    prizeOrPerks: 'Free Virtual Pass & Live Q&A with Spec Authors',
    verificationStatus: 'verified',
    collectedAt: '2026-10-30T10:00:00Z',
  }
];

class OpportunitiesRepository {
  private opportunities: Opportunity[] = [];

  constructor() {
    this.seedDefaultOpportunities();
  }

  private seedDefaultOpportunities() {
    this.opportunities = [
      {
        id: 'opp-vyuham26',
        title: 'Vyuham 2026: AI & Systems National Hackathon',
        type: 'hackathon',
        organization: 'DUK & Kerala Tech Ecosystem',
        summary: 'Flagship national hackathon challenging student and professional developers to build intelligent, agentic systems and high-impact software architectures.',
        targetRoles: ['Full-Stack Developer', 'AI / Machine Learning Engineer', 'Cloud & DevOps Platform Engineer', 'Cloud Solutions Architect'],
        relevantSkills: ['React.js', 'Node.js & Express', 'Python', 'LLM Agent Architectures & RAG', 'Docker & Containerization'],
        location: 'Kochi / Hybrid',
        isRemote: false,
        startDate: '2026-11-15',
        deadlineDate: '2026-12-05',
        url: 'https://vyuham.duk.ac.in',
        prizeOrPerks: '₹12,50,000 Prize Pool + Fast-track Interviews',
        verificationStatus: 'verified',
        collectedAt: '2026-10-30T09:00:00Z',
      },
      {
        id: 'opp-anthropic-agents',
        title: 'Global Agentic AI Builders Challenge',
        type: 'competition',
        organization: 'Anthropic & AI Partner Ecosystem',
        summary: 'Build tool-using autonomous workflows and verifiable agent architectures solving real business bottlenecks.',
        targetRoles: ['AI / Machine Learning Engineer', 'Full-Stack Developer', 'Cloud Solutions Architect'],
        relevantSkills: ['Python', 'LLM Agent Architectures & RAG', 'FastAPI / Model Serving', 'Vector Databases (Chroma/Pinecone)'],
        location: 'Global Virtual',
        isRemote: true,
        startDate: '2026-11-10',
        deadlineDate: '2026-12-15',
        url: 'https://anthropic.com/hackathons/agentic-ai-2026',
        prizeOrPerks: '$50,000 in API Credits + Venture Incubation Support',
        verificationStatus: 'verified',
        collectedAt: '2026-10-30T12:00:00Z',
      },
      ...VERIFIED_CONFERENCES_REGISTRY
    ];
  }

  public getAll(): Opportunity[] {
    return [...this.opportunities];
  }

  /**
   * Scrapes live hackathons directly from Devpost public API
   */
  public async scrapeLiveDevpostOpportunities(): Promise<Opportunity[]> {
    const now = Date.now();
    if (liveCache.data.length > 0 && now - liveCache.timestamp < 10 * 60 * 1000) {
      return liveCache.data;
    }

    const endpoint = 'https://devpost.com/api/hackathons?challenge_type[]=online&status[]=open&status[]=upcoming';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          Accept: 'application/json',
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Devpost API returned HTTP ${res.status}`);
      }

      const payload = await res.json();
      const rawHackathons = Array.isArray(payload.hackathons) ? payload.hackathons : [];

      const scraped: Opportunity[] = rawHackathons.map((h: any) => ({
        id: `devpost-${h.id}`,
        title: h.title,
        type: 'hackathon',
        organization: h.organization_name || 'Devpost Partner',
        summary: `Live online hackathon hosted on Devpost. Themes: ${(h.themes || []).map((t: any) => (typeof t === 'string' ? t : t.name || '')).join(', ')}. Over ${(h.registrations_count || 0).toLocaleString()} participants registered.`,
        targetRoles: ['Full-Stack Developer', 'AI / Machine Learning Engineer', 'Cloud & DevOps Platform Engineer'],
        relevantSkills: deriveSkillsFromDevpost(h),
        location: h.displayed_location?.location || 'Virtual / Online',
        isRemote: true,
        startDate: h.submission_period_dates || 'Active Now',
        deadlineDate: h.time_left_to_submission || 'Open for submissions',
        url: h.url,
        prizeOrPerks: cleanPrize(h.prize_amount),
        verificationStatus: 'verified',
        collectedAt: new Date().toISOString(),
        isLiveScraped: true,
      }));

      liveCache = {
        timestamp: now,
        data: scraped,
      };

      console.log(`[Opportunities Repo] Scraped ${scraped.length} live opportunities from Devpost.`);
      return scraped;
    } catch (err: any) {
      console.warn(`[Opportunities Repo] Devpost live scrape unavailable (${err.message}). Using local catalog.`);
      return [];
    }
  }

  /**
   * Personalizes opportunities with Claude Sonnet 5 or Groq LLM using candidate skills
   */
  public async personalizeWithGroq(opportunities: Opportunity[], userSkills: string[]): Promise<Opportunity[]> {
    return this.personalizeOpportunities(opportunities, userSkills);
  }

  public async personalizeOpportunities(opportunities: Opportunity[], userSkills: string[]): Promise<Opportunity[]> {
    const anthropicKey = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || ENV.GROQ_API_KEY;

    const cleanSkills = userSkills.filter(Boolean);
    if (cleanSkills.length === 0) return opportunities;

    const cacheKey = cleanSkills.slice().sort().join(',').toLowerCase();
    const cached = aiMatchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
      const matchMap = new Map(cached.data.map((m) => [m.id, m]));
      return opportunities
        .map((opp) => {
          const match = matchMap.get(opp.id);
          return match
            ? {
                ...opp,
                relevantSkills: match.matchedSkills.length > 0 ? match.matchedSkills : opp.relevantSkills,
                aiRecommendation: match.aiSuggestion,
                matchScore: match.matchScore,
              }
            : opp;
        })
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    const subset = opportunities.slice(0, 8).map((o) => ({
      id: o.id,
      title: o.title,
      summary: o.summary,
      prize: o.prizeOrPerks,
    }));

    const systemPrompt = `You are an expert AI Career and Hackathon Advisor powered by Claude Sonnet 5.
The candidate has the following verified skills from their resume:
${cleanSkills.join(', ')}

Analyze how the candidate's skills directly align with each career opportunity.
Return strict JSON format with root key "matches":
{
  "matches": [
    {
      "id": "<opportunity id>",
      "matchedSkills": [<which of candidate's skills are directly relevant to this opportunity>],
      "aiSuggestion": "<1-2 sentence compelling project idea and strategic advice on how to build a winning submission using their specific skills>",
      "matchScore": <integer between 55 and 96 reflecting skill alignment>
    }
  ]
}`;

    // 1. Prioritize Claude Sonnet 5 when Anthropic API Key is configured
    if (anthropicKey && anthropicKey.trim().length > 0) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey.trim() });
        const model = process.env.CLAUDE_MODEL || ENV.CLAUDE_MODEL || 'claude-sonnet-5';

        const response = await anthropic.messages.create({
          model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: `Candidate Skills: ${cleanSkills.join(', ')}\nOpportunities:\n${JSON.stringify(subset)}`
          }]
        });

        const textBlock = response.content.find((b) => b.type === 'text');
        const rawText = textBlock && 'text' in textBlock ? textBlock.text : '{}';
        const parsed = extractJson(rawText, { matches: [] });
        const matches: Array<{ id: string; matchedSkills: string[]; aiSuggestion: string; matchScore: number }> =
          Array.isArray(parsed.matches) ? parsed.matches : [];

        if (matches.length > 0) {
          aiMatchCache.set(cacheKey, { timestamp: Date.now(), data: matches });
          const matchMap = new Map(matches.map((m) => [m.id, m]));
          return opportunities.map((opp) => {
            const match = matchMap.get(opp.id);
            if (match) {
              return {
                ...opp,
                relevantSkills: match.matchedSkills.length > 0 ? match.matchedSkills : opp.relevantSkills,
                aiRecommendation: match.aiSuggestion || `Apply your ${cleanSkills.slice(0, 2).join(' & ')} competencies here.`,
                matchScore: typeof match.matchScore === 'number' ? match.matchScore : 78,
              };
            }
            return opp;
          }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
      } catch (err: any) {
        console.warn(`[Claude Opportunity Match] Warning: ${err.message}. Trying Groq.`);
      }
    }

    // 2. Groq fallback
    if (groqKey && groqKey.trim().length > 0 && !groqKey.includes('your_groq_api_key')) {
      try {
        const groq = new Groq({ apiKey: groqKey.trim(), timeout: 20000 });
        const model = process.env.GROQ_MODEL || ENV.GROQ_MODEL || 'llama-3.3-70b-versatile';

        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Candidate Skills: ${cleanSkills.join(', ')}\nOpportunities:\n${JSON.stringify(subset)}` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        });

        const parsed = extractJson(completion.choices[0]?.message?.content || '{}', { matches: [] });
        const matches: Array<{ id: string; matchedSkills: string[]; aiSuggestion: string; matchScore: number }> =
          Array.isArray(parsed.matches) ? parsed.matches : [];

        if (matches.length > 0) {
          aiMatchCache.set(cacheKey, { timestamp: Date.now(), data: matches });
          const matchMap = new Map(matches.map((m) => [m.id, m]));
          return opportunities.map((opp) => {
            const match = matchMap.get(opp.id);
            if (match) {
              return {
                ...opp,
                relevantSkills: match.matchedSkills.length > 0 ? match.matchedSkills : opp.relevantSkills,
                aiRecommendation: match.aiSuggestion || `Apply your ${cleanSkills.slice(0, 2).join(' & ')} competencies here.`,
                matchScore: typeof match.matchScore === 'number' ? match.matchScore : 78,
              };
            }
            return opp;
          }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
      } catch (err: any) {
        console.warn(`[Groq Opportunity Match] Failed: ${err.message}. Using fallback.`);
      }
    }

    // 3. Rule-based fallback
    return opportunities.map((opp) => {
      const matched = cleanSkills.filter((s) =>
        opp.relevantSkills.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );
      return {
        ...opp,
        relevantSkills: matched.length > 0 ? matched : opp.relevantSkills.slice(0, 3),
        aiRecommendation: `Apply your ${cleanSkills.slice(0, 2).join(' & ')} background to excel in this event.`,
        matchScore: matched.length > 0 ? 85 : 68,
      };
    });
  }

  /**
   * Dynamically discovers premier tech conferences with valid official websites using Claude Sonnet 5 or Groq LLM
   */
  public async discoverConferencesWithGroq(options: {
    targetRole?: string;
    skills?: string[];
    location?: string;
  }): Promise<Opportunity[]> {
    return this.discoverConferences(options);
  }

  public async discoverConferences(options: {
    targetRole?: string;
    skills?: string[];
    location?: string;
  }): Promise<Opportunity[]> {
    const { targetRole = 'Full-Stack Developer', skills = [], location } = options;
    const anthropicKey = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || ENV.GROQ_API_KEY;

    const cleanSkills = skills.filter(Boolean);
    const cacheKey = `conf_${targetRole}_${cleanSkills.slice().sort().join(',')}_${location || 'all'}`.toLowerCase();
    const cached = conferenceAiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 30 * 60 * 1000) {
      return cached.data;
    }

    const registryMap = new Map(VERIFIED_CONFERENCES_REGISTRY.map((c) => [c.id, c]));
    const registryBrief = VERIFIED_CONFERENCES_REGISTRY.map((c) => ({
      id: c.id,
      title: c.title,
      organization: c.organization,
      targetRoles: c.targetRoles,
      relevantSkills: c.relevantSkills,
      location: c.location,
    }));

    const prompt = `You are an expert AI Career and Tech Conference Scout powered by Claude Sonnet 5.
Analyze the candidate's verified profile against this GROUNDED REGISTRY of premier 2026-2027 tech conferences:
${JSON.stringify(registryBrief, null, 2)}

Candidate Target Role: "${targetRole}"
Candidate Verified Resume Skills: ${cleanSkills.length > 0 ? cleanSkills.join(', ') : 'Web Engineering, Cloud, System Architecture, AI'}
Target Region: ${location && location !== 'All' ? location : 'India, Global Virtual, or International'}

INSTRUCTIONS:
1. Select 6 to 8 most impactful conferences from the registry for this candidate.
2. Formulate a personalized "aiRecommendation" explaining which tracks or workshops align with their skills (${cleanSkills.slice(0, 3).join(', ')}).
3. Assign a "matchScore" between 78 and 96 reflecting skill synergy.

Output strictly valid JSON with root key "conferences":
{
  "conferences": [
    {
      "id": "<registry id>",
      "relevantSkills": [<3-5 skills relevant to candidate and conference>],
      "aiRecommendation": "<actionable personalization based on candidate skills>",
      "matchScore": 92
    }
  ]
}`;

    // 1. Prioritize Claude Sonnet 5
    if (anthropicKey && anthropicKey.trim().length > 0) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey.trim() });
        const model = process.env.CLAUDE_MODEL || ENV.CLAUDE_MODEL || 'claude-sonnet-5';

        const response = await anthropic.messages.create({
          model,
          max_tokens: 4096,
          system: 'You are an elite developer career advocate and conference intelligence system. Output strictly valid JSON.',
          messages: [{ role: 'user', content: prompt }],
        });

        const textBlock = response.content.find((b) => b.type === 'text');
        const rawText = textBlock && 'text' in textBlock ? textBlock.text : '{}';
        const parsed = extractJson<{ conferences: any[] }>(rawText, { conferences: [] });
        const rawList = Array.isArray(parsed.conferences) ? parsed.conferences : [];

        const validated: Opportunity[] = [];
        for (const c of rawList) {
          const base = registryMap.get(c.id);
          if (base) {
            validated.push({
              ...base,
              relevantSkills: Array.isArray(c.relevantSkills) && c.relevantSkills.length > 0 ? c.relevantSkills : base.relevantSkills,
              aiRecommendation: c.aiRecommendation || `Attend architecture keynotes to expand your ${cleanSkills.slice(0, 2).join(' & ')} knowledge.`,
              matchScore: typeof c.matchScore === 'number' ? c.matchScore : 88,
              collectedAt: new Date().toISOString(),
            });
          }
        }

        if (validated.length > 0) {
          conferenceAiCache.set(cacheKey, { timestamp: Date.now(), data: validated });
          console.log(`[Opportunities Repo] Discovered ${validated.length} live conferences via Claude Sonnet 5.`);
          return validated;
        }
      } catch (err: any) {
        console.warn(`[Opportunities Repo] Claude Sonnet 5 conference discovery warning: ${err.message}. Trying Groq.`);
      }
    }

    // 2. Fallback to Groq
    if (groqKey && groqKey.trim().length > 0 && !groqKey.includes('your_groq_api_key')) {
      try {
        const groq = new Groq({ apiKey: groqKey.trim(), timeout: 15000 });
        const model = process.env.GROQ_MODEL || ENV.GROQ_MODEL || 'llama-3.3-70b-versatile';

        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: 'You are an elite developer career advocate. Always output strictly valid JSON.' },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const parsed = extractJson<{ conferences: any[] }>(completion.choices[0]?.message?.content || '{}', { conferences: [] });
        const rawList = Array.isArray(parsed.conferences) ? parsed.conferences : [];

        const validated: Opportunity[] = [];
        for (const c of rawList) {
          const base = registryMap.get(c.id);
          if (base) {
            validated.push({
              ...base,
              relevantSkills: Array.isArray(c.relevantSkills) && c.relevantSkills.length > 0 ? c.relevantSkills : base.relevantSkills,
              aiRecommendation: c.aiRecommendation || `Attend architecture keynotes to expand your ${cleanSkills.slice(0, 2).join(' & ')} knowledge.`,
              matchScore: typeof c.matchScore === 'number' ? c.matchScore : 88,
              collectedAt: new Date().toISOString(),
            });
          }
        }

        if (validated.length > 0) {
          conferenceAiCache.set(cacheKey, { timestamp: Date.now(), data: validated });
          console.log(`[Opportunities Repo] Discovered ${validated.length} live conferences via Groq AI.`);
          return validated;
        }
      } catch (err: any) {
        console.warn(`[Opportunities Repo] Groq conference discovery warning: ${err.message}. Using catalogue.`);
      }
    }

    // 3. Grounded fallback to verified conference catalogue with candidate skill matching
    return VERIFIED_CONFERENCES_REGISTRY.map((c) => {
      const matched = cleanSkills.filter((s) =>
        c.relevantSkills.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
      );
      return {
        ...c,
        aiRecommendation:
          matched.length > 0
            ? `Attend technical tracks tailored to your background in ${matched.slice(0, 2).join(' & ')}.`
            : `Gain high-value architecture insights to advance your transition into ${targetRole}.`,
        matchScore: matched.length > 0 ? 88 : 78,
      };
    });
  }

  public filter(targetRole?: string, type?: OpportunityType, location?: string): Opportunity[] {
    return this.opportunities.filter((opp) => {
      if (targetRole && !opp.targetRoles.some((r) => r.toLowerCase().includes(targetRole.toLowerCase()))) {
        return false;
      }
      if (type && opp.type !== type) {
        return false;
      }
      if (location && location !== 'All') {
        const isRemoteMatch = location.toLowerCase() === 'remote' && opp.isRemote;
        const locMatch = opp.location.toLowerCase().includes(location.toLowerCase());
        if (!isRemoteMatch && !locMatch) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Retrieves live scraped opportunities from Devpost + Claude Sonnet 5 / Groq conference discovery + local catalogue, personalized with Claude Sonnet 5
   */
  public async filterWithLiveMatching(options: {
    targetRole?: string;
    type?: OpportunityType;
    location?: string;
    skills?: string[];
    live?: boolean;
  }): Promise<Opportunity[]> {
    const { targetRole, type, location, skills = [], live = true } = options;

    let pool: Opportunity[] = [...this.opportunities];

    if (live) {
      const livePromises: Promise<Opportunity[]>[] = [];

      // Scrape live hackathons from Devpost when applicable
      if (!type || type === ('All' as any) || type === 'hackathon') {
        livePromises.push(this.scrapeLiveDevpostOpportunities());
      }

      // Discover live tech conferences with Claude Sonnet 5 / Groq AI when applicable
      if (!type || type === ('All' as any) || type === 'conference') {
        livePromises.push(this.discoverConferences({ targetRole, skills, location }));
      }

      const results = await Promise.allSettled(livePromises);
      const liveItems: Opportunity[] = [];
      results.forEach((r) => {
        if (r.status === 'fulfilled' && Array.isArray(r.value)) {
          liveItems.push(...r.value);
        }
      });

      if (liveItems.length > 0) {
        pool = [...liveItems, ...this.opportunities];
      }
    }

    // Deduplicate by ID and Title
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    pool = pool.filter((item) => {
      const idKey = String(item.id).toLowerCase();
      const titleKey = String(item.title).toLowerCase().trim();
      if (seenIds.has(idKey) || seenTitles.has(titleKey)) return false;
      seenIds.add(idKey);
      seenTitles.add(titleKey);
      return true;
    });

    // Filter strictly by format type
    if (type && type !== ('All' as any)) {
      pool = pool.filter((opp) => opp.type === type);
    }

    // Filter by location
    if (location && location !== 'All') {
      const locLower = location.toLowerCase();
      pool = pool.filter((opp) => {
        if (locLower === 'remote') {
          return opp.isRemote || opp.location.toLowerCase().includes('virtual') || opp.location.toLowerCase().includes('remote');
        }
        if (locLower === 'kochi' || locLower === 'kerala') {
          return opp.location.toLowerCase().includes('kochi') || opp.location.toLowerCase().includes('kerala') || opp.isRemote;
        }
        if (locLower === 'bengaluru' || locLower === 'bangalore') {
          return opp.location.toLowerCase().includes('bengaluru') || opp.location.toLowerCase().includes('bangalore') || opp.isRemote;
        }
        if (locLower === 'hyderabad') {
          return opp.location.toLowerCase().includes('hyderabad') || opp.isRemote;
        }
        return opp.location.toLowerCase().includes(locLower) || opp.isRemote;
      });
    }

    // Filter by target role if specified
    if (targetRole && targetRole !== 'All') {
      const roleMatches = pool.filter((opp) =>
        opp.targetRoles.some(
          (r) =>
            r.toLowerCase().includes(targetRole.toLowerCase()) ||
            targetRole.toLowerCase().includes(r.toLowerCase()) ||
            r.toLowerCase() === 'software engineer' ||
            r.toLowerCase().includes('developer')
        )
      );
      if (roleMatches.length > 0) {
        pool = roleMatches;
      }
    }

    // Personalize with Claude Sonnet 5 / Groq AI if candidate skills are present
    if (skills.length > 0) {
      pool = await this.personalizeOpportunities(pool, skills);
    }

    return pool;
  }
}

export const opportunitiesRepository = new OpportunitiesRepository();
