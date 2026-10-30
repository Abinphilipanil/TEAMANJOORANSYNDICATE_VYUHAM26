import { Request, Response } from 'express';
import { opportunitiesRepository } from '../repositories/opportunities.repo';
import { OpportunityType } from '@af03/contracts';

export class OpportunitiesController {
  public getAll(req: Request, res: Response) {
    try {
      const { targetRole, type, location } = req.query;
      const filtered = opportunitiesRepository.filter(
        targetRole ? String(targetRole) : undefined,
        type ? (String(type) as OpportunityType) : undefined,
        location ? String(location) : undefined
      );
      return res.json(filtered);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const opportunitiesController = new OpportunitiesController();

