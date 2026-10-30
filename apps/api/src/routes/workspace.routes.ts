import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller';

const router = Router();

router.get('/:roadmapId', (req, res) => workspaceController.getWorkspace(req, res));
router.post('/sync', (req, res) => workspaceController.syncWorkspace(req, res));
router.post('/download-resource', (req, res) => workspaceController.downloadResource(req, res));
router.post('/custom-folder', (req, res) => workspaceController.addCustomFolder(req, res));

export default router;

