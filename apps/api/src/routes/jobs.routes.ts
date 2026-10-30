import { Router } from 'express';
import { jobsController } from '../controllers/jobs.controller';

const router = Router();

router.post('/trigger-reminders', (req, res) => jobsController.triggerReminders(req, res));
router.get('/notification-logs', (req, res) => jobsController.getNotificationLogs(req, res));

export default router;

