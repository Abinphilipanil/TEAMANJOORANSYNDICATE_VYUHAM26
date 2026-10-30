import { ENV } from '../config/env';
import { ResumeAnalysisProvider } from './provider.interface';
import { GroqResumeAnalysisAdapter } from './groqAdapter';
import { ClaudeResumeAnalysisAdapter } from './claudeAdapter';

export function getResumeAnalysisProvider(): ResumeAnalysisProvider {
  const providerType = (process.env.AI_PROVIDER || ENV.AI_PROVIDER || 'groq').toLowerCase().trim();

  switch (providerType) {
    case 'claude':
    case 'anthropic':
      return new ClaudeResumeAnalysisAdapter();

    case 'groq':
    default:
      return new GroqResumeAnalysisAdapter();
  }
}
