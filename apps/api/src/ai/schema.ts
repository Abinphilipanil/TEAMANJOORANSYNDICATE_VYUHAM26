import { z } from 'zod';
import { LLMAnalysisOutput } from './provider.interface';

export const MatchedSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General'),
  matchType: z.string().default('Exact Match'),
  context: z.string().default('Demonstrated in resume'),
});

export const PartiallyMatchedSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General'),
  matchType: z.string().default('Partial Match'),
  notes: z.string().default('Related experience found'),
});

export const MissingSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General'),
  priority: z.enum(['Critical', 'High', 'Medium']).default('Medium'),
  importance: z.string().default('Required by job posting'),
});

export const ResumeImprovementSchema = z.object({
  id: z.string().default(() => `r-${Math.random().toString(36).substring(2, 7)}`),
  section: z.string().default('Work Experience'),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const SkillDevelopmentSchema = z.object({
  id: z.string().default(() => `s-${Math.random().toString(36).substring(2, 7)}`),
  skill: z.string().min(1),
  timeEstimate: z.string().default('1-2 weeks'),
  action: z.string().min(1),
});

export const LLMAnalysisOutputSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .or(z.string().transform((v) => Math.min(100, Math.max(0, parseInt(v, 10) || 0)))),
  matchCategory: z.string().default('Potential Match'),
  summary: z.string().min(1),
  confidenceScore: z.enum(['High', 'Medium', 'Low']).default('High'),
  readinessStatus: z.string().default('Candidate In Progress'),
  statusLevel: z.enum(['high', 'moderate', 'early']).default('moderate'),
  keyStrength: z.string().default('Solid technical fundamentals matching target role.'),
  primaryRisk: z.string().default('Key production tools require further practical proof.'),
  recommendedTimeline: z.string().default('2 to 4 weeks'),
  matchedSkills: z.array(MatchedSkillSchema).default([]),
  partiallyMatchedSkills: z.array(PartiallyMatchedSkillSchema).default([]),
  missingSkills: z.array(MissingSkillSchema).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  resumeImprovements: z.array(ResumeImprovementSchema).default([]),
  skillDevelopment: z.array(SkillDevelopmentSchema).default([]),
});

export function validateLLMAnalysisOutput(rawJson: unknown): LLMAnalysisOutput {
  const result = LLMAnalysisOutputSchema.safeParse(rawJson);
  if (!result.success) {
    const issues = (result.error as any).issues || (result.error as any).errors || [];
    const errorDetails = issues.length > 0
      ? issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ')
      : result.error.message;
    throw new Error(`LLM output validation failed: ${errorDetails}`);
  }
  return result.data as LLMAnalysisOutput;
}
