import { RoadmapPhase, RoadmapStep, SkillGapItem } from '../data/sampleData';
import { ResumeAnalysisResult } from '../services/resumeAnalysisService';
import { Roadmap } from '@af03/contracts';

export interface DynamicStrategyMeta {
  immediatePriority: string;
  description: string;
  recommendedVelocity: string;
  verificationModel: string;
  totalHours: string;
  duration: string;
  weeklyCommitment: string;
  completedUnits: string;
  completionPercent: number;
  targetDate: string;
}

export interface DynamicRoadmapResult {
  phases: RoadmapPhase[];
  strategy: DynamicStrategyMeta;
  isAiGenerated: boolean;
}

/**
 * Parses time estimates like "15 hours", "20 hrs", "2 weeks", "30 mins" into numeric hours.
 */
export function parseEstimatedHours(timeStr?: string, defaultHours = 20): number {
  if (!timeStr) return defaultHours;
  const hourMatch = timeStr.match(/(\d+)\s*(?:hours?|hrs?)/i);
  if (hourMatch) return parseInt(hourMatch[1], 10);

  const weekMatch = timeStr.match(/(\d+)\s*(?:weeks?|wks?)/i);
  if (weekMatch) return parseInt(weekMatch[1], 10) * 10; // ~10 hours per week benchmark

  const numMatch = timeStr.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return defaultHours;
}

/**
 * Calculates a dynamic calendar target date (Month Year) from current time + weeks.
 */
