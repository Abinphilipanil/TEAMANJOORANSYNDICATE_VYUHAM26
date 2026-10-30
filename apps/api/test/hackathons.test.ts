import test from 'node:test';
import assert from 'node:assert';
import { hackathonService } from '../src/services/hackathon.service';

test('HackathonService - returns hackathon list with active status and domains', async () => {
  const result = hackathonService.getHackathons();
  assert.ok(Array.isArray(result.hackathons), 'Expected hackathons array');
  assert.ok(result.hackathons.length > 0, 'Expected hackathons in list');
  assert.ok(result.candidate_domains.length > 0, 'Expected candidate domains list');

  const first = result.hackathons[0];
  assert.ok(first.title, 'Hackathon must have a title');
  assert.ok(first.url.startsWith('https://'), 'Hackathon URL must be https');
  assert.ok(['open', 'active', 'upcoming'].includes(first.status), `Status must be valid, got ${first.status}`);
});

test('HackathonService - filters by domain', async () => {
  const result = hackathonService.getHackathons({ domain: 'Computer Vision' });
  assert.strictEqual(result.filters.domain, 'Computer Vision');
  assert.ok(result.hackathons.length > 0, 'Expected at least one Computer Vision hackathon');
  for (const h of result.hackathons) {
    const hasDomain = h.matched_domains.some((d: string) => d.toLowerCase() === 'computer vision');
    assert.ok(hasDomain, `Hackathon ${h.title} should have Computer Vision domain`);
  }
});

test('HackathonService - filters by search query', async () => {
  const result = hackathonService.getHackathons({ search: 'agent' });
  assert.strictEqual(result.filters.search, 'agent');
  for (const h of result.hackathons) {
    const matches =
      h.title.toLowerCase().includes('agent') ||
      (h.organizer && h.organizer.toLowerCase().includes('agent')) ||
      (h.matched_domains && h.matched_domains.some((d: string) => d.toLowerCase().includes('agent')));
    assert.ok(matches, `Hackathon ${h.title} should match 'agent'`);
  }
});

test('HackathonService - returns summary statistics', async () => {
  const summary = hackathonService.getHackathonSummary();
  assert.ok(summary.success);
  assert.ok(summary.retrieved_count > 0);
  assert.ok(summary.matched_count > 0);
  assert.ok(Array.isArray(summary.candidate_domains));
  assert.ok(summary.candidate_domains.length > 0);
  assert.ok(typeof summary.highly_competitive_count === 'number');
});
