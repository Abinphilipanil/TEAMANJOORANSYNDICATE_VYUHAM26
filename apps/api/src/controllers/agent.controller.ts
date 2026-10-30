import { Request, Response } from 'express';
import { agentOrchestrator } from '../agent/orchestrator';
import { profileExtractor } from '../agent/extractor';
import { jobMarketAggregator } from '../integrations/jobs/marketAggregator';
import { careersRepository } from '../repositories/careers.repo';
import { AnalyzeCareerRequest } from '@af03/contracts';

export class AgentController {
  public async analyze(req: Request, res: Response) {
    try {
      const payload: AnalyzeCareerRequest = req.body;

      // Ensure sensible defaults for candidate profile fields if not provided
      payload.fullName = payload.fullName || 'Career Candidate';
      payload.email = payload.email || 'candidate@careeragent.ai';

      if (!payload.preferences) {
        payload.preferences = {
          learningPace: 'moderate',
          hoursPerWeek: 10,
          budget: 0,
          currency: 'INR',
          targetWeeks: 12,
          preferredLearningFormats: ['documentation', 'interactive', 'project'],
          preferredLocation: 'Remote',
        };
      }

      const result = await agentOrchestrator.analyzeCareerJourney(payload);

      // Return a unified payload so both the ResultsDashboard and agent views work seamlessly
      return res.status(200).json({
        ...result.analysisResult,
        ...result,
        analysisResult: result.analysisResult,
      });
    } catch (error: any) {
      console.error('Agent analysis error:', error);
      return res.status(500).json({
        error: error.message || 'Resume analysis failed. Please verify your inputs and API configuration.',
      });
    }
  }

  public extractProfile(req: Request, res: Response) {
    try {
      const { profileText, resumeText, linkedInUrl, githubUrl } = req.body;
      const skills = profileExtractor.extract({
        profileText,
        resumeText,
        linkedInUrl,
        githubUrl,
      });
      return res.json({ skills });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public async getMarketSignals(req: Request, res: Response) {
    try {
      const { roleSlug } = req.query;
      const role = careersRepository.findByIdOrSlug(String(roleSlug || 'full-stack-developer'));
      if (!role) {
        return res.status(404).json({ error: 'Career role not found' });
      }
      const signals = await jobMarketAggregator.getMarketRequirements(role);
      return res.json(signals);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const agentController = new AgentController();
