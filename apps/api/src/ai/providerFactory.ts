import { ENV } from '../config/env';
import { ResumeAnalysisProvider } from './provider.interface';
import { GroqResumeAnalysisAdapter } from './groqAdapter';
import { ClaudeResumeAnalysisAdapter } from './claudeAdapter';

export function getResumeAnalysisProvider(): ResumeAnalysisProvider {
  const providerType = (process.env.AI_PROVIDER || ENV.AI_PROVIDER || '').toLowerCase().trim();

  if (providerType === 'claude' || providerType === 'anthropic') {
    return new ClaudeResumeAnalysisAdapter();
  }

  if (providerType === 'groq') {
    return new GroqResumeAnalysisAdapter();
  }

  // Auto-detect: prioritize Claude Sonnet 5 when ANTHROPIC_API_KEY is present
  const anthropicKey = process.env.ANTHROPIC_API_KEY || ENV.ANTHROPIC_API_KEY;
  if (anthropicKey && anthropicKey.trim().length > 0) {
    return new ClaudeResumeAnalysisAdapter();
  }

  return new GroqResumeAnalysisAdapter();
}
