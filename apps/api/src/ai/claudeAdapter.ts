import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { ENV } from '../config/env';
import { LLMAnalysisInput, LLMAnalysisOutput, ResumeAnalysisProvider } from './provider.interface';
import { validateLLMAnalysisOutput } from './schema';

/**
 * Robust JSON parser and repair utility for LLM outputs.
 * Repairs trailing commas, markdown code fences, and unescaped characters.
 */
export function safeJsonParse<T = any>(rawText: string): T {
  let cleaned = (rawText || '').trim();

  // Strip markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  cleaned = cleaned.trim();

  // 1. Try standard JSON.parse first
  try {
    return JSON.parse(cleaned);
  } catch (initialErr: any) {
    // 2. Repair common LLM syntax errors
    let repaired = cleaned;

    // Remove trailing commas before closing braces or brackets (e.g. {"a": 1, })
    repaired = repaired.replace(/,\s*([}\]])/g, '$1');

    // Remove single trailing comma at end of object
    repaired = repaired.replace(/,\s*$/g, '');

    // Extract outer JSON object if wrapped in explanatory text
    const firstBrace = repaired.indexOf('{');
    const lastBrace = repaired.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      repaired = repaired.slice(firstBrace, lastBrace + 1).replace(/,\s*([}\]])/g, '$1');
    }

    try {
      return JSON.parse(repaired);
    } catch (secondErr: any) {
      throw new Error(`Failed to parse Claude JSON response: ${initialErr.message} (Raw snippet: "${cleaned.slice(0, 120)}...")`);
    }
  }
}

/**
 * Collaborative Multi-Agent Resume Analysis Adapter
 * Stage 1: Groq fast-reads the resume and extracts verified technical facts into a structured schema.
 * Stage 2: Claude Sonnet 5 executes the strategic agentic workflow (deep fit synthesis, risk evaluation, gap remediation).
 */
export class ClaudeResumeAnalysisAdapter implements ResumeAnalysisProvider {
  public readonly providerName = 'claude';
  private anthropicClient: Anthropic | null = null;
  private groqClient: Groq | null = null;
  private readonly model: string;
  private readonly groqModel: string;
  private readonly timeoutMs: number = 45000;

  constructor(apiKey?: string, model?: string) {
    const anthropicKey = apiKey !== undefined ? apiKey : ENV.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || ENV.GROQ_API_KEY;

    this.model = model || ENV.CLAUDE_MODEL || 'claude-sonnet-5';
    this.groqModel = process.env.GROQ_MODEL || ENV.GROQ_MODEL || 'openai/gpt-oss-120b';

    if (anthropicKey && anthropicKey.trim().length > 0) {
      this.anthropicClient = new Anthropic({ apiKey: anthropicKey.trim() });
    }

    if (groqKey && groqKey.trim().length > 0 && !groqKey.includes('your_groq_api_key')) {
      this.groqClient = new Groq({ apiKey: groqKey.trim() });
    }
  }

