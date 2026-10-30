import dotenv from 'dotenv';
import path from 'path';

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
};

