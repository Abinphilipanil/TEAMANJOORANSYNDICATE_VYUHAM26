import { Request, Response } from 'express';
import { opportunitiesRepository } from '../repositories/opportunities.repo';
import { OpportunityType } from '@af03/contracts';

export class OpportunitiesController {
  public async getAll(req: Request, res: Response) {
    try {
      const { targetRole, type, location, skills, live } = req.query;
      const skillsList = skills
        ? String(skills)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

      const filtered = await opportunitiesRepository.filterWithLiveMatching({
        targetRole: targetRole ? String(targetRole) : undefined,
        type: type ? (String(type) as OpportunityType) : undefined,
        location: location ? String(location) : undefined,
        skills: skillsList,
        live: live !== 'false',
      });
      return res.json(filtered);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const opportunitiesController = new OpportunitiesController();
