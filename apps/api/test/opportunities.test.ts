import test from 'node:test';
import assert from 'node:assert';
import { opportunitiesRepository } from '../src/repositories/opportunities.repo';

test('OpportunitiesRepository - returns opportunities with valid URLs and metadata', async () => {
  const result = await opportunitiesRepository.filterWithLiveMatching({ live: false });
  assert.ok(Array.isArray(result), 'Expected opportunities array');
  assert.ok(result.length > 0, 'Expected at least one opportunity');

  const first = result[0];
  assert.ok(first.title, 'Opportunity must have a title');
  assert.ok(first.url.startsWith('https://'), 'Opportunity URL must start with https://');
  assert.ok(first.type, 'Opportunity must have a type');
});

test('OpportunitiesRepository - personalizes opportunities when user skills are provided', async () => {
  const userSkills = ['React.js', 'Node.js & Express', 'Python'];
  const result = await opportunitiesRepository.filterWithLiveMatching({
    skills: userSkills,
    live: false,
  });

  assert.ok(result.length > 0, 'Expected opportunities');
  // At least one opportunity should receive AI recommendation or skill personalization
  const personalized = result.find((o) => o.aiRecommendation || o.matchScore);
  assert.ok(personalized, 'Expected at least one personalized opportunity');
  if (personalized?.aiRecommendation) {
    assert.ok(typeof personalized.aiRecommendation === 'string');
    assert.ok(personalized.aiRecommendation.length > 10);
  }
});

test('OpportunitiesRepository - filters by opportunity type', async () => {
  const result = await opportunitiesRepository.filterWithLiveMatching({
    type: 'hackathon',
    live: false,
  });

  assert.ok(result.length > 0, 'Expected hackathons');
  for (const opp of result) {
    assert.strictEqual(opp.type, 'hackathon');
  }
});

test('OpportunitiesRepository - returns conferences with valid official URLs and metadata', async () => {
  const result = await opportunitiesRepository.filterWithLiveMatching({
    type: 'conference',
    live: false,
  });

  assert.ok(result.length > 0, 'Expected conferences to be returned');
  for (const conf of result) {
    assert.strictEqual(conf.type, 'conference');
    assert.ok(conf.title, 'Conference must have title');
    assert.ok(conf.url.startsWith('https://'), `Conference URL ${conf.url} must start with https://`);
    assert.ok(conf.organization, 'Conference must have organization');
  }

  // Verify remote conference filter works seamlessly
  const remoteConfs = await opportunitiesRepository.filterWithLiveMatching({
    type: 'conference',
    location: 'Remote',
    live: false,
  });
  assert.ok(remoteConfs.length > 0, 'Expected remote/virtual conferences');

  // Verify role matching works seamlessly
  const roleConfs = await opportunitiesRepository.filterWithLiveMatching({
    type: 'conference',
    targetRole: 'Full-Stack Developer',
    live: false,
  });
  assert.ok(roleConfs.length > 0, 'Expected conferences for Full-Stack Developer');
});

