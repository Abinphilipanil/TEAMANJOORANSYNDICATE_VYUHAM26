import { 
  AnalyzeCareerRequest, 
  AnalyzeCareerResponse, 
  UserProfile, 
  CareerRole,
  ResumeAnalysisResult,
  SkillGap,
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
import { pdfExtractor } from '../tools/pdfExtractor';
import { getResumeAnalysisProvider } from '../ai/providerFactory';
import { ENV } from '../config/env';

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

    // 2. Stage A: Extract Resume Text safely using PDF extractor
    let extractedResumeText = req.profileText || '';
    let extractedWordCount = 0;

    if (req.resumeBase64) {
      const buffer = Buffer.from(req.resumeBase64, 'base64');
      const doc = await pdfExtractor.extractText(buffer, req.resumeFileName);
      extractedResumeText = doc.text;
      extractedWordCount = doc.wordCount;
    }

    // Run deterministic rule-based skill normalization across canonical taxonomy
    const detectedSkills = profileExtractor.extract({
      profileText: req.profileText,
      resumeFileName: req.resumeFileName,
      resumeText: extractedResumeText,
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
      preferences: req.preferences || {
        learningPace: 'moderate',
        hoursPerWeek: 10,
        budget: 0,
        currency: 'INR',
        targetWeeks: 12,
        preferredLearningFormats: ['documentation', 'interactive', 'project'],
        preferredLocation: 'Remote',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    userRepository.save(userProfile);

    // 3. Stage B: Job-Market Multi-Posting Analysis
    const marketResult = await jobMarketAggregator.getMarketRequirements(role);

    // 4. Stage C: Deterministic Skill-Gap Analysis & Explainable Role-Readiness
    const skillGaps = skillGapAnalyzer.analyzeGaps(role, detectedSkills);
    const roleReadiness = readinessService.calculateReadiness(role, skillGaps, detectedSkills);

    // 5. Stage D: AI-Powered Deep Evaluation (Groq LLM)
    const targetJobDescription = req.jobDescription && req.jobDescription.trim().length > 20
      ? req.jobDescription.trim()
      : `${role.overviewDescription}\n\nCore Required Competencies:\n${role.coreCompetencies.join('\n- ')}`;

    let analysisResult: ResumeAnalysisResult;

    // Check if explicitly configured for mock mode
    const currentProvider = (process.env.AI_PROVIDER || ENV.AI_PROVIDER || 'groq').toLowerCase().trim();
    if (currentProvider === 'mock') {
      analysisResult = this.createMockAnalysisResult(req, extractedWordCount, roleReadiness.overallScorePercentage);
    } else {
      // Real LLM provider (Groq default)
      const provider = getResumeAnalysisProvider();
      const aiOutput = await provider.analyzeResume({
        resumeText: extractedResumeText,
        jobDescription: targetJobDescription,
        targetRoleTitle: role.title,
        resumeFileName: req.resumeFileName,
      });

      // Hybrid scoring: Combine deterministic rule-based taxonomy score (35%) with AI contextual fit (65%)
      const ruleBasedScore = roleReadiness.overallScorePercentage;
      const aiScore = aiOutput.overallScore;
      const finalScore = Math.min(100, Math.max(0, Math.round(ruleBasedScore * 0.35 + aiScore * 0.65)));

      // Resilient skill fallback: ensure candidate never receives 0 verified skills
      const resolvedMatched =
        aiOutput.matchedSkills.length > 0
          ? aiOutput.matchedSkills.map((s) => ({
              name: s.name,
              category: s.category || 'General',
              matchType: s.matchType || 'Exact Match',
              context: s.context || 'Demonstrated in resume',
            }))
          : detectedSkills.slice(0, 6).map((d) => ({
              name: d.skillName,
              category: 'Technical Core',
              matchType: 'Exact Match',
              context: d.snippetOrEvidenceText || 'Identified in candidate technical experience & resume credentials.',
            }));

      const resolvedPartial =
        aiOutput.partiallyMatchedSkills.length > 0
          ? aiOutput.partiallyMatchedSkills.map((s) => ({
              name: s.name,
              category: s.category || 'General',
              matchType: s.matchType || 'Partial Match',
              notes: s.notes || 'Found related foundational experience',
            }))
          : skillGaps
              .filter((g) => g.status === 'partially_developed' || g.status === 'needs_verification')
              .map((g) => ({
                name: g.skillName,
                category: g.category || 'Architecture & DevOps',
                matchType: 'Partial Match',
                notes: g.reasoning || 'Found foundational capability; requires deeper production-level experience.',
              }));

      const resolvedMissing =
        aiOutput.missingSkills.length > 0
          ? aiOutput.missingSkills.map((s) => ({
              name: s.name,
              category: s.category || 'General',
              priority: s.priority,
              importance: s.importance,
            }))
          : skillGaps
              .filter((g) => g.status === 'missing')
              .slice(0, 5)
              .map((g) => ({
                name: g.skillName,
                category: g.category || 'Target Requirement',
                priority: (g.importance === 'critical' ? 'Critical' : 'High') as 'Critical' | 'High' | 'Medium',
                importance: g.reasoning || 'Specifically required by target role specification.',
              }));

      const totalSkillsCount = resolvedMatched.length + resolvedPartial.length + resolvedMissing.length;
      const coveragePercentage = totalSkillsCount > 0
        ? Math.round(((resolvedMatched.length + 0.5 * resolvedPartial.length) / totalSkillsCount) * 100)
        : finalScore;

      analysisResult = {
        isPrototypeData: false,
        analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resumeMeta: {
          fileName: req.resumeFileName || 'Resume.pdf',
          fileSizeKb: req.resumeBase64 ? Math.round(Buffer.from(req.resumeBase64, 'base64').length / 1024) : 0,
          extractedWordCount,
        },
        jobMeta: {
          characterCount: targetJobDescription.length,
          estimatedRequirementsCount: totalSkillsCount || 10,
        },
        overallMatch: {
          score: finalScore,
          category: aiOutput.matchCategory,
          summary: aiOutput.summary,
          confidenceScore: aiOutput.confidenceScore,
          aiScore,
          ruleBasedScore,
        },
        readinessAssessment: {
          status: aiOutput.readinessStatus,
          statusLevel: aiOutput.statusLevel,
          keyStrength: aiOutput.keyStrength,
          primaryRisk: aiOutput.primaryRisk,
          recommendedTimeline: aiOutput.recommendedTimeline,
        },
        skillsBreakdown: {
          matched: resolvedMatched,
          partiallyMatched: resolvedPartial,
          missing: resolvedMissing,
        },
        gapSummary: {
          totalRequiredSkills: totalSkillsCount,
          matchedCount: resolvedMatched.length,
          partialCount: resolvedPartial.length,
          missingCount: resolvedMissing.length,
          coveragePercentage,
        },
        actionableSuggestions: {
          resumeImprovements: aiOutput.resumeImprovements,
          skillDevelopment: aiOutput.skillDevelopment,
        },
        strengths: aiOutput.strengths,
        weaknesses: aiOutput.weaknesses,
      };
    }

    // 6. Stage E: Merge AI-identified missing and partial skills into skillGaps
    const enrichedGaps: SkillGap[] = [...skillGaps];
    const devSuggestions = analysisResult.actionableSuggestions?.skillDevelopment || [];
    const getTimeEstimate = (skillName: string, priority: string): number => {
      const match = devSuggestions.find((d) =>
        d.skill.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(d.skill.toLowerCase())
      );
      if (match?.timeEstimate) {
        const hourMatch = match.timeEstimate.match(/(\d+)\s*(?:hour|hr)/i);
        if (hourMatch) return parseInt(hourMatch[1], 10);
        const weekMatch = match.timeEstimate.match(/(\d+)\s*(?:week|wk)/i);
        if (weekMatch) return parseInt(weekMatch[1], 10) * 10;
      }
      const p = priority.toLowerCase();
      if (p === 'critical') return 35;
      if (p === 'high') return 25;
      return 15;
    };

    if (analysisResult.skillsBreakdown?.missing) {
      for (const m of analysisResult.skillsBreakdown.missing) {
        const key = m.name.toLowerCase();
        const existing = enrichedGaps.find((g) => g.skillName.toLowerCase() === key);
        const estHours = getTimeEstimate(m.name, m.priority);
        const importance = m.priority.toLowerCase() === 'critical' ? 'critical' : m.priority.toLowerCase() === 'high' ? 'high' : 'medium';

        if (existing) {
          existing.status = 'missing';
          existing.importance = importance;
          existing.estimatedHoursToMaster = estHours;
          existing.reasoning = m.importance || existing.reasoning;
        } else {
          enrichedGaps.push({
            skillName: m.name,
            category: (m.category as any) || 'Core',
            importance,
            status: 'missing',
            targetProficiency: 'intermediate',
            reasoning: m.importance || `Required competency identified by AI analysis for ${role.title}.`,
            estimatedHoursToMaster: estHours,
          });
        }
      }
    }

    if (analysisResult.skillsBreakdown?.partiallyMatched) {
      for (const p of analysisResult.skillsBreakdown.partiallyMatched) {
        const key = p.name.toLowerCase();
        const existing = enrichedGaps.find((g) => g.skillName.toLowerCase() === key);
        const estHours = getTimeEstimate(p.name, 'medium');

        if (existing) {
          if (existing.status !== 'already_possessed') {
            existing.status = 'partially_developed';
            existing.estimatedHoursToMaster = estHours;
            existing.reasoning = p.notes || existing.reasoning;
          }
        } else {
          enrichedGaps.push({
            skillName: p.name,
            category: (p.category as any) || 'Core',
            importance: 'medium',
            status: 'partially_developed',
            currentProficiency: 'beginner',
            targetProficiency: 'intermediate',
            reasoning: p.notes || `Found partial background in resume. Target role requires professional depth.`,
            estimatedHoursToMaster: estHours,
          });
        }
      }
    }

    // 7. Personalized Roadmap Generation
    const roadmap = roadmapGenerator.generate(
      userId,
      role,
      enrichedGaps,
      userProfile.preferences,
      analysisResult.overallMatch.score || roleReadiness.overallScorePercentage
    );
    roadmapRepository.save(roadmap);

    // 8. Safe Server-Side Workspace Creation
    const workspace = workspaceTool.createWorkspaceForRoadmap(roadmap);
    roadmap.associatedWorkspaceId = workspace.id;
    roadmapRepository.save(roadmap);

    return {
      success: true,
      userProfile,
      careerRole: role,
      detectedSkills,
      marketJobPostings: marketResult.jobPostings,
      skillGaps: enrichedGaps,
      roleReadiness,
      roadmap,
      workspace,
      analysisResult,
    };
  }

  private createMockAnalysisResult(req: AnalyzeCareerRequest, wordCount: number, ruleScore: number): ResumeAnalysisResult {
    return {
      isPrototypeData: true,
      analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resumeMeta: {
        fileName: req.resumeFileName || 'Resume.pdf',
        fileSizeKb: req.resumeBase64 ? Math.round(Buffer.from(req.resumeBase64, 'base64').length / 1024) : 245,
        extractedWordCount: wordCount || 420,
      },
      jobMeta: {
        characterCount: req.jobDescription?.length || 850,
        estimatedRequirementsCount: 12,
      },
      overallMatch: {
        score: ruleScore || 78,
        category: 'Strong Candidate Potential',
        summary: 'Your profile exhibits substantial alignment with the core responsibilities. Closing critical gaps in container orchestration will elevate you to top-tier readiness.',
        confidenceScore: 'High',
        ruleBasedScore: ruleScore,
      },
      readinessAssessment: {
        status: 'Interview Ready with Prerequisites',
        statusLevel: 'high',
        keyStrength: 'Core programming fundamentals, API design, and component architecture mirror the target position.',
        primaryRisk: 'Absence of documented production Kubernetes deployments on the resume.',
        recommendedTimeline: '2 to 3 weeks of targeted resume optimization.',
      },
      skillsBreakdown: {
        matched: [
          { name: 'JavaScript (ES6+)', category: 'Frontend', matchType: 'Exact Match', context: 'Found in Work Experience & Technical Skills' },
          { name: 'React.js', category: 'Frontend', matchType: 'Exact Match', context: 'Demonstrated across production projects' },
          { name: 'Node.js & Express', category: 'Backend', matchType: 'Exact Match', context: 'Referenced in RESTful service architecture' },
        ],
        partiallyMatched: [
          { name: 'Docker & Containerization', category: 'DevOps', matchType: 'Partial Match', notes: 'Basic container builds mentioned; role seeks registry publishing.' },
          { name: 'TypeScript', category: 'Frontend', matchType: 'Partial Match', notes: 'Listed under familiar skills; position expects strict typing.' },
        ],
        missing: [
          { name: 'Kubernetes (K8s)', category: 'DevOps', priority: 'Critical', importance: 'Required for microservices deployment and pod scaling.' },
          { name: 'CI/CD Pipelines', category: 'DevOps', priority: 'Critical', importance: 'Mandatory requirement for automated test runners.' },
        ],
      },
      gapSummary: {
        totalRequiredSkills: 7,
        matchedCount: 3,
        partialCount: 2,
        missingCount: 2,
        coveragePercentage: 71,
      },
      actionableSuggestions: {
        resumeImprovements: [
          {
            id: 'r1',
            section: 'Work Experience',
            title: 'Quantify Impact with Performance & Business Metrics',
            description: 'Transform passive bullet points into quantifiable accomplishments (e.g., "Reduced API latency by 32% by implementing Redis caching").',
          },
        ],
        skillDevelopment: [
          {
            id: 's1',
            skill: 'Kubernetes & Helm',
            timeEstimate: '15 hours',
            action: 'Deploy a multi-service Node.js application on a local Minikube cluster and write Helm charts.',
          },
        ],
      },
      strengths: ['Full-stack web architecture', 'Modern JavaScript/React ecosystem'],
      weaknesses: ['Container orchestration at scale', 'Automated release pipelines'],
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
