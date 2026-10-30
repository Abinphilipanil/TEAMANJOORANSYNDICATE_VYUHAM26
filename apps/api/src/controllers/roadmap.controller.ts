import { Request, Response } from 'express';
import { roadmapRepository } from '../repositories/roadmap.repo';

export class RoadmapController {
  public getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const roadmap = roadmapRepository.findById(id);
      if (!roadmap) {
        return res.status(404).json({ error: `Roadmap '${id}' not found` });
      }
      return res.json(roadmap);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const roadmaps = roadmapRepository.findByUserId(userId);
      return res.json(roadmaps);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public getAll(req: Request, res: Response) {
    try {
      const all = roadmapRepository.getAll();
      return res.json(all);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const roadmapController = new RoadmapController();

