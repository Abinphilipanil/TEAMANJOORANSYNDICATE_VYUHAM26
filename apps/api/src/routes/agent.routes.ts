import { Router } from 'express';
import multer from 'multer';
import { agentController } from '../controllers/agent.controller';

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post('/analyze', upload.single('resume'), (req, res) => {
  if (req.file) {
    req.body.resumeFileName = req.file.originalname;
    req.body.resumeBase64 = req.file.buffer.toString('base64');
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

