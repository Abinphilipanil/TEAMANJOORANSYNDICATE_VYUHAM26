import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

import { careersRepository } from '../src/repositories/careers.repo';
import { profileExtractor } from '../src/agent/extractor';
import { skillGapAnalyzer } from '../src/agent/gapAnalyzer';
import { readinessService } from '../src/services/readiness.service';
import { roadmapGenerator } from '../src/agent/roadmapGenerator';
import { workspaceTool } from '../src/tools/workspaceTool';
import { progressService } from '../src/services/progress.service';
import { emailReminderScheduler } from '../src/jobs/emailReminderScheduler';
import { userRepository } from '../src/repositories/user.repo';
import { roadmapRepository } from '../src/repositories/roadmap.repo';

test('Careers Repository - returns default tech roles and handles search and custom roles', () => {
  const all = careersRepository.getAll();
  assert.ok(all.length >= 5, 'Should have at least 5 default roles');

  const fsd = careersRepository.findByIdOrSlug('full-stack-developer');
  assert.ok(fsd, 'Full-Stack Developer role should exist');
  assert.strictEqual(fsd?.title, 'Full-Stack Developer');

  const searchResults = careersRepository.search('React');
  assert.ok(searchResults.length >= 1, 'Should find roles with React');

  const customRole = careersRepository.addCustomRole({
    title: 'Robotics Software Architect',
    domain: 'Embedded & Systems',
    description: 'Autonomous ROS2 robot architecture.',
  });
  assert.strictEqual(customRole.title, 'Robotics Software Architect');
  assert.strictEqual(customRole.isCustomRole, true);
});

test('Skill Normalizer and Profile Extractor - extracts canonical skills and evidence', () => {
  const profileText = 'Built enterprise fullstack apps with React.js, Node.js, Express, and PostgreSQL.';
  const extracted = profileExtractor.extract({ profileText });

  const skillNames = extracted.map(e => e.skillName.toLowerCase());
  assert.ok(skillNames.includes('react.js') || skillNames.includes('react'), 'Should extract React');
  assert.ok(skillNames.includes('node.js & express'), 'Should extract Node/Express');
  assert.ok(skillNames.includes('postgresql'), 'Should extract PostgreSQL');
});

test('Skill Gap Analyzer - classifies possessed, partially developed, and missing skills', () => {
  const fsd = careersRepository.findByIdOrSlug('full-stack-developer')!;
  const userSkills = profileExtractor.extract({
    profileText: 'I know JavaScript and React.js very well.',
  });

  const gaps = skillGapAnalyzer.analyzeGaps(fsd, userSkills);
  assert.ok(gaps.length > 0, 'Should generate gap analysis');

  const jsGap = gaps.find(g => g.skillName.toLowerCase().includes('javascript'));
  assert.ok(jsGap, 'JavaScript gap should be evaluated');

  const dockerGap = gaps.find(g => g.skillName.toLowerCase().includes('docker'));
  assert.ok(dockerGap, 'Docker gap should be evaluated');
  assert.strictEqual(dockerGap?.status, 'missing');
});

test('Readiness Service - calculates explainable readiness score within [0, 100]', () => {
  const fsd = careersRepository.findByIdOrSlug('full-stack-developer')!;
  const userSkills = profileExtractor.extract({
    profileText: 'Experienced with JavaScript, React.js, Node.js, and PostgreSQL.',
  });
  const gaps = skillGapAnalyzer.analyzeGaps(fsd, userSkills);

  const readiness = readinessService.calculateReadiness(fsd, gaps, userSkills);
  assert.ok(readiness.overallScorePercentage >= 15 && readiness.overallScorePercentage <= 100);
  assert.ok(readiness.scoringBreakdown.coreSkillsPossessedCount >= 1);
  assert.ok(readiness.readinessSummary.length > 20);
});

