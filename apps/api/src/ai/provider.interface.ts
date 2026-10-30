/**
 * Provider-Independent AI Interface for Resume and Skill-Fit Analysis
 * Allows seamless switching between Groq, Claude (Anthropic), and other LLM backends.
 */

export interface LLMAnalysisInput {
  resumeText: string;
  jobDescription: string;
  targetRoleTitle?: string;
  resumeFileName?: string;
}

export interface LLMMatchedSkill {
  name: string;
  category: string;
  matchType: string;
  context: string;
}

export interface LLMPartiallyMatchedSkill {
  name: string;
  category: string;
  matchType: string;
  notes: string;
}

export interface LLMMissingSkill {
  name: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium';
  importance: string;
}

export interface LLMResumeImprovement {
  id: string;
  section: string;
  title: string;
  description: string;
}

export interface LLMSkillDevelopment {
  id: string;
  skill: string;
  timeEstimate: string;
  action: string;
}

export interface LLMAnalysisOutput {
  overallScore: number; // 0 to 100
  matchCategory: string; // e.g. "Strong Match", "Potential Match", "Early Development"
  summary: string;
  confidenceScore: 'High' | 'Medium' | 'Low';
  readinessStatus: string;
  statusLevel: 'high' | 'moderate' | 'early';
  keyStrength: string;
  primaryRisk: string;
  recommendedTimeline: string;
  matchedSkills: LLMMatchedSkill[];
  partiallyMatchedSkills: LLMPartiallyMatchedSkill[];
  missingSkills: LLMMissingSkill[];
  strengths: string[];
  weaknesses: string[];
  resumeImprovements: LLMResumeImprovement[];
  skillDevelopment: LLMSkillDevelopment[];
}

export interface ResumeAnalysisProvider {
  readonly providerName: string;
  analyzeResume(input: LLMAnalysisInput): Promise<LLMAnalysisOutput>;
}

