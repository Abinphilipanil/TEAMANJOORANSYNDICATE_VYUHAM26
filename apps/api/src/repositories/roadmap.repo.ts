import { Roadmap } from '@af03/contracts';

class RoadmapRepository {
  private roadmaps: Map<string, Roadmap> = new Map();

  public save(roadmap: Roadmap): Roadmap {
    this.roadmaps.set(roadmap.id, roadmap);
    return roadmap;
  }

  public findById(id: string): Roadmap | undefined {
    return this.roadmaps.get(id);
  }

  public findByUserId(userId: string): Roadmap[] {
    const list: Roadmap[] = [];
    for (const rm of this.roadmaps.values()) {
      if (rm.userId === userId) {
        list.push(rm);
      }
    }
    return list;
  }

  public getAll(): Roadmap[] {
    return Array.from(this.roadmaps.values());
  }
}

export const roadmapRepository = new RoadmapRepository();

