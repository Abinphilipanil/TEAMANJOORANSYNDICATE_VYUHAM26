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
    .or(
      z
        .string()
        .refine((v) => !isNaN(Number(v)) && v.trim() !== '', { message: 'overallScore must be a valid numeric value' })
        .transform((v) => Math.min(100, Math.max(0, parseInt(v, 10))))
    ),
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

/**
 * Pre-normalizes raw JSON from Claude or Groq before schema validation.
 * Supports string arrays, alternative field naming (snake_case, nested skillsBreakdown, .skill instead of .name).
 */
export function preNormalizeLLMOutput(raw: any): any {
  if (!raw || typeof raw !== 'object') return {};

  const clone: any = { ...raw };

  // 1. Resolve raw matched skills from any known alias or structure
  const rawMatched =
    clone.matchedSkills ||
    clone.matched_skills ||
    clone.skillsBreakdown?.matched ||
    clone.preliminaryMatchedSkills ||
    clone.skills?.matched ||
    clone.skillsFound ||
    [];

  clone.matchedSkills = (Array.isArray(rawMatched) ? rawMatched : []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        name: item.trim(),
        category: 'Technical Stack',
        matchType: 'Exact Match',
        context: 'Identified in candidate work experience or skills section.',
      };
    }
    return {
      name: String(item.name || item.skill || item.title || `Skill ${idx + 1}`).trim(),
      category: String(item.category || 'Technical Stack').trim(),
      matchType: String(item.matchType || item.match_type || 'Exact Match').trim(),
      context: String(item.context || item.evidence || item.description || 'Demonstrated in resume credentials.').trim(),
    };
  });

  // 2. Resolve partially matched skills from any known alias or structure
  const rawPartial =
    clone.partiallyMatchedSkills ||
    clone.partially_matched_skills ||
    clone.partialSkills ||
    clone.skillsBreakdown?.partiallyMatched ||
    clone.preliminaryPartialSkills ||
    clone.skills?.partiallyMatched ||
    [];

  clone.partiallyMatchedSkills = (Array.isArray(rawPartial) ? rawPartial : []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        name: item.trim(),
        category: 'Technical Stack',
        matchType: 'Partial Match',
        notes: 'Found foundational background requiring production depth.',
      };
    }
    return {
      name: String(item.name || item.skill || item.title || `Skill ${idx + 1}`).trim(),
      category: String(item.category || 'Technical Stack').trim(),
      matchType: String(item.matchType || item.match_type || 'Partial Match').trim(),
      notes: String(item.notes || item.reason || item.description || 'Related foundational capability identified.').trim(),
    };
  });

  // 3. Resolve missing skills from any known alias or structure
  const rawMissing =
    clone.missingSkills ||
    clone.missing_skills ||
    clone.skillsBreakdown?.missing ||
    clone.preliminaryMissingSkills ||
    clone.skills?.missing ||
    clone.gaps ||
    [];

  clone.missingSkills = (Array.isArray(rawMissing) ? rawMissing : []).map((item: any, idx: number) => {
    const rawPriority = (item && typeof item === 'object' ? item.priority : 'High') || 'High';
    const priority = ['Critical', 'High', 'Medium'].includes(rawPriority) ? rawPriority : 'High';
    if (typeof item === 'string') {
      return {
        name: item.trim(),
        category: 'Target Requirement',
        priority: 'High',
        importance: 'Specifically requested by target job posting.',
      };
    }
    return {
      name: String(item.name || item.skill || item.title || `Missing Skill ${idx + 1}`).trim(),
      category: String(item.category || 'Target Requirement').trim(),
      priority,
      importance: String(item.importance || item.reason || item.description || 'Required by target job specification.').trim(),
    };
  });

  // 4. Resolve Resume Improvements
  const rawImprovements =
    clone.resumeImprovements ||
    clone.resume_improvements ||
    clone.actionableSuggestions?.resumeImprovements ||
    [];

  clone.resumeImprovements = (Array.isArray(rawImprovements) ? rawImprovements : []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        id: `r-${idx + 1}`,
        section: 'Work Experience',
        title: 'Optimize Resume Impact',
        description: item,
      };
    }
    return {
      id: String(item.id || `r-${idx + 1}`),
      section: String(item.section || 'Work Experience'),
      title: String(item.title || 'Impact & Metric Optimization'),
      description: String(item.description || item.action || 'Highlight measurable achievements and production outcomes.'),
    };
  });

  // 5. Resolve Skill Development
  const rawDevelopment =
    clone.skillDevelopment ||
    clone.skill_development ||
    clone.actionableSuggestions?.skillDevelopment ||
    [];

  clone.skillDevelopment = (Array.isArray(rawDevelopment) ? rawDevelopment : []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        id: `s-${idx + 1}`,
        skill: item,
        timeEstimate: '2-3 weeks',
        action: `Build a production-grade proof of concept demonstrating ${item}.`,
      };
    }
    return {
      id: String(item.id || `s-${idx + 1}`),
      skill: String(item.skill || item.name || 'Core Competency'),
      timeEstimate: String(item.timeEstimate || item.time_estimate || '2-3 weeks'),
      action: String(item.action || item.description || 'Complete hands-on implementation and deploy to portfolio.'),
    };
  });

  // 6. Ensure summary, keyStrength, primaryRisk exist if missing
  if (clone.summary === undefined) {
    clone.summary = clone.overallMatch?.summary || 'Candidate displays solid potential with key skills aligned to the target role.';
  }
  if (clone.keyStrength === undefined) {
    clone.keyStrength = clone.readinessAssessment?.keyStrength || 'Strong baseline competencies identified in candidate profile.';
  }
  if (clone.primaryRisk === undefined) {
    clone.primaryRisk = clone.readinessAssessment?.primaryRisk || 'Production-level depth in secondary tools requires verification.';
  }
  if (clone.readinessStatus === undefined) {
    clone.readinessStatus = clone.readinessAssessment?.status || 'Interview Ready with Prerequisites';
  }
  if (clone.statusLevel === undefined) {
    clone.statusLevel = clone.readinessAssessment?.statusLevel || 'moderate';
  }

  // 7. Ensure overall score from overallMatch if provided
  if (clone.overallScore === undefined && clone.overallMatch?.score !== undefined) {
    clone.overallScore = clone.overallMatch.score;
  }

  return clone;
}

export function validateLLMAnalysisOutput(rawJson: unknown): LLMAnalysisOutput {
  const normalized = preNormalizeLLMOutput(rawJson);
  const result = LLMAnalysisOutputSchema.safeParse(normalized);
  if (!result.success) {
    const issues = (result.error as any).issues || (result.error as any).errors || [];
    const errorDetails = issues.length > 0
      ? issues.map((e: any) => `${e.path?.join('.') || 'field'}: ${e.message}`).join(', ')
      : result.error.message;
    throw new Error(`LLM output validation failed: ${errorDetails}`);
  }
  return result.data as LLMAnalysisOutput;
}
