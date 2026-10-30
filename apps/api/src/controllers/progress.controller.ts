import { Request, Response } from 'express';
import { progressService } from '../services/progress.service';
import { UpdateProgressRequest } from '@af03/contracts';

export class ProgressController {
  public updateProgress(req: Request, res: Response) {
    try {
      const payload: UpdateProgressRequest = req.body;

      if (!payload.roadmapId || !payload.itemId) {
        return res.status(400).json({ error: 'roadmapId and itemId are required' });
      }

      const result = progressService.updateItemProgress(payload);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public getHistory(req: Request, res: Response) {
    try {
      const { roadmapId } = req.params;
      const history = progressService.getHistory(roadmapId);
      return res.json(history);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const progressController = new ProgressController();

