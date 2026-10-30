import { ENV } from '../config/env';
import { LLMAnalysisInput, LLMAnalysisOutput, ResumeAnalysisProvider } from './provider.interface';

/**
 * Claude / Anthropic Resume Analysis Adapter (Extension Point)
 * 
 * To activate Claude in production:
 * 1. Install `@anthropic-ai/sdk` (`npm i @anthropic-ai/sdk --workspace=apps/api`)
 * 2. Set `AI_PROVIDER=claude` and `ANTHROPIC_API_KEY=sk-ant-...` in `apps/api/.env`
 * 3. Uncomment the Anthropic SDK client below.
 */
export class ClaudeResumeAnalysisAdapter implements ResumeAnalysisProvider {
  public readonly providerName = 'claude';
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || ENV.ANTHROPIC_API_KEY;
    this.model = model || ENV.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
  }

  public async analyzeResume(input: LLMAnalysisInput): Promise<LLMAnalysisOutput> {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error(
        'ANTHROPIC_API_KEY is not configured in the backend environment. ' +
        'Please set ANTHROPIC_API_KEY in apps/api/.env to use Claude.'
      );
    }

    // Extension point ready for Anthropic Messages API:
    // const anthropic = new Anthropic({ apiKey: this.apiKey });
    // const message = await anthropic.messages.create({ ... });
    throw new Error(
      'Claude adapter extension point is prepared. ' +
      'Please install @anthropic-ai/sdk to enable native Anthropic execution.'
    );
  }
}

