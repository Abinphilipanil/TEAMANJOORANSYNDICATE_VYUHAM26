import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller';

const router = Router();

router.get('/', (req, res) => roadmapController.getAll(req, res));
router.get('/:id', (req, res) => roadmapController.getById(req, res));
router.get('/user/:userId', (req, res) => roadmapController.getByUserId(req, res));

export default router;

