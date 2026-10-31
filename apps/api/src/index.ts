import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import apiRoutes from './routes';
import { emailReminderScheduler } from './jobs/emailReminderScheduler';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mount Central API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AF-03 — Career & Skill-Gap Intelligence Agent API',
    endpoints: '/api/health',
    docs: 'See /docs/API_ENDPOINTS.md',
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// Periodic Scheduled Inactivity Reminder Check (runs once a day)
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
if (!process.env.VERCEL) {
  setInterval(() => {
    console.log('[CRON JOB] Running scheduled 7-day inactivity reminder scan...');
    emailReminderScheduler.executeInactivityCheck().catch(err => {
      console.error('[CRON JOB ERROR]', err);
    });
  }, TWENTY_FOUR_HOURS);
}

// Start server locally (on Vercel, this runs as a serverless function)
if (!process.env.VERCEL) {
  app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AF-03 API Server running on port ${ENV.PORT}`);
    console.log(`📡 Base API URL: http://localhost:${ENV.PORT}/api`);
    console.log(`📂 Workspace Storage Root: ${ENV.WORKSPACE_ROOT_PATH}`);
    console.log(`✉️ Email Reminder Provider: ${ENV.EMAIL_PROVIDER}`);
    console.log(`=======================================================`);
  });
}

export default app;
