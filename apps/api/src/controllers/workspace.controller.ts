import { Request, Response } from 'express';
import { workspaceTool } from '../tools/workspaceTool';
import { roadmapRepository } from '../repositories/roadmap.repo';
import { resourceDownloader } from '../integrations/resources/resourceDownloader';

export class WorkspaceController {
  public getWorkspace(req: Request, res: Response) {
    try {
      const { roadmapId } = req.params;
      const roadmap = roadmapRepository.findById(roadmapId);
      if (!roadmap) {
        return res.status(404).json({ error: `Roadmap '${roadmapId}' not found` });
      }

      const workspace = workspaceTool.createWorkspaceForRoadmap(roadmap);
      return res.json(workspace);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public syncWorkspace(req: Request, res: Response) {
    try {
      const { roadmapId } = req.body;
      const roadmap = roadmapRepository.findById(roadmapId);
      if (!roadmap) {
        return res.status(404).json({ error: `Roadmap '${roadmapId}' not found` });
      }

      const workspace = workspaceTool.createWorkspaceForRoadmap(roadmap);
      return res.status(200).json({
        success: true,
        message: 'Workspace synchronized successfully on server disk',
        workspace,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public async downloadResource(req: Request, res: Response) {
    try {
      const { workspaceId, skillFolder, subfolder, resourceTitle, resourceSourceUrl } = req.body;

      if (!workspaceId || !skillFolder || !subfolder || !resourceTitle || !resourceSourceUrl) {
        return res.status(400).json({ error: 'Missing required parameters for resource download' });
      }

      const result = await resourceDownloader.downloadPermittedDocument({
        workspaceId,
        skillFolder,
        subfolder,
        resourceTitle,
        resourceSourceUrl,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public addCustomFolder(req: Request, res: Response) {
    try {
      const { roleSlug, skillFolder, subfolderName } = req.body;
      if (!roleSlug || !skillFolder || !subfolderName) {
        return res.status(400).json({ error: 'roleSlug, skillFolder, and subfolderName are required' });
      }

      const updated = workspaceTool.addCustomSubfolder(roleSlug, skillFolder, subfolderName);
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const workspaceController = new WorkspaceController();