  /**
   * Stage 1: Groq Ingestion Agent reads the file and extracts structured facts with native JSON mode.
   */
  private async readAndExtractWithGroq(
    resumeText: string,
    jobDescription: string,
    targetRoleTitle: string
  ): Promise<{ extractedFacts: any; fallbackAnalysis?: LLMAnalysisOutput }> {
    if (!this.groqClient) {
      return {
        extractedFacts: {
          resumeSummary: resumeText.slice(0, 2500),
          jobSummary: jobDescription.slice(0, 1500),
          targetRole: targetRoleTitle,
        },
      };
    }

    try {
      const groqSystemPrompt = `You are a high-speed Document Ingestion and Fact Extraction Agent.
Your job is to read candidate resume text and target job descriptions, extracting strictly verified facts into JSON.
DO NOT hallucinate. Return valid JSON only.`;

      const groqUserPrompt = `Extract key technical facts from this resume and job description for the target role "${targetRoleTitle}".

<candidate_resume>
${resumeText.slice(0, 25000)}
</candidate_resume>

<job_description>
${jobDescription.slice(0, 10000)}
</job_description>

Return JSON matching:
{
  "candidateExperienceYears": number or "unspecified",
  "candidateSkills": [{"name": string, "category": string, "context": string}],
  "jobRequiredSkills": [{"name": string, "category": string, "importance": string}],
  "matchedSkills": [{"name": string, "category": string, "matchType": string, "context": string}],
  "partiallyMatchedSkills": [{"name": string, "category": string, "matchType": "Partial Match", "notes": string}],
  "missingSkills": [{"name": string, "category": string, "priority": "Critical" | "High" | "Medium", "importance": string}],
  "overallScore": number (0-100),
  "matchCategory": string,
  "summary": string,
  "confidenceScore": "High" | "Medium" | "Low",
  "readinessStatus": string,
  "statusLevel": "high" | "moderate" | "early",
  "keyStrength": string,
  "primaryRisk": string,
  "recommendedTimeline": string,
  "strengths": string[],
  "weaknesses": string[],
  "resumeImprovements": [{"id": string, "section": string, "title": string, "description": string}],
  "skillDevelopment": [{"id": string, "skill": string, "timeEstimate": string, "action": string}]
}`;

      const completion = await this.groqClient.chat.completions.create({
        model: this.groqModel,
        messages: [
          { role: 'system', content: groqSystemPrompt },
          { role: 'user', content: groqUserPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 3500,
      });

      const rawContent = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(rawContent);

      let fallbackAnalysis: LLMAnalysisOutput | undefined;
      try {
        fallbackAnalysis = validateLLMAnalysisOutput(parsed);
      } catch (_) {
        // Fallback validation soft failure
      }

      return {
        extractedFacts: {
          candidateExperienceYears: parsed.candidateExperienceYears,
          candidateSkills: parsed.candidateSkills || [],
          jobRequiredSkills: parsed.jobRequiredSkills || [],
          matchedSkills: parsed.matchedSkills || parsed.preliminaryMatchedSkills || [],
          partiallyMatchedSkills: parsed.partiallyMatchedSkills || [],
          missingSkills: parsed.missingSkills || parsed.preliminaryMissingSkills || [],
        },
        fallbackAnalysis,
      };
    } catch (err: any) {
      console.warn(`[Agentic Pipeline] Groq ingestion note: ${err.message}. Proceeding with direct resume text.`);
      return {
        extractedFacts: {
          resumeSummary: resumeText.slice(0, 3000),
          jobSummary: jobDescription.slice(0, 1500),
          targetRole: targetRoleTitle,
        },
      };
    }
  }

  public async analyzeResume(input: LLMAnalysisInput): Promise<LLMAnalysisOutput> {
    if (!this.anthropicClient) {
      throw new Error(
        'ANTHROPIC_API_KEY is not configured in the backend environment. ' +
        'Please set ANTHROPIC_API_KEY in apps/api/.env to use Claude.'
      );
    }

    if (!input.resumeText || input.resumeText.trim().length < 15) {
      throw new Error('Resume content is empty or contains insufficient text for analysis.');
    }

    if (!input.jobDescription || input.jobDescription.trim().length < 20) {
      throw new Error('Job description is too short for meaningful skill extraction.');
    }

    const sanitizedResume = input.resumeText.slice(0, 35000);
    const sanitizedJob = input.jobDescription.slice(0, 12000);
    const targetRole = input.targetRoleTitle || 'Target Position';

    // Step 1: Groq reads and extracts verified candidate facts
    const { extractedFacts, fallbackAnalysis } = await this.readAndExtractWithGroq(
      sanitizedResume,
      sanitizedJob,
      targetRole
    );

    // If Anthropic is not configured, return Groq's verified analysis directly
    if (!this.anthropicClient) {
      if (fallbackAnalysis) return fallbackAnalysis;
      throw new Error(
        'ANTHROPIC_API_KEY is not configured in the backend environment. ' +
        'Please set ANTHROPIC_API_KEY in apps/api/.env to use Claude.'
      );
    }

    // Step 2: Claude Sonnet 5 executes the strategic agentic workflow
    const systemPrompt = `You are CareerAgent AI, an elite strategic career intelligence engine powered by Claude Sonnet 5.
You work in collaboration with a fast document reader agent.
You have been provided with:
1. Structured candidate facts extracted by the reader agent.
2. The candidate's raw resume and target job description.

YOUR AGENTIC MISSION:
Perform deep reasoning on qualification alignment, hiring risk, and personalized career elevation.
CRITICAL FORMATTING INSTRUCTIONS:
- Return strictly a valid, standard JSON object.
- Never output markdown text before or after the JSON.
- DO NOT leave trailing commas before closing braces '}' or brackets ']'.
- Ensure all property names and strings are enclosed in standard double quotes.

Output Schema:
{
  "overallScore": number (0 to 100),
  "matchCategory": string,
  "summary": string (2-3 sentences explaining overall strategic fit),
  "confidenceScore": "High" | "Medium" | "Low",
  "readinessStatus": string,
  "statusLevel": "high" | "moderate" | "early",
  "keyStrength": string (1-2 sentences highlighting key candidate advantage),
  "primaryRisk": string (1-2 sentences on primary missing qualification or risk),
  "recommendedTimeline": string,
  "matchedSkills": [
    {
      "name": string,
      "category": string,
      "matchType": string,
      "context": string
    }
  ],
  "partiallyMatchedSkills": [
    {
      "name": string,
      "category": string,
      "matchType": "Partial Match",
      "notes": string
    }
  ],
  "missingSkills": [
    {
      "name": string,
      "category": string,
      "priority": "Critical" | "High" | "Medium",
      "importance": string
    }
  ],
  "strengths": string[],
  "weaknesses": string[],
  "resumeImprovements": [
    {
      "id": string,
      "section": string,
      "title": string,
      "description": string
    }
  ],
  "skillDevelopment": [
    {
      "id": string,
      "skill": string,
      "timeEstimate": string,
      "action": string
    }
  ]
}`;

    const userPrompt = `Target Role: "${targetRole}"
Resume File: "${input.resumeFileName || 'Resume.pdf'}"

--- STAGE 1 EXTRACTED FACTS (FROM INGESTION AGENT) ---
${JSON.stringify(extractedFacts, null, 2)}
--- END EXTRACTED FACTS ---

--- CANDIDATE RESUME ---
${sanitizedResume.slice(0, 15000)}
--- END RESUME ---

--- TARGET JOB DESCRIPTION ---
${sanitizedJob.slice(0, 8000)}
--- END JOB DESCRIPTION ---

Synthesize these findings into the requested JSON schema. Ensure valid RFC 8259 JSON syntax without trailing commas.`;

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.anthropicClient.messages.create(
        {
          model: this.model,
          max_tokens: 5000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutHandle);

      const textBlock = response.content.find((b) => b.type === 'text');
      const rawText = textBlock && 'text' in textBlock ? textBlock.text : '';

      if (!rawText || rawText.trim().length === 0) {
        throw new Error('Claude Sonnet 5 returned an empty text block.');
      }

      // Safe parse with trailing comma repair and sanitization
      const parsedJson = safeJsonParse(rawText);
      return validateLLMAnalysisOutput(parsedJson);
    } catch (claudeErr: any) {
      clearTimeout(timeoutHandle);
      console.warn(`[Agentic Pipeline] Claude analysis notice: ${claudeErr.message}`);

      // If Claude parsing or request failed, seamlessly fall back to Groq reader extraction
      if (fallbackAnalysis) {
        console.log('[Agentic Pipeline] Seamlessly serving verified Groq extraction fallback.');
        return fallbackAnalysis;
      }

      throw new Error(`Claude analysis failed: ${claudeErr.message}`);
    }
  }
}
