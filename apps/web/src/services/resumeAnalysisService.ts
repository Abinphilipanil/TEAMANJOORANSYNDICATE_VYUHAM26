/**
 * Resume Analysis Service for CareerAgent AI (Hackathon Challenge AF-03)
 * 
 * Supports both real backend evaluation and client-side prototype demonstration.
 * In production / full backend mode, this posts to `/api/agent/analyze` or a custom
 * backend endpoint (PyMuPDF + LLM semantic matcher).
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
}

export interface AnalyzeResumeParams {
  file: File;
  jobDescription: string;
}

export const analyzeResumeApi = async ({
  file,
  jobDescription,
}: AnalyzeResumeParams): Promise<ResumeAnalysisResult> => {
  // Check if a real backend URL is configured via environment variable
  const backendUrl = (import.meta as any).env?.VITE_BACKEND_API_URL;

  if (backendUrl) {
    const formData = new FormData();
    formData.append('resume_pdf', file);
    formData.append('job_description', jobDescription);

    const response = await fetch(`${backendUrl}/api/v1/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Analysis failed with status ${response.status}`);
    }

    return await response.json();
  }

  // Phase 1 Frontend Prototype Simulation
  // Provides realistic feedback with clear demonstration indicators
  await new Promise((resolve) => setTimeout(resolve, 1400));

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
      category: "Strong Candidate Potential",
      summary: "Your profile exhibits substantial alignment with the core responsibilities, particularly in full-stack web engineering and system foundations. Closing critical gaps in container orchestration and automated testing will elevate you to top-tier readiness.",
      confidenceScore: "High",
    },
    readinessAssessment: {
      status: "Interview Ready with Prerequisites",
      statusLevel: "high",
      keyStrength: "Core programming fundamentals, API design, and modern component architecture directly mirror the target position.",
      primaryRisk: "Absence of documented production Kubernetes deployments and automated CI/CD pipeline authoring on the resume.",
      recommendedTimeline: "2 to 3 weeks of targeted resume optimization and project portfolio expansion.",
    },
    skillsBreakdown: {
      matched: [
        { name: "JavaScript (ES6+)", category: "Frontend", matchType: "Exact Match", context: "Found in Work Experience & Technical Skills" },
        { name: "React.js", category: "Frontend", matchType: "Exact Match", context: "Demonstrated across 3 production projects" },
        { name: "Node.js & Express", category: "Backend", matchType: "Exact Match", context: "Referenced in RESTful service architecture" },
        { name: "RESTful APIs", category: "Backend", matchType: "Exact Match", context: "API contract design & third-party integration" },
        { name: "Git & Version Control", category: "Tools", matchType: "Exact Match", context: "Branch management and team workflows" },
        { name: "SQL & Relational DBs", category: "Data", matchType: "Strong Match", context: "PostgreSQL database modeling in recent roles" },
      ],
      partiallyMatched: [
        {
          name: "Docker & Containerization",
          category: "DevOps",
          matchType: "Partial Match",
          notes: "Basic container builds mentioned, but the job seeks multi-stage optimization and registry publishing.",
        },
        {
          name: "TypeScript",
          category: "Frontend",
          matchType: "Partial Match",
          notes: "Listed under learning/familiar skills; position expects strict typing across commercial applications.",
        },
        {
          name: "Cloud Hosting (AWS)",
          category: "Cloud",
          matchType: "Partial Match",
          notes: "EC2 and S3 experience found; role specifically demands VPC configuration and serverless deployments.",
        },
      ],
      missing: [
        {
          name: "Kubernetes & Cluster Management",
          category: "DevOps",
          priority: "Critical",
          importance: "Required for microservices deployment and pod scaling referenced in JD.",
        },
        {
          name: "CI/CD Pipeline Automation (GitHub Actions / GitLab)",
          category: "DevOps",
          priority: "Critical",
          importance: "Stated as mandatory requirement for automated test runners and release cycles.",
        },
        {
          name: "Automated Unit & Integration Testing (Jest/Cypress)",
          category: "Testing & QA",
          priority: "High",
          importance: "Job description emphasizes high test coverage and test-driven development.",
        },
      ],
    },
    gapSummary: {
      totalRequiredSkills: 12,
      matchedCount: 6,
      partialCount: 3,
      missingCount: 3,
      coveragePercentage: 75,
    },
    actionableSuggestions: {
      resumeImprovements: [
        {
          id: "r1",
          section: "Work Experience",
          title: "Quantify Impact with Performance & Business Metrics",
          description: "Transform passive bullet points into quantifiable accomplishments (e.g., 'Reduced API latency by 32% by implementing Redis caching' instead of 'Worked with Redis').",
        },
        {
          id: "r2",
          section: "Skills & Keywords",
          title: "Promote Cloud & Architecture Keywords into Summary",
          description: "Ensure exact terminology matching the job description (e.g., 'Microservices Architecture', 'REST API contracts') appears within your professional summary.",
        },
        {
          id: "r3",
          section: "Projects",
          title: "Highlight Containerized Full-Stack Workflows",
          description: "Add a 2-line project bullet explicitly detailing Docker Compose setups and production deployment scripts.",
        },
      ],
      skillDevelopment: [
        {
          id: "s1",
          skill: "Kubernetes & Helm",
          timeEstimate: "15 hours",
          action: "Deploy a multi-service Node.js + Redis application on a local Minikube cluster and write Helm charts.",
        },
        {
          id: "s2",
          skill: "GitHub Actions CI/CD",
          timeEstimate: "8 hours",
          action: "Build an automated workflow that runs linter checks, executes unit tests, builds a Docker image, and verifies builds on every PR.",
        },
        {
          id: "s3",
          skill: "Automated Testing (Jest / Vitest)",
          timeEstimate: "10 hours",
          action: "Add unit tests covering at least 70% of business logic handlers in your personal portfolio project.",
        },
      ],
    },
  };
};
