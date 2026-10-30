import { Request, Response } from 'express';
import { careersRepository } from '../repositories/careers.repo';

export class CareersController {
  public getAll(req: Request, res: Response) {
    try {
      const { search, domain } = req.query;
      if (search || domain) {
        const results = careersRepository.search(String(search || ''), String(domain || ''));
        return res.json(results);
      }
      const all = careersRepository.getAll();
      return res.json(all);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public getByIdOrSlug(req: Request, res: Response) {
    try {
      const { idOrSlug } = req.params;
      const role = careersRepository.findByIdOrSlug(idOrSlug);
      if (!role) {
        return res.status(404).json({ error: `Career role '${idOrSlug}' not found` });
      }
      return res.json(role);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public createCustom(req: Request, res: Response) {
    try {
      const { title, domain, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Career role title is required' });
      }
      const customRole = careersRepository.addCustomRole({ title, domain, description });
      return res.status(201).json(customRole);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export const careersController = new CareersController();