test('Roadmap Generator - creates weekly milestones and actionable items', () => {
  const fsd = careersRepository.findByIdOrSlug('full-stack-developer')!;
  const userSkills = profileExtractor.extract({
    profileText: 'Basic JavaScript developer.',
  });
  const gaps = skillGapAnalyzer.analyzeGaps(fsd, userSkills);

  const roadmap = roadmapGenerator.generate(
    'test-user-1',
    fsd,
    gaps,
    {
      learningPace: 'moderate',
      hoursPerWeek: 12,
      budget: 0,
      currency: 'INR',
      targetWeeks: 8,
      preferredLearningFormats: ['documentation', 'project'],
      preferredLocation: 'Remote',
    },
    45
  );

  assert.strictEqual(roadmap.totalWeeks, 8);
  assert.strictEqual(roadmap.weeklyHoursPlanned, 12);
  assert.strictEqual(roadmap.weeklyMilestones.length, 8);
  assert.ok(roadmap.weeklyMilestones[0].items.length > 0);
  assert.ok(roadmap.summaryRationale.includes('Personalized roadmap generated'));
});

test('Workspace Tool - creates real directory structure safely on disk', () => {
  const fsd = careersRepository.findByIdOrSlug('full-stack-developer')!;
  const gaps = skillGapAnalyzer.analyzeGaps(fsd, []);
  const roadmap = roadmapGenerator.generate(
    'test-user-2',
    fsd,
    gaps,
    {
      learningPace: 'fast',
      hoursPerWeek: 15,
      budget: 0,
      currency: 'INR',
      targetWeeks: 6,
      preferredLearningFormats: ['documentation'],
      preferredLocation: 'Remote',
    },
    50
  );

  const workspace = workspaceTool.createWorkspaceForRoadmap(roadmap);
  assert.ok(workspace.totalFoldersCount >= 5, 'Should create skill folders');
  assert.strictEqual(workspace.status, 'created_on_disk');

  const diskRoot = path.resolve('./AF03_Workspace', workspace.targetRoleSlug);
  assert.ok(fs.existsSync(diskRoot), 'Workspace folder must physically exist on server disk');
});

test('Progress Service - updates task completion, records proof, and recalculates readiness', () => {
  const fsd = careersRepository.findByIdOrSlug('full-stack-developer')!;
  const gaps = skillGapAnalyzer.analyzeGaps(fsd, []);
  const roadmap = roadmapGenerator.generate(
    'test-user-3',
    fsd,
    gaps,
    {
      learningPace: 'moderate',
      hoursPerWeek: 10,
      budget: 0,
      currency: 'INR',
      targetWeeks: 4,
      preferredLearningFormats: ['project'],
      preferredLocation: 'Remote',
    },
    50
  );
  roadmapRepository.save(roadmap);

  const targetItem = roadmap.weeklyMilestones[0].items[0];
  const updateRes = progressService.updateItemProgress({
    roadmapId: roadmap.id,
    itemId: targetItem.id,
    isCompleted: true,
    proofUrl: 'https://github.com/test-user/my-completed-project',
    proofNotes: 'Unit tests passing with 95% branch coverage',
    selfAssessedLevel: 'intermediate',
  });

  assert.strictEqual(updateRes.success, true);
  assert.ok(updateRes.updatedReadinessScore > 50, 'Readiness score should increase upon verified completion');
  assert.ok(updateRes.updatedOverallProgress > 0, 'Overall progress should increase');

  const history = progressService.getHistory(roadmap.id);
  assert.strictEqual(history.length, 1);
  assert.strictEqual(history[0].practicalProofUrl, 'https://github.com/test-user/my-completed-project');
});

test('Email Reminder Scheduler - executes 7-day inactivity scan without errors', async () => {
  // Seed an inactive user
  userRepository.save({
    id: 'inactive-user-1',
    fullName: 'Inactive Candidate',
    email: 'inactive@example.com',
    detectedSkills: [],
    preferences: {
      learningPace: 'moderate',
      hoursPerWeek: 10,
      budget: 0,
      currency: 'INR',
      targetWeeks: 12,
      preferredLearningFormats: ['documentation'],
      preferredLocation: 'Remote',
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastActiveAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days inactive
  });

  const jobResult = await emailReminderScheduler.executeInactivityCheck(7);
  assert.ok(jobResult.usersChecked >= 1);
  assert.ok(jobResult.remindersMocked >= 1, 'Should trigger mock email for inactive user');
});
