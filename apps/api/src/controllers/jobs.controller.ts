import { Request, Response } from 'express';
import { emailReminderScheduler } from '../jobs/emailReminderScheduler';
import { notificationsRepository } from '../repositories/notifications.repo';

export class JobsController {
  public async triggerReminders(req: Request, res: Response) {
    try {
      const { thresholdDays } = req.body;
      const result = await emailReminderScheduler.executeInactivityCheck(
        thresholdDays ? parseInt(thresholdDays, 10) : undefined
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public getNotificationLogs(req: Request, res: Response) {
    try {
      const logs = notificationsRepository.getAll();
      return res.json(logs);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const jobsController = new JobsController();

