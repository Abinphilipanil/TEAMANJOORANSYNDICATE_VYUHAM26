import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from apps/api/.env, root .env, and cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  WEB_URL: process.env.WEB_URL || 'http://localhost:5173',
  WORKSPACE_ROOT_PATH: path.resolve(process.env.WORKSPACE_ROOT_PATH || './AF03_Workspace'),
  MAX_DOWNLOAD_FILE_SIZE_MB: parseInt(process.env.MAX_DOWNLOAD_FILE_SIZE_MB || '15', 10),
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'mock',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'notifications@af03-skillgapper.internal',
  INACTIVITY_THRESHOLD_DAYS: parseInt(process.env.INACTIVITY_THRESHOLD_DAYS || '7', 10),

  // AI Provider Configuration (Groq, Claude extension point, or mock)
  AI_PROVIDER: process.env.AI_PROVIDER || 'groq',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  // Currently supported Groq model suitable for high-quality structured JSON output
  // Alternative models: llama-3.1-8b-instant, mixtral-8x7b-32768
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
};