export function calculateTargetDate(weeksFromNow: number): string {
  const target = new Date();
  target.setDate(target.getDate() + Math.max(4, weeksFromNow) * 7);
  return target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Converts live AI resume analysis results into sequenced RoadmapPhase[] and calculated study metrics.
 */
export function generateDynamicRoadmapFromAnalysis(
  analysis: ResumeAnalysisResult | null,
  targetRoleTitle = 'Cloud Solutions Architect',
  backendRoadmap?: Roadmap | null
): DynamicRoadmapResult {
  if (!analysis) {
    // If no AI analysis exists, return null state flag to allow fallback
    return {
      phases: [],
      strategy: {
        immediatePriority: 'Curriculum Foundations',
        description: `Standard baseline curriculum aligned to ${targetRoleTitle}.`,
        recommendedVelocity: '2 Modules per Month',
        verificationModel: 'Sandboxed Project Proofs',
        totalHours: '137 Hours',
        duration: '16 Weeks',
        weeklyCommitment: '8 - 10 hrs/wk',
        completedUnits: '0 of 10 Units',
        completionPercent: 0,
        targetDate: calculateTargetDate(16),
      },
      isAiGenerated: false,
    };
  }

  const missingSkills = analysis.skillsBreakdown?.missing || [];
  const partialSkills = analysis.skillsBreakdown?.partiallyMatched || [];
  const matchedSkills = analysis.skillsBreakdown?.matched || [];
  const suggestions = analysis.actionableSuggestions?.skillDevelopment || [];

  // Helper to retrieve AI estimated study hours for a specific skill
  const getSkillTimeEstimate = (skillName: string, priority: string): number => {
    const match = suggestions.find(
      (s) =>
        s.skill.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(s.skill.toLowerCase())
    );
    if (match?.timeEstimate) {
      return parseEstimatedHours(match.timeEstimate);
    }
    const p = priority.toLowerCase();
    if (p === 'critical') return 35;
    if (p === 'high') return 25;
    return 16;
  };

  const phases: RoadmapPhase[] = [];

  // ==========================================
  // PHASE 1: Foundational Competencies & Prerequisites
  // Actionable bridging modules (Starts active at 0% without premature completion)
  // ==========================================
  const phase1Steps: RoadmapStep[] = [];
  let phase1Hours = 0;

  if (partialSkills.length > 0) {
    // Bridge partially developed skills identified in the evaluation
    partialSkills.forEach((p, idx) => {
      const est = getSkillTimeEstimate(p.name, 'medium');
      phase1Hours += est;
      phase1Steps.push({
        id: `p1-p-${idx}`,
        title: `${p.name} Bridge: Production Standards & Architecture`,
        status: idx === 0 ? 'in-progress' : 'upcoming',
        duration: `${est} hrs`,
      });
    });
  } else {
    // Foundational prerequisites for target role
    const foundationalSkill = missingSkills[0]?.name || targetRoleTitle;
    const est1 = 15;
    const est2 = 18;
    phase1Hours += est1 + est2;
    phase1Steps.push(
      {
        id: 'p1-setup-1',
        title: `${foundationalSkill} Core Toolchain & System Configuration`,
        status: 'in-progress',
        duration: `${est1} hrs`,
      },
      {
        id: 'p1-setup-2',
        title: `${targetRoleTitle} Architecture Conventions & Baseline Sandbox`,
        status: 'upcoming',
        duration: `${est2} hrs`,
      }
    );
  }

  const phase1Weeks = Math.max(2, Math.ceil(phase1Hours / 10));
  const phase1CompletedCount = phase1Steps.filter((s) => s.status === 'completed').length;
  const phase1CompletionPct = Math.round((phase1CompletedCount / phase1Steps.length) * 100);

  phases.push({
    phase: 'Phase 1',
    title: 'Foundational Competencies & Core Prerequisites',
    duration: `${phase1Weeks} Weeks (est. ${phase1Hours} hrs)`,
    status: 'In Progress',
    completionPercentage: phase1CompletionPct,
    summary:
      partialSkills.length > 0
        ? `Consolidate core prerequisites and bridge verified partial experience in ${partialSkills.map((p) => p.name).slice(0, 3).join(', ')}.`
        : `Establish core development toolchains and architectural conventions required for ${targetRoleTitle}.`,
    steps: phase1Steps,
  });

  // ==========================================
  // PHASE 2: Critical Competency Remediation (Urgent Missing Skills)
  // ==========================================
  const criticalMissing = missingSkills.filter((m) => m.priority.toLowerCase() === 'critical');
  const targetPhase2Skills = criticalMissing.length > 0 ? criticalMissing : missingSkills.slice(0, 2);

  const phase2Steps: RoadmapStep[] = [];
  let phase2Hours = 0;

  targetPhase2Skills.forEach((skill, idx) => {
    const totalSkillHours = getSkillTimeEstimate(skill.name, 'critical');
    const h1 = Math.max(8, Math.round(totalSkillHours * 0.45));
    const h2 = Math.max(10, Math.round(totalSkillHours * 0.55));
    phase2Hours += h1 + h2;

    const matchingSug = suggestions.find(
      (s) =>
        s.skill.toLowerCase().includes(skill.name.toLowerCase()) ||
        skill.name.toLowerCase().includes(s.skill.toLowerCase())
    );

    phase2Steps.push({
      id: `p2-crit-${idx}-1`,
      title: `${skill.name} Fundamentals & System Configuration`,
      status: 'upcoming',
      duration: `${h1} hrs`,
    });

    phase2Steps.push({
      id: `p2-crit-${idx}-2`,
      title: matchingSug?.action
        ? `Hands-on Project: ${matchingSug.action.slice(0, 70)}...`
        : `Enterprise Implementation: ${skill.name} Production Pipeline`,
      status: 'upcoming',
      duration: `${h2} hrs`,
    });
  });

  if (phase2Steps.length === 0) {
    phase2Steps.push({
      id: 'p2-fallback',
      title: 'Advanced System Architecture & Distributed Services',
      status: 'upcoming',
      duration: '28 hrs',
    });
    phase2Hours += 28;
  }

  const phase2Weeks = Math.max(3, Math.ceil(phase2Hours / 10));
  const phase2CompletedCount = phase2Steps.filter((s) => s.status === 'completed').length;
  const phase2CompletionPct = Math.round((phase2CompletedCount / phase2Steps.length) * 100);

  phases.push({
    phase: 'Phase 2',
    title: 'Critical Competency Remediation & Core Systems',
    duration: `${phase2Weeks} Weeks (est. ${phase2Hours} hrs)`,
    status: 'Upcoming',
    completionPercentage: phase2CompletionPct,
    summary: `Targeted remediation of highest-urgency gaps: ${targetPhase2Skills.map((s) => s.name).join(', ')}. Calibrated to eliminate primary hiring risk identified in your evaluation.`,
    steps: phase2Steps,
  });

  // ==========================================
  // PHASE 3: Advanced Specialization & Cloud Architecture
  // ==========================================
  const remainingMissing = missingSkills.filter((m) => m.priority.toLowerCase() !== 'critical');
  const targetPhase3Skills = remainingMissing.length > 0 ? remainingMissing : missingSkills.slice(2, 4);

  const phase3Steps: RoadmapStep[] = [];
  let phase3Hours = 0;

  targetPhase3Skills.forEach((skill, idx) => {
    const totalSkillHours = getSkillTimeEstimate(skill.name, skill.priority);
    phase3Hours += totalSkillHours;

    phase3Steps.push({
      id: `p3-adv-${idx}`,
      title: `${skill.name} Integration & Production Architecture`,
      status: 'upcoming',
      duration: `${totalSkillHours} hrs`,
    });
  });

  if (phase3Steps.length === 0) {
    phase3Steps.push(
      {
        id: 'p3-std-1',
        title: 'Distributed State Management & Caching Strategies',
        status: 'upcoming',
        duration: '18 hrs',
      },
      {
        id: 'p3-std-2',
        title: 'CI/CD Pipeline Engineering & Automated Deployment',
        status: 'upcoming',
        duration: '20 hrs',
      }
    );
    phase3Hours += 38;
  }

  const phase3Weeks = Math.max(3, Math.ceil(phase3Hours / 10));

  phases.push({
    phase: 'Phase 3',
    title: 'Advanced Specialization & Cloud Architecture',
    duration: `${phase3Weeks} Weeks (est. ${phase3Hours} hrs)`,
    status: 'Upcoming',
    completionPercentage: 0,
    summary:
      targetPhase3Skills.length > 0
        ? `Secondary competency acceleration targeting ${targetPhase3Skills.map((s) => s.name).join(', ')} with automated validation and resilience benchmarks.`
        : 'Enterprise system scaling, resilient infrastructure, and automated delivery pipelines.',
    steps: phase3Steps,
  });

  // ==========================================
  // PHASE 4: Capstone Portfolio Sandbox & Role Readiness
  // ==========================================
  const phase4Steps: RoadmapStep[] = [
    {
      id: 'p4-cap-1',
      title: `Full-Stack ${targetRoleTitle} Sandbox Proof Deployment`,
      status: 'upcoming',
      duration: '16 hrs',
    },
    {
      id: 'p4-cap-2',
      title: 'Telemetry, Load Testing & Security Hardening Audit',
      status: 'upcoming',
      duration: '12 hrs',
    },
    {
      id: 'p4-cap-3',
      title: 'Technical Portfolio Defense & System Architecture Review',
      status: 'upcoming',
      duration: '10 hrs',
    },
  ];
  const phase4Hours = 38;
  const phase4Weeks = 3;

  phases.push({
    phase: 'Phase 4',
    title: 'Capstone Sandbox & Production Verification',
    duration: `${phase4Weeks} Weeks (est. ${phase4Hours} hrs)`,
    status: 'Upcoming',
    completionPercentage: 0,
    summary: `Synthesize all closed competency gaps into an end-to-end verified portfolio artifact, ready for hiring manager review.`,
    steps: phase4Steps,
  });

  // ==========================================
  // CALCULATE OVERALL CURRICULUM METRICS
  // ==========================================
  let totalHoursNum = 0;
  let totalStepsCount = 0;
  let completedStepsCount = 0;

  phases.forEach((p) => {
    p.steps.forEach((s) => {
      totalStepsCount += 1;
      if (s.status === 'completed') completedStepsCount += 1;
      const hMatch = s.duration.match(/(\d+)\s*hr/);
      if (hMatch) totalHoursNum += parseInt(hMatch[1], 10);
    });
  });

  const totalWeeksNum = phases.reduce((acc, p) => {
    const wMatch = p.duration.match(/(\d+)\s*Week/i);
    return acc + (wMatch ? parseInt(wMatch[1], 10) : 3);
  }, 0);

  const completionPercent =
    totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  const weeklyCommitmentHours =
    totalWeeksNum > 0 ? Math.round(totalHoursNum / totalWeeksNum) : 10;

  // Immediate priority derived directly from top missing skill
  const immediatePriorityName =
    criticalMissing.length > 0
      ? `${criticalMissing[0].name} (Phase 2)`
      : missingSkills.length > 0
      ? `${missingSkills[0].name} (Phase 2)`
      : partialSkills.length > 0
      ? `${partialSkills[0].name} (Phase 1)`
      : 'Core Architecture Alignment (Phase 2)';

  const primaryRisk =
    analysis.readinessAssessment?.primaryRisk ||
    `Closing critical competencies required for ${targetRoleTitle}.`;

  const strategyDescription = `Focus is strategically weighted toward closing verified gaps in ${
    targetPhase2Skills.map((s) => s.name).join(' and ') || 'critical systems'
  }. Curriculum activities are sequenced to remediate your identified primary risk: "${primaryRisk}"`;

  return {
    phases,
    strategy: {
      immediatePriority: immediatePriorityName,
      description: strategyDescription,
      recommendedVelocity: `${Math.max(2, Math.round(weeklyCommitmentHours / 4))} Modules per Month`,
      verificationModel: 'Sandboxed Project Proofs & Code Artifacts',
      totalHours: `${totalHoursNum} Hours`,
      duration: `${totalWeeksNum} Weeks`,
      weeklyCommitment: `${weeklyCommitmentHours} - ${weeklyCommitmentHours + 2} hrs/wk`,
      completedUnits: `${completedStepsCount} of ${totalStepsCount} Units`,
      completionPercent,
      targetDate: calculateTargetDate(totalWeeksNum),
    },
    isAiGenerated: true,
  };
}

/**
 * Converts live AI analysis results into dynamic SkillGapItem[] and CurrentSkillItem[]
 * for the Skill Profiling & Gap Analysis module.
 */
export function generateDynamicSkillGapsFromAnalysis(
  analysis: ResumeAnalysisResult | null,
  targetRoleTitle = 'Cloud Solutions Architect'
): {
  currentSkills: Array<{ name: string; level: string; category: string; score: number }>;
  skillGaps: SkillGapItem[];
  isAiGenerated: boolean;
} {
  if (!analysis) {
    return {
      currentSkills: [],
      skillGaps: [],
      isAiGenerated: false,
    };
  }

  const matchedSkills = analysis.skillsBreakdown?.matched || [];
  const partialSkills = analysis.skillsBreakdown?.partiallyMatched || [];
  const missingSkills = analysis.skillsBreakdown?.missing || [];
  const suggestions = analysis.actionableSuggestions?.skillDevelopment || [];

  // 1. Current Verified Skills
  const currentSkills: Array<{ name: string; level: string; category: string; score: number }> = [];

  matchedSkills.forEach((m) => {
    currentSkills.push({
      name: m.name,
      level: 'Advanced',
      category: m.category || 'Core & Backend',
      score: 85,
    });
  });

  partialSkills.forEach((p) => {
    currentSkills.push({
      name: p.name,
      level: 'Intermediate',
      category: p.category || 'DevOps & Tools',
      score: 62,
    });
  });

  // 2. Prioritized Skill Gaps
  const skillGaps: SkillGapItem[] = [];

  missingSkills.forEach((m, idx) => {
    const matchingSug = suggestions.find(
      (s) =>
        s.skill.toLowerCase().includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().includes(s.skill.toLowerCase())
    );

    const estHours = matchingSug?.timeEstimate
      ? matchingSug.timeEstimate
      : m.priority.toLowerCase() === 'critical'
      ? '35 hrs'
      : m.priority.toLowerCase() === 'high'
      ? '25 hrs'
      : '16 hrs';

    const action = matchingSug?.action || `Focus on practical implementation and enterprise conventions for ${m.name}.`;
    const importance = m.importance || `Required core competency identified for ${targetRoleTitle}.`;

    skillGaps.push({
      id: `gap-missing-${idx}`,
      skill: m.name,
      category: m.category || 'Specialized',
      currentLevel: 'None Detected',
      targetLevel: 'Proficient',
      currentScore: 15,
      targetScore: 85,
      priority: m.priority as 'Critical' | 'High' | 'Medium',
      estimatedHours: estHours.includes('hr') || estHours.includes('hour') ? estHours : `${estHours} hrs`,
      recommendedAction: action,
      importanceReason: importance,
    });
  });

  partialSkills.forEach((p, idx) => {
    const matchingSug = suggestions.find(
      (s) =>
        s.skill.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(s.skill.toLowerCase())
    );

    const estHours = matchingSug?.timeEstimate ? matchingSug.timeEstimate : '14 hrs';
    const action = matchingSug?.action || `Bridge foundational exposure in ${p.name} to enterprise standard.`;
    const importance = p.notes || `Found partial background in resume; position requires professional depth.`;

    skillGaps.push({
      id: `gap-partial-${idx}`,
      skill: p.name,
      category: p.category || 'Architecture',
      currentLevel: 'Intermediate',
      targetLevel: 'Advanced',
      currentScore: 60,
      targetScore: 88,
      priority: 'Medium',
      estimatedHours: estHours.includes('hr') || estHours.includes('hour') ? estHours : `${estHours} hrs`,
      recommendedAction: action,
      importanceReason: importance,
    });
  });

  return {
    currentSkills,
    skillGaps,
    isAiGenerated: true,
  };
}

