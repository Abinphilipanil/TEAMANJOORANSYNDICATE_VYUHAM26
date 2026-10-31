import test from 'node:test';
import assert from 'node:assert';
import { GroqResumeAnalysisAdapter } from '../src/ai/groqAdapter';
import { ClaudeResumeAnalysisAdapter } from '../src/ai/claudeAdapter';
import { getResumeAnalysisProvider } from '../src/ai/providerFactory';
import { validateLLMAnalysisOutput, LLMAnalysisOutputSchema } from '../src/ai/schema';
import { pdfExtractor } from '../src/tools/pdfExtractor';
import { agentOrchestrator } from '../src/agent/orchestrator';

test('GroqResumeAnalysisAdapter - throws clear error when GROQ_API_KEY is missing', async () => {
  // Instantiate adapter with explicit empty key
  const adapter = new GroqResumeAnalysisAdapter('');
  
  await assert.rejects(
    async () => {
      await adapter.analyzeResume({
        resumeText: 'Alex Rivera, full stack engineer with 5 years in React and Node.js.',
        jobDescription: 'Looking for a Senior Full Stack Engineer with React and Node experience.',
      });
    },
    (err: Error) => {
      assert.ok(
        err.message.includes('GROQ_API_KEY is not configured'),
        `Expected error message to mention GROQ_API_KEY, got: ${err.message}`
      );
      return true;
    }
  );
});

test('GroqResumeAnalysisAdapter - rejects too short resume or job description', async () => {
  const adapter = new GroqResumeAnalysisAdapter('dummy-key');

  await assert.rejects(
    async () => {
      await adapter.analyzeResume({
        resumeText: 'Too short',
        jobDescription: 'Looking for a Senior Full Stack Engineer with React and Node experience.',
      });
    },
    (err: Error) => {
      assert.ok(err.message.includes('insufficient text'), `Expected insufficient text error, got: ${err.message}`);
      return true;
    }
  );

  await assert.rejects(
    async () => {
      await adapter.analyzeResume({
        resumeText: 'Alex Rivera, software engineer with 5 years experience in building web applications.',
        jobDescription: 'Short',
      });
    },
    (err: Error) => {
      assert.ok(err.message.includes('too short'), `Expected too short error, got: ${err.message}`);
      return true;
    }
  );
});

test('LLMAnalysisOutputSchema - successfully validates realistic structured AI response', () => {
  const mockAiOutput = {
    overallScore: 82,
    matchCategory: 'Strong Match',
    summary: 'Candidate exhibits high alignment with core frontend and backend requirements.',
    confidenceScore: 'High',
    readinessStatus: 'Interview Ready',
    statusLevel: 'high',
    keyStrength: 'Demonstrated mastery in modern React patterns and REST API architecture.',
    primaryRisk: 'Limited documented experience in Kubernetes and production CI/CD pipelines.',
    recommendedTimeline: '2 to 3 weeks of targeted DevOps preparation.',
    matchedSkills: [
      {
        name: 'React.js',
        category: 'Frontend',
        matchType: 'Exact Match',
        context: 'Built 3 scalable frontend systems',
      },
      {
        name: 'Node.js',
        category: 'Backend',
        matchType: 'Exact Match',
        context: 'Architected microservices with Express',
      },
    ],
    partiallyMatchedSkills: [
      {
        name: 'Docker',
        category: 'DevOps',
        matchType: 'Partial Match',
        notes: 'Container basics used, but lacks registry publishing',
      },
    ],
    missingSkills: [
      {
        name: 'Kubernetes',
        category: 'DevOps',
        priority: 'Critical',
        importance: 'Mandatory for cluster workload deployment',
      },
    ],
    strengths: ['Modern JavaScript/TypeScript', 'RESTful API Design'],
    weaknesses: ['Kubernetes cluster management'],
    resumeImprovements: [
      {
        id: 'r1',
        section: 'Work Experience',
        title: 'Add metrics to backend achievements',
        description: 'Quantify latency reduction on REST endpoints.',
      },
    ],
    skillDevelopment: [
      {
        id: 's1',
        skill: 'Kubernetes',
        timeEstimate: '10 hours',
        action: 'Deploy a multi-pod application on local Minikube.',
      },
    ],
  };

  const validated = validateLLMAnalysisOutput(mockAiOutput);
  assert.strictEqual(validated.overallScore, 82);
  assert.strictEqual(validated.matchedSkills.length, 2);
  assert.strictEqual(validated.partiallyMatchedSkills.length, 1);
  assert.strictEqual(validated.missingSkills.length, 1);
  assert.strictEqual(validated.resumeImprovements.length, 1);
});

