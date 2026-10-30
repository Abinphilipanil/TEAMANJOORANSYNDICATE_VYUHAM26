import { Router } from 'express';
import careersRoutes from './careers.routes';
import agentRoutes from './agent.routes';
import roadmapRoutes from './roadmap.routes';
import workspaceRoutes from './workspace.routes';
import progressRoutes from './progress.routes';
import opportunitiesRoutes from './opportunities.routes';
import jobsRoutes from './jobs.routes';

const router = Router();

router.use('/careers', careersRoutes);
router.use('/agent', agentRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/progress', progressRoutes);
router.use('/opportunities', opportunitiesRoutes);
router.use('/jobs', jobsRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    agent: 'AF-03 Career Intelligence Agent',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;

