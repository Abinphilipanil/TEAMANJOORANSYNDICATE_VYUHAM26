import { CareerRole, SkillEvidence, SkillGap, SkillGapStatus, SkillImportance } from '@af03/contracts';
import { SkillNormalizer } from './normalizer';

export class SkillGapAnalyzer {
  public analyzeGaps(targetRole: CareerRole, userEvidences: SkillEvidence[]): SkillGap[] {
    const gaps: SkillGap[] = [];

    // Map evidence by canonical skill name
    const evidenceLookup = new Map<string, SkillEvidence>();
    for (const ev of userEvidences) {
      const norm = SkillNormalizer.normalize(ev.skillName).canonicalName.toLowerCase();
      evidenceLookup.set(norm, ev);
    }

    for (const req of targetRole.requiredTechnicalSkills) {
      const normReq = SkillNormalizer.normalize(req.name).canonicalName.toLowerCase();
      const matchedEvidence = evidenceLookup.get(normReq);

      let status: SkillGapStatus = 'missing';
      let currentProficiency: SkillGap['currentProficiency'] = undefined;
      let reasoning = '';
      let estimatedHours = 30;

      if (matchedEvidence) {
        if (matchedEvidence.confidenceScore >= 0.85) {
          status = 'already_possessed';
          currentProficiency = req.minimumProficiency;
          reasoning = `Strong verified evidence found via ${matchedEvidence.sourceType}: "${matchedEvidence.snippetOrEvidenceText}"`;
          estimatedHours = 0;
        } else if (matchedEvidence.confidenceScore >= 0.6) {
          status = 'partially_developed';
          currentProficiency = 'beginner';
          reasoning = `Preliminary exposure found via ${matchedEvidence.sourceType}. Needs practical mastery of advanced paradigms.`;
          estimatedHours = 15;
        } else {
          status = 'needs_verification';
          reasoning = `Mentioned in ${matchedEvidence.sourceType} without practical project artifact proof.`;
          estimatedHours = 10;
        }
      } else {
        // Check if user has related skills in same category
        const hasRelatedCategory = Array.from(evidenceLookup.values()).some(e => {
          const normE = SkillNormalizer.normalize(e.skillName);
          return normE.category === req.category;
        });

        if (hasRelatedCategory) {
          status = 'partially_developed';
          currentProficiency = 'beginner';
          reasoning = `Transferable domain foundation observed in ${req.category}. Requires dedicated focus on ${req.name}.`;
          estimatedHours = 20;
        } else {
          status = 'missing';
          reasoning = `Essential core requirement for ${targetRole.title}. No prior evidence detected in submitted profile.`;
          estimatedHours = req.importance === 'critical' ? 35 : 20;
        }
      }

      gaps.push({
        skillName: req.name,
        category: req.category,
        importance: req.importance,
        status,
        currentProficiency,
        targetProficiency: req.minimumProficiency,
        evidenceFound: matchedEvidence ? matchedEvidence.snippetOrEvidenceText : undefined,
        reasoning,
        estimatedHoursToMaster: estimatedHours,
      });
    }

    return gaps;
  }
}

export const skillGapAnalyzer = new SkillGapAnalyzer();

