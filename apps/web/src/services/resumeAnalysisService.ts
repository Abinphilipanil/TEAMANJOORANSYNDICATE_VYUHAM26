/**
 * Resume Analysis Service for CareerAgent AI (AF-03)
 * 
 * Communicates with the backend agent pipeline (/api/agent/analyze)
 * which extracts PDF text and invokes the Groq LLM intelligence engine.
 */

export interface MatchedSkill {
  name: string;
  category: string;
  matchType: string;
  context: string;
}

export interface PartiallyMatchedSkill {
  name: string;
  category: string;
  matchType: string;
  notes: string;
}

export interface MissingSkill {
  name: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium';
  importance: string;
}

export interface ResumeImprovementSuggestion {
  id: string;
  section: string;
  title: string;
  description: string;
}

export interface SkillDevelopmentSuggestion {
  id: string;
  skill: string;
  timeEstimate: string;
  action: string;
}

export interface ResumeAnalysisResult {
  isPrototypeData: boolean;
  analyzedAt: string;
  resumeMeta: {
    fileName: string;
    fileSizeKb: number;
    extractedWordCount: number;
  };
  jobMeta: {
    characterCount: number;
    estimatedRequirementsCount: number;
  };
  overallMatch: {
    score: number;
    category: string;
    summary: string;
    confidenceScore: string;
    aiScore?: number;
    ruleBasedScore?: number;
  };
  readinessAssessment: {
    status: string;
    statusLevel: 'high' | 'moderate' | 'early';
    keyStrength: string;
    primaryRisk: string;
    recommendedTimeline: string;
  };
  skillsBreakdown: {
    matched: MatchedSkill[];
    partiallyMatched: PartiallyMatchedSkill[];
    missing: MissingSkill[];
  };
  gapSummary: {
    totalRequiredSkills: number;
    matchedCount: number;
    partialCount: number;
    missingCount: number;
    coveragePercentage: number;
  };
  actionableSuggestions: {
    resumeImprovements: ResumeImprovementSuggestion[];
    skillDevelopment: SkillDevelopmentSuggestion[];
  };
  strengths?: string[];
  weaknesses?: string[];
  roadmap?: any;
  skillGaps?: any[];
  careerRole?: any;
  roleReadiness?: any;
}

export interface AnalyzeResumeParams {
  file: File;
  jobDescription: string;
}

export const analyzeResumeApi = async ({
  file,
  jobDescription,
}: AnalyzeResumeParams): Promise<ResumeAnalysisResult> => {
  // Check if explicit mock mode was requested in frontend environment
  const forceMock = (import.meta as any).env?.VITE_USE_MOCK_ANALYSIS === 'true';

  if (forceMock) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return createDemonstrationBenchmark(file, jobDescription);
  }

  // Determine backend URL (Vite dev server proxies /api to http://localhost:5000)
  const backendBase = ((import.meta as any).env?.VITE_BACKEND_API_URL || '').replace(/\/$/, '');
  const endpoint = `${backendBase}/api/agent/analyze`;

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);
  formData.append('fullName', 'Candidate');
  formData.append('email', 'candidate@careeragent.ai');

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (networkErr: any) {
    throw new Error(
      `Unable to connect to the backend server at ${endpoint}. ` +
      `Please ensure the AF-03 API server is running on port 5000 (npm run dev:api).`
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.detail || errorData.message || `Analysis request failed with status ${response.status}`
    );
  }

  const rawData = await response.json();

  // The backend returns a unified payload with analysisResult
  const result: ResumeAnalysisResult = rawData.analysisResult || rawData;

  // Preserve backend artifacts if present
  if (rawData.roadmap) result.roadmap = rawData.roadmap;
  if (rawData.skillGaps) result.skillGaps = rawData.skillGaps;
  if (rawData.careerRole) result.careerRole = rawData.careerRole;
  if (rawData.roleReadiness) result.roleReadiness = rawData.roleReadiness;

  // Ensure isPrototypeData is explicitly false for real live responses
  if (result.isPrototypeData === undefined) {
    result.isPrototypeData = false;
  }

  return result;
};

