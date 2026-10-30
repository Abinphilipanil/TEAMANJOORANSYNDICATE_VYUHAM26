import { Opportunity, OpportunityType } from '@af03/contracts';

class OpportunitiesRepository {
  private opportunities: Opportunity[] = [];

  constructor() {
    this.seedDefaultOpportunities();
  }

  private seedDefaultOpportunities() {
    this.opportunities = [
      {
        id: 'opp-vyuham26',
        title: 'Vyuham 2026: AI & Systems Hackathon',
        type: 'hackathon',
        organization: 'DUK & Kerala Tech Ecosystem',
        summary: 'Flagship national hackathon challenging student and professional developers to build intelligent, agentic systems and high-impact software architectures.',
        targetRoles: ['Full-Stack Developer', 'AI / Machine Learning Engineer', 'Cloud & DevOps Platform Engineer'],
        relevantSkills: ['React.js', 'Node.js & Express', 'Python', 'LLM Agent Architectures & RAG', 'Docker & Containerization'],
        location: 'Kochi / Hybrid',
        isRemote: false,
        startDate: '2026-11-15',
        deadlineDate: '2026-11-05',
        url: 'https://vyuham.duk.ac.in',
        prizeOrPerks: '₹2,50,000 Prize Pool + Fast-track Interviews',
        verificationStatus: 'verified',
        collectedAt: '2026-10-28T09:00:00Z',
      },
      {
        id: 'opp-anthropic-agents',
        title: 'Global Agentic AI Builders Challenge',
        type: 'competition',
        organization: 'Anthropic & AI Partner Ecosystem',
        summary: 'Build tool-using autonomous workflows and verifiable agent architectures solving real business bottlenecks.',
        targetRoles: ['AI / Machine Learning Engineer', 'Full-Stack Developer'],
        relevantSkills: ['Python', 'LLM Agent Architectures & RAG', 'FastAPI / Model Serving', 'Vector Databases (Chroma/Pinecone)'],
        location: 'Global Virtual',
        isRemote: true,
        startDate: '2026-11-20',
        deadlineDate: '2026-11-12',
        url: 'https://anthropic.com/hackathons/agentic-ai-2026',
        prizeOrPerks: '$50,000 in API Credits + Venture Incubation Support',
        verificationStatus: 'verified',
        collectedAt: '2026-10-27T12:00:00Z',
      },
      {
        id: 'opp-cloud-native-blr',
        title: 'KubeDay & Cloud Native Summit India',
        type: 'conference',
        organization: 'Cloud Native Computing Foundation (CNCF)',
        summary: 'Technical deep-dives on Kubernetes operational scaling, platform engineering, eBPF observability, and cloud resilience.',
        targetRoles: ['Cloud & DevOps Platform Engineer', 'Full-Stack Developer', 'Cybersecurity & Application Security Analyst'],
        relevantSkills: ['Kubernetes (K8s) Orchestration', 'Docker & Container Runtimes', 'Infrastructure as Code (Terraform)', 'Observability (Prometheus, Grafana)'],
        location: 'Bengaluru, India',
        isRemote: false,
        startDate: '2026-12-04',
        deadlineDate: '2026-11-25',
        url: 'https://events.linuxfoundation.org/kubeday-india',
        prizeOrPerks: 'Student Scholarships & Direct Networking with Platform Leads',
        verificationStatus: 'verified',
        collectedAt: '2026-10-26T15:00:00Z',
      },
      {
        id: 'opp-pycon-india',
        title: 'PyData & PyCon Regional Summit',
        type: 'conference',
        organization: 'Python Software Society of India',
        summary: 'The premier community gathering for Pythonistas, scientific computing, data engineering, and machine learning researchers.',
        targetRoles: ['AI / Machine Learning Engineer', 'Data Analyst & Analytics Engineer'],
        relevantSkills: ['Python', 'Advanced SQL & Data Modeling', 'PyTorch / TensorFlow', 'Data Engineering (Pandas / Polars)'],
        location: 'Hyderabad / Virtual Stream',
        isRemote: true,
        startDate: '2026-12-10',
        deadlineDate: '2026-11-30',
        url: 'https://in.pycon.org',
        prizeOrPerks: 'Open Source Mentorship & Developer Workshops',
        verificationStatus: 'verified',
        collectedAt: '2026-10-25T11:00:00Z',
      },
      {
        id: 'opp-null-con-sec',
        title: 'Null Bangalore Cyber Threat & AppSec Meetup',
        type: 'community',
        organization: 'Null Open Security Community',
        summary: 'Monthly community meetup analyzing real-world CVEs, web application attack chains, and binary exploitation demos.',
        targetRoles: ['Cybersecurity & Application Security Analyst'],
        relevantSkills: ['OWASP Top 10 & AppSec Auditing', 'Vulnerability Scanning (Nessus / Burp Suite)', 'Linux Security & Shell Scripting'],
        location: 'Bengaluru, India',
        isRemote: false,
        startDate: '2026-11-08',
        deadlineDate: '2026-11-07',
        url: 'https://null.community/chapters/1-bangalore',
        prizeOrPerks: 'Free Community Entry & Live CTF Challenges',
        verificationStatus: 'verified',
        collectedAt: '2026-10-28T16:00:00Z',
      }
    ];
  }

  public getAll(): Opportunity[] {
    return [...this.opportunities];
  }

  public filter(targetRole?: string, type?: OpportunityType, location?: string): Opportunity[] {
    return this.opportunities.filter((opp) => {
      if (targetRole && !opp.targetRoles.some(r => r.toLowerCase().includes(targetRole.toLowerCase()))) {
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
}

export const opportunitiesRepository = new OpportunitiesRepository();

