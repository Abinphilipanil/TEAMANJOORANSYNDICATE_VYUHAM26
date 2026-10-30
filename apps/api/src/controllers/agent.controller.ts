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

      if (!payload.fullName || !payload.email) {
        return res.status(400).json({ error: 'Full name and email are required for career analysis.' });
      }

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
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Agent analysis error:', error);
      return res.status(500).json({ error: error.message });
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

