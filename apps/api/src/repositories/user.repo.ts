import { UserProfile } from '@af03/contracts';

class UserRepository {
  private users: Map<string, UserProfile> = new Map();

  public save(user: UserProfile): UserProfile {
    this.users.set(user.id, user);
    return user;
  }

  public findById(id: string): UserProfile | undefined {
    return this.users.get(id);
  }

  public findByEmail(email: string): UserProfile | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  public getAll(): UserProfile[] {
    return Array.from(this.users.values());
  }

  public updateLastActive(id: string): void {
    const user = this.users.get(id);
    if (user) {
      user.lastActiveAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      this.users.set(id, user);
    }
  }
}

export const userRepository = new UserRepository();

