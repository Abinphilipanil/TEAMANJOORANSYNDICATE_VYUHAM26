import { 
  Roadmap, 
  RoadmapItem, 
  SkillGap, 
  CareerRole, 
  LearningPreferences, 
  LearningResource 
} from '@af03/contracts';
import { resourceCatalog } from '../integrations/resources/resourceCatalog';

export class RoadmapGenerator {
  public generate(
    userId: string,
    targetRole: CareerRole,
    gaps: SkillGap[],
    preferences: LearningPreferences,
    initialReadiness: number
  ): Roadmap {
    const roadmapId = `roadmap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const totalWeeks = Math.max(4, Math.min(24, preferences.targetWeeks || 12));
    const weeklyHours = preferences.hoursPerWeek || 10;

    // Filter gaps that need development: missing, partially_developed, needs_verification
    const actionableGaps = gaps
      .filter(g => g.status !== 'already_possessed')
      .sort((a, b) => {
        // Priority order: critical > high > medium > nice_to_have
        const rank = { critical: 4, high: 3, medium: 2, nice_to_have: 1 };
        return rank[b.importance] - rank[a.importance];
      });

    // Distribute skills across weekly milestones
    const milestones: Roadmap['weeklyMilestones'] = [];
    const weeksPerSkill = Math.max(1, Math.floor(totalWeeks / Math.max(1, actionableGaps.length)));

    let currentWeek = 1;
    let skillIndex = 0;

    while (currentWeek <= totalWeeks) {
      const gap = actionableGaps[skillIndex % actionableGaps.length];
      const resources: LearningResource[] = gap ? resourceCatalog.getResourcesForSkill(gap.skillName) : [];

      const phaseName = currentWeek <= totalWeeks / 3
        ? 'Foundation & Core Paradigms'
        : currentWeek <= (totalWeeks * 2) / 3
        ? 'Practical Implementation & Architecture'
        : 'Production Readiness & Portfolio Mastery';

      const skillTitle = gap ? gap.skillName : 'Advanced System Integration';
      const hours = Math.min(weeklyHours, gap ? gap.estimatedHoursToMaster : 10);

      const items: RoadmapItem[] = [
        {
          id: `item-w${currentWeek}-1`,
          weekNumber: currentWeek,
          skillName: skillTitle,
          title: `Master ${skillTitle} Fundamentals`,
          description: gap ? gap.reasoning : 'Deepen architectural mastery and enterprise conventions.',
          importance: gap ? gap.importance : 'high',
          estimatedHours: Math.round(hours * 0.4),
          learningObjectives: [
            `Understand core primitives and memory model of ${skillTitle}`,
            `Setup automated linting and typing environment for ${skillTitle}`,
            'Complete guided official documentation exercises'
          ],
          resources: resources.slice(0, 2),
          practicalAssignment: {
            title: `${skillTitle} Sandbox Proof`,
            deliverable: `Clean Git repository branch demonstrating clean implementation of ${skillTitle}`,
            testOrVerificationSteps: [
              'Verify unit test coverage',
              'Check edge-case handling',
              'Document setup steps in README'
            ],
          },
          isCompleted: false,
        },
        {
          id: `item-w${currentWeek}-2`,
          weekNumber: currentWeek,
          skillName: skillTitle,
          title: `Build Hands-on Project: ${skillTitle} Integration`,
          description: `Construct a functional real-world module applying ${skillTitle} to solve an authentic business problem.`,
          importance: gap ? gap.importance : 'high',
          estimatedHours: Math.round(hours * 0.6),
          learningObjectives: [
            `Integrate ${skillTitle} into a production-like workspace pipeline`,
            'Profile latency and resilience under stress conditions',
            'Publish verified artifact in local AF03 workspace'
          ],
          resources: resources.slice(2, 4),
          practicalAssignment: {
            title: `${skillTitle} Production Milestone Project`,
            deliverable: 'Working end-to-end module with automated validation',
            testOrVerificationSteps: [
              'Execute benchmark suite',
              'Submit repository link or local workspace proof file'
            ],
          },
          isCompleted: false,
        }
      ];

      milestones.push({
        weekNumber: currentWeek,
        phaseName,
        goal: `Attain proficiency in ${skillTitle} through theory, documentation, and a portfolio project.`,
        items,
        isCompleted: false,
      });

      currentWeek++;
      if (currentWeek % weeksPerSkill === 0) {
        skillIndex++;
      }
    }

    const summaryRationale = `Personalized roadmap generated for ${targetRole.title}. Calibrated for a ${preferences.learningPace} learning pace (${weeklyHours} hours/week over ${totalWeeks} weeks). Targets ${actionableGaps.length} identified skill gaps, prioritizing critical foundational competencies before advanced system integration.`;

    return {
      id: roadmapId,
      userId,
      targetRoleId: targetRole.id,
      targetRoleTitle: targetRole.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalWeeks,
      weeklyHoursPlanned: weeklyHours,
      budgetAllocated: preferences.budget,
      currency: preferences.currency || 'INR',
      readinessAtCreation: initialReadiness,
      currentReadiness: initialReadiness,
      overallProgressPercentage: 0,
      summaryRationale,
      weeklyMilestones: milestones,
    };
  }
}

export const roadmapGenerator = new RoadmapGenerator();

