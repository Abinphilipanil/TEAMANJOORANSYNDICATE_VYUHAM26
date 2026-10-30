import { CareerRole, RoleReadiness, SkillGap, SkillEvidence } from '@af03/contracts';

export class ReadinessService {
  /**
   * Computes an explainable, deterministic role-readiness score based on:
   * 1. Core critical skills coverage (45% weight)
   * 2. High & medium importance skills coverage (35% weight)
   * 3. Evidence quality & verification backing (20% weight)
   */
  public calculateReadiness(
    targetRole: CareerRole,
    gaps: SkillGap[],
    evidences: SkillEvidence[]
  ): RoleReadiness {
    const totalRequired = targetRole.requiredTechnicalSkills.length;
    let criticalSkillsTotal = 0;
    let criticalSkillsCovered = 0;
    let otherSkillsTotal = 0;
    let otherSkillsCovered = 0;

    let criticalGapsCount = 0;
    let partiallyCoveredCount = 0;
    let possessedCount = 0;
    const topStrengths: string[] = [];
    const priorityGaps: string[] = [];

    for (const gap of gaps) {
      const isCritical = gap.importance === 'critical';
      if (isCritical) {
        criticalSkillsTotal++;
      } else {
        otherSkillsTotal++;
      }

      if (gap.status === 'already_possessed') {
        possessedCount++;
        topStrengths.push(gap.skillName);
        if (isCritical) criticalSkillsCovered += 1.0;
        else otherSkillsCovered += 1.0;
      } else if (gap.status === 'partially_developed') {
        partiallyCoveredCount++;
        if (isCritical) {
          criticalSkillsCovered += 0.5;
          priorityGaps.push(`${gap.skillName} (Partially Developed)`);
        } else {
          otherSkillsCovered += 0.5;
        }
      } else if (gap.status === 'needs_verification') {
        if (isCritical) {
          criticalSkillsCovered += 0.3;
          priorityGaps.push(`${gap.skillName} (Needs Verification)`);
        } else {
          otherSkillsCovered += 0.3;
        }
      } else if (gap.status === 'missing') {
        if (isCritical) {
          criticalGapsCount++;
          priorityGaps.push(`${gap.skillName} (Missing Critical)`);
        }
      }
    }

    const criticalScore = criticalSkillsTotal > 0 ? (criticalSkillsCovered / criticalSkillsTotal) * 100 : 70;
    const otherScore = otherSkillsTotal > 0 ? (otherSkillsCovered / otherSkillsTotal) * 100 : 70;

    // Evidence quality based on source variety and confidence
    let evidenceQualityScore = 50;
    if (evidences.length > 0) {
      const avgConfidence = evidences.reduce((acc, curr) => acc + curr.confidenceScore, 0) / evidences.length;
      const sourceTypes = new Set(evidences.map((e) => e.sourceType)).size;
      const sourceBonus = Math.min(25, sourceTypes * 10);
      evidenceQualityScore = Math.min(100, Math.round(avgConfidence * 75 + sourceBonus));
    }

    // Weighted composite
    const overallScorePercentage = Math.min(
      98,
      Math.max(
        15,
        Math.round(criticalScore * 0.45 + otherScore * 0.35 + evidenceQualityScore * 0.2)
      )
    );

    let ratingBand: RoleReadiness['ratingBand'] = 'Novice';
    if (overallScorePercentage >= 80) {
      ratingBand = 'Job-Market Competitive';
    } else if (overallScorePercentage >= 65) {
      ratingBand = 'Career-Ready Foundation';
    } else if (overallScorePercentage >= 40) {
      ratingBand = 'Developing';
    }

    const summary = `You currently meet approximately ${overallScorePercentage}% of the benchmark requirements for ${targetRole.title}. You have demonstrated solid foundations in ${topStrengths.slice(0, 3).join(', ') || 'foundational areas'}, with key advancement opportunities focused on ${priorityGaps.slice(0, 3).join(', ') || 'advanced modules'}.`;

    return {
      overallScorePercentage,
      ratingBand,
      scoringBreakdown: {
        coreSkillsPossessedCount: possessedCount,
        coreSkillsRequiredTotal: totalRequired,
        criticalGapsCount,
        partiallyCoveredCount,
        evidenceQualityScore,
      },
      readinessSummary: summary,
      topStrengths: topStrengths.slice(0, 5),
      priorityGaps: priorityGaps.slice(0, 5),
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const readinessService = new ReadinessService();

