import { 
  Roadmap, 
  ProgressRecord, 
  UpdateProgressRequest, 
  UpdateProgressResponse,
  ProficiencyLevel
} from '@af03/contracts';
import { roadmapRepository } from '../repositories/roadmap.repo';
import { progressRepository } from '../repositories/progress.repo';
import { userRepository } from '../repositories/user.repo';

export class ProgressService {
  public updateItemProgress(payload: UpdateProgressRequest): UpdateProgressResponse {
    const roadmap = roadmapRepository.findById(payload.roadmapId);
    if (!roadmap) {
      throw new Error(`Roadmap with id ${payload.roadmapId} not found`);
    }

    let foundItemTitle = '';
    let foundSkillName = '';
    let foundWeekNumber = 1;
    let totalItems = 0;
    let completedItems = 0;

    // Search and update item across milestones
    for (const milestone of roadmap.weeklyMilestones) {
      let allMilestoneItemsDone = true;
      for (const item of milestone.items) {
        totalItems++;
        if (item.id === payload.itemId) {
          item.isCompleted = payload.isCompleted;
          item.completedAt = payload.isCompleted ? new Date().toISOString() : undefined;
          if (payload.proofUrl) {
            item.selfAssessmentProofUrl = payload.proofUrl;
          }
          foundItemTitle = item.title;
          foundSkillName = item.skillName;
          foundWeekNumber = milestone.weekNumber;
        }

        if (item.isCompleted) {
          completedItems++;
        } else {
          allMilestoneItemsDone = false;
        }
      }
      milestone.isCompleted = allMilestoneItemsDone && milestone.items.length > 0;
    }

    // Calculate updated progress
    const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    roadmap.overallProgressPercentage = progressPct;

    // Dynamic readiness impact
    // As tasks and evidence are completed, boost readiness score toward 100%
    const readinessDelta = payload.isCompleted ? 3 : -3;
    const newReadiness = Math.min(99, Math.max(roadmap.readinessAtCreation, roadmap.currentReadiness + readinessDelta));
    roadmap.currentReadiness = newReadiness;
    roadmap.updatedAt = new Date().toISOString();

    roadmapRepository.save(roadmap);

    // Update user's lastActiveAt timestamp to reset inactivity counter
    userRepository.updateLastActive(roadmap.userId);

    const record: ProgressRecord = {
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      roadmapId: roadmap.id,
      userId: roadmap.userId,
      itemId: payload.itemId,
      weekNumber: foundWeekNumber,
      skillName: foundSkillName || 'Skill Module',
      isCompleted: payload.isCompleted,
      completedAt: new Date().toISOString(),
      verifiedProficiency: payload.selfAssessedLevel || 'intermediate',
      practicalProofText: payload.proofNotes,
      practicalProofUrl: payload.proofUrl,
      impactOnReadinessScore: readinessDelta,
    };

    progressRepository.save(record);

    return {
      success: true,
      record,
      updatedReadinessScore: newReadiness,
      updatedOverallProgress: progressPct,
      roadmap,
    };
  }

  public getHistory(roadmapId: string): ProgressRecord[] {
    return progressRepository.findByRoadmapId(roadmapId);
  }
}

export const progressService = new ProgressService();

