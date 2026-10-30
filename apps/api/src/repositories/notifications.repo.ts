import { Notification } from '@af03/contracts';

class NotificationsRepository {
  private notifications: Notification[] = [];

  public save(notification: Notification): Notification {
    this.notifications.unshift(notification);
    return notification;
  }

  public findByUserId(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public getAll(): Notification[] {
    return [...this.notifications];
  }

  public getRecentSentTime(userId: string): string | undefined {
    const userNotifs = this.findByUserId(userId)
      .filter((n) => n.status === 'sent' || n.status === 'mocked')
      .sort((a, b) => new Date(b.sentAt || 0).getTime() - new Date(a.sentAt || 0).getTime());
    
    return userNotifs[0]?.sentAt;
  }
}

export const notificationsRepository = new NotificationsRepository();