test('LLMAnalysisOutputSchema - catches invalid schema and malformed output safely', () => {
  const malformed = {
    overallScore: 'not-a-number-and-cannot-parse',
    summary: '',
  };

  assert.throws(
    () => {
      validateLLMAnalysisOutput(malformed);
    },
    (err: Error) => {
      assert.ok(err.message.includes('LLM output validation failed'));
      return true;
    }
  );
});

test('ClaudeResumeAnalysisAdapter - extension point validates interface and requirements', async () => {
  const adapter = new ClaudeResumeAnalysisAdapter('');
  assert.strictEqual(adapter.providerName, 'claude');

  await assert.rejects(
    async () => {
      await adapter.analyzeResume({
        resumeText: 'Alex Rivera, full stack engineer',
        jobDescription: 'Job description text here',
      });
    },
    (err: Error) => {
      assert.ok(err.message.includes('ANTHROPIC_API_KEY is not configured'));
      return true;
    }
  );
});

test('ProviderFactory - returns configured AI provider (claude or groq)', () => {
  const provider = getResumeAnalysisProvider();
  assert.ok(provider);
  assert.ok(['claude', 'groq'].includes(provider.providerName));
  // When AI_PROVIDER is claude, providerName must be claude
  if (process.env.AI_PROVIDER === 'claude') {
    assert.strictEqual(provider.providerName, 'claude');
  }
});

test('PdfExtractor - extracts text from buffer and handles non-PDF fallback cleanly', async () => {
  const textBuffer = Buffer.from(
    'Alex Rivera\nSenior Software Engineer\nSkills: TypeScript, React, Node.js, GraphQL, Docker'
  );

  const doc = await pdfExtractor.extractText(textBuffer, 'Alex_Rivera_Resume.txt');
  assert.ok(doc.text.includes('Alex Rivera'));
  assert.ok(doc.text.includes('TypeScript'));
  assert.strictEqual(doc.isPdf, false);
  assert.ok(doc.wordCount >= 10);
});

test('PdfExtractor - handles empty buffer safely', async () => {
  const doc = await pdfExtractor.extractText(Buffer.from(''));
  assert.strictEqual(doc.text, '');
  assert.strictEqual(doc.wordCount, 0);
  assert.strictEqual(doc.isPdf, false);
});

test('AgentOrchestrator - mock mode generates complete analysisResult with isPrototypeData', async () => {
  process.env.AI_PROVIDER = 'mock';

  const res = await agentOrchestrator.analyzeCareerJourney({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    profileText: 'Experienced with React, Node, and SQL.',
    jobDescription: 'Looking for a Senior Full Stack Engineer.',
    resumeFileName: 'Jane_Resume.pdf',
    resumeBase64: Buffer.from('Jane Doe\nReact, Node, PostgreSQL developer.').toString('base64'),
    preferences: {
      learningPace: 'moderate',
      hoursPerWeek: 10,
      budget: 0,
      currency: 'INR',
      targetWeeks: 12,
      preferredLearningFormats: ['project'],
      preferredLocation: 'Remote',
    },
  });

  assert.ok(res.success);
  assert.ok(res.analysisResult);
  assert.strictEqual(res.analysisResult?.isPrototypeData, true);
  assert.ok(res.analysisResult.overallMatch.score > 0);
  assert.ok(res.analysisResult.skillsBreakdown.matched.length > 0);
  assert.ok(res.roadmap);

  // Reset provider to groq
  process.env.AI_PROVIDER = 'groq';
});

