import { 
  AnalyzeCareerRequest, 
  AnalyzeCareerResponse, 
  UserProfile, 
  CareerRole 
} from '@af03/contracts';
import { careersRepository } from '../repositories/careers.repo';
import { userRepository } from '../repositories/user.repo';
import { roadmapRepository } from '../repositories/roadmap.repo';
import { profileExtractor } from './extractor';
import { jobMarketAggregator } from '../integrations/jobs/marketAggregator';
import { skillGapAnalyzer } from './gapAnalyzer';
import { readinessService } from '../services/readiness.service';
import { roadmapGenerator } from './roadmapGenerator';
import { workspaceTool } from '../tools/workspaceTool';
import { githubEnricher } from '../integrations/github/githubEnricher';

export class AgentOrchestrator {
  public async analyzeCareerJourney(req: AnalyzeCareerRequest): Promise<AnalyzeCareerResponse> {
    // 1. Identify or create Target Career Role
    let role: CareerRole | undefined;
    if (req.targetRoleId) {
      role = careersRepository.findByIdOrSlug(req.targetRoleId);
    }

    if (!role && req.customRoleTitle) {
      role = careersRepository.addCustomRole({
        title: req.customRoleTitle,
        description: `Personalized custom career track created for ${req.customRoleTitle}.`,
      });
    }

    if (!role) {
      // Default to Full-Stack Developer if unspecified
      role = careersRepository.findByIdOrSlug('full-stack-developer') || careersRepository.getAll()[0];
    }

    // 2. Stage A: Extract Profile Skills & normalize taxonomy
    const detectedSkills = profileExtractor.extract({
      profileText: req.profileText,
      resumeFileName: req.resumeFileName,
      resumeText: req.resumeBase64 ? Buffer.from(req.resumeBase64, 'base64').toString('utf-8') : undefined,
      linkedInUrl: req.linkedInUrl,
      githubUrl: req.githubUrl,
    });

    // Enrich GitHub stats if provided
    const githubStats = await githubEnricher.enrichProfile(req.githubUrl);

    // Persist or update UserProfile
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const userProfile: UserProfile = {
      id: userId,
      fullName: req.fullName || 'Career Candidate',
      email: req.email || 'developer@af03-skillgapper.local',
      headline: `${role.title} Candidate`,
      rawProfileText: req.profileText,
      resumeFileName: req.resumeFileName,
      linkedInUrl: req.linkedInUrl,
      githubUrl: req.githubUrl,
      githubStats,
      detectedSkills,
      preferences: req.preferences,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    userRepository.save(userProfile);

    // 3. Stage B: Job-Market Multi-Posting Analysis
    const marketResult = await jobMarketAggregator.getMarketRequirements(role);

    // 4. Stage C: Skill-Gap Analysis & Explainable Role-Readiness
    const skillGaps = skillGapAnalyzer.analyzeGaps(role, detectedSkills);
    const roleReadiness = readinessService.calculateReadiness(role, skillGaps, detectedSkills);

    // 5. Stage D: Personalized Roadmap Generation
    const roadmap = roadmapGenerator.generate(
      userId,
      role,
      skillGaps,
      req.preferences,
      roleReadiness.overallScorePercentage
    );
    roadmapRepository.save(roadmap);

    // 6. Safe Server-Side Workspace Creation (Part 5)
    const workspace = workspaceTool.createWorkspaceForRoadmap(roadmap);
    roadmap.associatedWorkspaceId = workspace.id;
    roadmapRepository.save(roadmap);

    return {
      success: true,
      userProfile,
      careerRole: role,
      detectedSkills,
      marketJobPostings: marketResult.jobPostings,
      skillGaps,
      roleReadiness,
      roadmap,
      workspace,
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();

