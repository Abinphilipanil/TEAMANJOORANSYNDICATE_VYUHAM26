import { ProgressRecord } from '@af03/contracts';

class ProgressRepository {
  private records: ProgressRecord[] = [];

  public save(record: ProgressRecord): ProgressRecord {
    const existingIdx = this.records.findIndex(
      (r) => r.roadmapId === record.roadmapId && r.itemId === record.itemId
    );

    if (existingIdx >= 0) {
      this.records[existingIdx] = record;
    } else {
      this.records.push(record);
    }
    return record;
  }

  public findByRoadmapId(roadmapId: string): ProgressRecord[] {
    return this.records.filter((r) => r.roadmapId === roadmapId);
  }

  public findByItem(roadmapId: string, itemId: string): ProgressRecord | undefined {
    return this.records.find((r) => r.roadmapId === roadmapId && r.itemId === itemId);
  }

  public getAll(): ProgressRecord[] {
    return [...this.records];
  }
}

export const progressRepository = new ProgressRepository();

