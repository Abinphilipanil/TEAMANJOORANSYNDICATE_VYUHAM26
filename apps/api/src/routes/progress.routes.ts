import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';

const router = Router();

router.post('/update', (req, res) => progressController.updateProgress(req, res));
router.get('/history/:roadmapId', (req, res) => progressController.getHistory(req, res));

export default router;

