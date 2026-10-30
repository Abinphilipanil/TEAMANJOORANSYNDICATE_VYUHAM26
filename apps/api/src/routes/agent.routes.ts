import { Router } from 'express';
import multer from 'multer';
import { agentController } from '../controllers/agent.controller';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadMiddleware = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'resume_pdf', maxCount: 1 },
]);

router.post('/analyze', uploadMiddleware, (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const uploadedFile = files?.resume?.[0] || files?.resume_pdf?.[0];

  if (uploadedFile) {
    req.body.resumeFileName = uploadedFile.originalname;
    req.body.resumeBase64 = uploadedFile.buffer.toString('base64');
  }

  // Handle both camelCase and snake_case job description
  if (req.body.job_description && !req.body.jobDescription) {
    req.body.jobDescription = req.body.job_description;
  }

  if (typeof req.body.preferences === 'string') {
    try {
      req.body.preferences = JSON.parse(req.body.preferences);
    } catch {
      // Handled in controller default
    }
  }

  agentController.analyze(req, res);
});

router.post('/extract-profile', (req, res) => agentController.extractProfile(req, res));
router.get('/market-signals', (req, res) => agentController.getMarketSignals(req, res));

export default router;