/**
 * Creates an explicitly labelled demonstration benchmark when VITE_USE_MOCK_ANALYSIS=true
 */
function createDemonstrationBenchmark(file: File, jobDescription: string): ResumeAnalysisResult {
  return {
    isPrototypeData: true,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    resumeMeta: {
      fileName: file.name,
      fileSizeKb: Math.round(file.size / 1024),
      extractedWordCount: 420,
    },
    jobMeta: {
      characterCount: jobDescription.length,
      estimatedRequirementsCount: 12,
    },
    overallMatch: {
      score: 78,
      category: 'Strong Candidate Potential',
      summary: 'Your profile exhibits substantial alignment with the core responsibilities, particularly in full-stack web engineering and system foundations. Closing critical gaps in container orchestration and automated testing will elevate you to top-tier readiness.',
      confidenceScore: 'High',
    },
    readinessAssessment: {
      status: 'Interview Ready with Prerequisites',
      statusLevel: 'high',
      keyStrength: 'Core programming fundamentals, API design, and modern component architecture directly mirror the target position.',
      primaryRisk: 'Absence of documented production Kubernetes deployments and automated CI/CD pipeline authoring on the resume.',
      recommendedTimeline: '2 to 3 weeks of targeted resume optimization and project portfolio expansion.',
    },
    skillsBreakdown: {
      matched: [
        { name: 'JavaScript (ES6+)', category: 'Frontend', matchType: 'Exact Match', context: 'Found in Work Experience & Technical Skills' },
        { name: 'React.js', category: 'Frontend', matchType: 'Exact Match', context: 'Demonstrated across 3 production projects' },
        { name: 'Node.js & Express', category: 'Backend', matchType: 'Exact Match', context: 'Referenced in RESTful service architecture' },
        { name: 'RESTful APIs', category: 'Backend', matchType: 'Exact Match', context: 'API contract design & third-party integration' },
        { name: 'Git & Version Control', category: 'Tools', matchType: 'Exact Match', context: 'Branch management and team workflows' },
        { name: 'SQL & Relational DBs', category: 'Data', matchType: 'Strong Match', context: 'PostgreSQL database modeling in recent roles' },
      ],
      partiallyMatched: [
        {
          name: 'Docker & Containerization',
          category: 'DevOps',
          matchType: 'Partial Match',
          notes: 'Basic container builds mentioned, but the job seeks multi-stage optimization and registry publishing.',
        },
        {
          name: 'TypeScript',
          category: 'Frontend',
          matchType: 'Partial Match',
          notes: 'Listed under learning/familiar skills; position expects strict typing across commercial applications.',
        },
      ],
      missing: [
        {
          name: 'Kubernetes & Cluster Management',
          category: 'DevOps',
          priority: 'Critical',
          importance: 'Required for microservices deployment and pod scaling referenced in JD.',
        },
        {
          name: 'CI/CD Pipeline Automation (GitHub Actions / GitLab)',
          category: 'DevOps',
          priority: 'Critical',
          importance: 'Stated as mandatory requirement for automated test runners and release cycles.',
        },
      ],
    },
    gapSummary: {
      totalRequiredSkills: 10,
      matchedCount: 6,
      partialCount: 2,
      missingCount: 2,
      coveragePercentage: 70,
    },
    actionableSuggestions: {
      resumeImprovements: [
        {
          id: 'r1',
          section: 'Work Experience',
          title: 'Quantify Impact with Performance & Business Metrics',
          description: 'Transform passive bullet points into quantifiable accomplishments (e.g., "Reduced API latency by 32% by implementing Redis caching" instead of "Worked with Redis").',
        },
      ],
      skillDevelopment: [
        {
          id: 's1',
          skill: 'Kubernetes & Helm',
          timeEstimate: '15 hours',
          action: 'Deploy a multi-service Node.js + Redis application on a local Minikube cluster and write Helm charts.',
        },
      ],
    },
  };
}
