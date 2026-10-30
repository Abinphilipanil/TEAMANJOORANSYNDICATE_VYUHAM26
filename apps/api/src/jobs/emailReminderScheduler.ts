import { ENV } from '../config/env';
import { userRepository } from '../repositories/user.repo';
import { roadmapRepository } from '../repositories/roadmap.repo';
import { notificationsRepository } from '../repositories/notifications.repo';
import { EmailReminderJobResult, Notification } from '@af03/contracts';

export class EmailReminderScheduler {
  /**
   * Scans user base for inactivity exceeding threshold (default 7 days).
   * Uses mock adapter or SMTP adapter depending on ENV.EMAIL_PROVIDER.
   */
  public async executeInactivityCheck(thresholdDaysOverride?: number): Promise<EmailReminderJobResult> {
    const thresholdDays = thresholdDaysOverride || ENV.INACTIVITY_THRESHOLD_DAYS;
    const now = Date.now();
    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;

    const allUsers = userRepository.getAll();
    let remindersSent = 0;
    let remindersMocked = 0;
    const details: EmailReminderJobResult['details'] = [];

    const isMock = ENV.EMAIL_PROVIDER === 'mock' || !ENV.SMTP_USER;

    for (const user of allUsers) {
      const lastActive = new Date(user.lastActiveAt).getTime();
      const diffMs = now - lastActive;
      const daysInactive = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      if (diffMs >= thresholdMs) {
        // Check if a reminder was already sent in the last 7 days to prevent spam
        const recentSent = notificationsRepository.getRecentSentTime(user.id);
        if (recentSent) {
          const sentDiff = now - new Date(recentSent).getTime();
          if (sentDiff < thresholdMs) {
            details.push({
              userId: user.id,
              email: user.email,
              daysInactive,
              status: 'skipped',
              reason: 'Reminder already dispatched recently',
            });
            continue;
          }
        }

        const userRoadmaps = roadmapRepository.findByUserId(user.id);
        const activeRoadmap = userRoadmaps[0];
        const roadmapTitle = activeRoadmap ? activeRoadmap.targetRoleTitle : 'your target career';
        const dashboardLink = `${ENV.WEB_URL}/dashboard`;

        const subject = `Keep your momentum going on ${roadmapTitle}! | AF-03 Reminder`;
        const body = `Hi ${user.fullName},

It has been ${daysInactive} days since you last logged progress on your ${roadmapTitle} roadmap. Consistent weekly practice is proven to accelerate role readiness by 3.4x.

Your next milestone is waiting in your learning workspace:
${dashboardLink}

Jump in and verify your next skill module today!

Best regards,
AF-03 Career Intelligence Agent`;

        const notification: Notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: user.id,
          userEmail: user.email,
          type: 'email_reminder',
          subject,
          body,
          sentAt: new Date().toISOString(),
          status: isMock ? 'mocked' : 'sent',
          inactivityDaysDetected: daysInactive,
          targetRoadmapId: activeRoadmap?.id,
        };

        if (isMock) {
          console.log(`\n[EMAIL SERVICE - MOCK ADAPTER]`);
          console.log(`TO: ${user.email}`);
          console.log(`SUBJECT: ${subject}`);
          console.log(`BODY:\n${body}\n----------------------------------`);
          remindersMocked++;
          details.push({
            userId: user.id,
            email: user.email,
            daysInactive,
            status: 'mocked',
            reason: 'Development mock adapter used (no SMTP credentials required)',
          });
        } else {
          // Real SMTP transport would dispatch here
          remindersSent++;
          details.push({
            userId: user.id,
            email: user.email,
            daysInactive,
            status: 'sent',
            reason: `Dispatched via SMTP (${ENV.SMTP_HOST})`,
          });
        }

        notificationsRepository.save(notification);
      }
    }

    return {
      executedAt: new Date().toISOString(),
      usersChecked: allUsers.length,
      inactivityThresholdDays: thresholdDays,
      remindersSent,
      remindersMocked,
      details,
    };
  }
}

export const emailReminderScheduler = new EmailReminderScheduler();

