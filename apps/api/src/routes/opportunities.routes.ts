import { Router } from 'express';
import { opportunitiesController } from '../controllers/opportunities.controller';

const router = Router();

router.get('/', (req, res) => opportunitiesController.getAll(req, res));

export default router;

