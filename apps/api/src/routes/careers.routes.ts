import { Router } from 'express';
import { careersController } from '../controllers/careers.controller';

const router = Router();

router.get('/', (req, res) => careersController.getAll(req, res));
router.get('/:idOrSlug', (req, res) => careersController.getByIdOrSlug(req, res));
router.post('/custom', (req, res) => careersController.createCustom(req, res));

export default router;

