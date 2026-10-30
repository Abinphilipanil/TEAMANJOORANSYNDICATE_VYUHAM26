import { Router, Request, Response, NextFunction } from 'express';
import { getHackathons, getHackathonSummary } from '../services/hackathon.service';

const router = Router();

// GET /api/hackathons (with ?domain= and ?search= support)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { domain, search } = req.query as { domain?: string; search?: string };
    const result = getHackathons({ domain, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/hackathons/summary
router.get('/summary', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = getHackathonSummary();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
