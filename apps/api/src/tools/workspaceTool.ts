import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';
import { LearningWorkspace, WorkspaceFolderNode, Roadmap } from '@af03/contracts';

export class WorkspaceTool {
  private rootPath: string;

  constructor() {
    this.rootPath = ENV.WORKSPACE_ROOT_PATH;
    this.ensureRootExists();
  }

  private ensureRootExists() {
    if (!fs.existsSync(this.rootPath)) {
      fs.mkdirSync(this.rootPath, { recursive: true });
    }
  }

  /**
   * Validates and sanitizes a relative path to ensure it remains strictly
   * contained within the designated server workspace root.
   */
  private resolveSafePath(relativePath: string): string {
    const resolved = path.resolve(this.rootPath, relativePath);
    if (!resolved.startsWith(this.rootPath)) {
      throw new Error(`Security Violation: Path traversal outside workspace root is blocked: ${relativePath}`);
    }
    return resolved;
  }

  /**
   * Sanitizes folder names to ensure cross-platform Windows/Linux safe filenames
   */
  private sanitizeFolderName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
  }

  /**
   * Generates or synchronizes the complete workspace for a roadmap on the server storage.
   */
  public createWorkspaceForRoadmap(roadmap: Roadmap): LearningWorkspace {
    const roleSlug = this.sanitizeFolderName(roadmap.targetRoleTitle);
    const roleDir = this.resolveSafePath(roleSlug);

    if (!fs.existsSync(roleDir)) {
      fs.mkdirSync(roleDir, { recursive: true });
    }

    // Extract unique skills from milestones
    const skills = new Set<string>();
    for (const milestone of roadmap.weeklyMilestones) {
      for (const item of milestone.items) {
        skills.add(item.skillName);
      }
    }

    const standardSubfolders = ['Fundamentals', 'Advanced_Concepts', 'Learning_Resources', 'Projects'];

    let folderCount = 1; // root role dir

    for (const skill of skills) {
      const skillFolderName = this.sanitizeFolderName(skill);
      const skillPath = path.join(roleDir, skillFolderName);

      if (!fs.existsSync(skillPath)) {
        fs.mkdirSync(skillPath, { recursive: true });
        folderCount++;
      }

      for (const sub of standardSubfolders) {
        const subPath = path.join(skillPath, sub);
        if (!fs.existsSync(subPath)) {
          fs.mkdirSync(subPath, { recursive: true });
          folderCount++;

          // Create a starter README or study guide in each subfolder
          const readmePath = path.join(subPath, 'README.md');
          if (!fs.existsSync(readmePath)) {
            const content = `# ${skill} — ${sub.replace('_', ' ')}\n\nThis folder contains curated study notes, official documentation extracts, and project milestones for **${skill}**.\n\n*Created by AF-03 Career Intelligence Agent on ${new Date().toISOString()}*\n`;
            fs.writeFileSync(readmePath, content, 'utf-8');
          }
        }
      }
    }

    // Read full tree from disk
    const diskTree = this.buildFolderTree(roleDir, roleSlug);

    const workspace: LearningWorkspace = {
      id: `ws-${roadmap.id}`,
      roadmapId: roadmap.id,
      targetRoleSlug: roleSlug,
      targetRoleTitle: roadmap.targetRoleTitle,
      serverRootPath: `AF03_Workspace/${roleSlug}`,
      status: 'created_on_disk',
      totalFoldersCount: this.countFolders(diskTree),
      totalFilesCount: this.countFiles(diskTree),
      diskStructure: diskTree,
      createdAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
    };

    return workspace;
  }

  /**
   * Adds a custom subfolder requested by user
   */
  public addCustomSubfolder(roleSlug: string, skillFolder: string, subfolderName: string): LearningWorkspace {
    const safeRole = this.sanitizeFolderName(roleSlug);
    const safeSkill = this.sanitizeFolderName(skillFolder);
    const safeSub = this.sanitizeFolderName(subfolderName);

    const targetDir = this.resolveSafePath(path.join(safeRole, safeSkill, safeSub));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(
        path.join(targetDir, 'README.md'),
        `# ${subfolderName}\n\nCustom workspace subfolder created for ${skillFolder}.\n`,
        'utf-8'
      );
    }

    const roleDir = this.resolveSafePath(safeRole);
    const diskTree = this.buildFolderTree(roleDir, safeRole);

    return {
      id: `ws-${safeRole}`,
      roadmapId: '',
      targetRoleSlug: safeRole,
      targetRoleTitle: safeRole.replace(/_/g, ' '),
      serverRootPath: `AF03_Workspace/${safeRole}`,
      status: 'created_on_disk',
      totalFoldersCount: this.countFolders(diskTree),
      totalFilesCount: this.countFiles(diskTree),
      diskStructure: diskTree,
      createdAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
    };
  }

  /**
   * Reads a folder recursively into a WorkspaceFolderNode
   */
  public buildFolderTree(dirPath: string, relativePath: string): WorkspaceFolderNode {
    const stats = fs.statSync(dirPath);
    const baseName = path.basename(dirPath);

    if (!stats.isDirectory()) {
      return {
        name: baseName,
        relativePath,
        type: 'file',
        resourceMetadata: {
          fileSizeBytes: stats.size,
          mimeType: baseName.endsWith('.md') ? 'text/markdown' : 'text/plain',
        }
      };
    }

    const node: WorkspaceFolderNode = {
      name: baseName,
      relativePath,
      type: 'directory',
      subfolders: [],
    };

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryRel = path.join(relativePath, entry.name);
      const entryAbs = path.join(dirPath, entry.name);
      node.subfolders!.push(this.buildFolderTree(entryAbs, entryRel));
    }

    return node;
  }

  private countFiles(node: WorkspaceFolderNode): number {
    if (node.type === 'file') return 1;
    let count = 0;
    if (node.subfolders) {
      for (const sub of node.subfolders) {
        count += this.countFiles(sub);
      }
    }
    return count;
  }

  private countFolders(node: WorkspaceFolderNode): number {
    if (node.type === 'file') return 0;
    let count = 1;
    if (node.subfolders) {
      for (const sub of node.subfolders) {
        count += this.countFolders(sub);
      }
    }
    return count;
  }
}

export const workspaceTool = new WorkspaceTool();
