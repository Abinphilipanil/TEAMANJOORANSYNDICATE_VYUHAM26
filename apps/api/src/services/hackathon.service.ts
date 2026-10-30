import fs from 'fs';
import path from 'path';

export interface HackathonTimeline {
  original?: string;
  start_date?: string;
  end_date?: string;
  duration_days?: number;
}

export interface HackathonItem {
  id: number | string;
  title: string;
  organizer: string;
  platform?: string;
  url: string;
  status: string;
  matched_domains: string[];
  themes?: string[];
  location?: string;
  submission_timeline?: HackathonTimeline;
  registrations?: number;
  competition_level?: string;
  prize_pool?: string;
  invite_only?: boolean;
}

export interface HackathonsPayload {
  source: string;
  candidate_domains: string[];
  retrieved_count: number;
  matched_count: number;
  filters: Record<string, any>;
  hackathons: HackathonItem[];
}

export interface HackathonSummary {
  success: boolean;
  candidate_domains: string[];
  retrieved_count: number;
  matched_count: number;
  highly_competitive_count: number;
  moderately_competitive_count: number;
}

function resolveDataFilePath(): string {
  const candidatePaths = [
    path.join(__dirname, '..', 'data', 'hackathons.json'),
    path.join(__dirname, 'data', 'hackathons.json'),
    path.join(process.cwd(), 'apps', 'api', 'src', 'data', 'hackathons.json'),
    path.join(process.cwd(), 'src', 'data', 'hackathons.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback to primary relative location
  return path.join(__dirname, '..', 'data', 'hackathons.json');
}

export function readHackathonData(): HackathonsPayload {
  const filePath = resolveDataFilePath();

  if (!fs.existsSync(filePath)) {
    const err: any = new Error('Hackathon recommendation data file is not available on this server.');
    err.status = 503;
    throw err;
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err: any) {
    const parseErr: any = new Error(`Hackathon recommendation dataset is unreadable: ${err.message}`);
    parseErr.status = 500;
    throw parseErr;
  }
}

export function getHackathons(filters: { domain?: string; search?: string } = {}) {
  const data = readHackathonData();
  let hackathons = Array.isArray(data.hackathons) ? data.hackathons : [];

  const domain = typeof filters.domain === 'string' ? filters.domain.trim() : '';
  const search = typeof filters.search === 'string' ? filters.search.trim() : '';

  if (domain && domain.toLowerCase() !== 'all') {
    const targetDomain = domain.toLowerCase();
    hackathons = hackathons.filter((h) =>
      Array.isArray(h.matched_domains) &&
      h.matched_domains.some((d) => typeof d === 'string' && d.toLowerCase() === targetDomain)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    hackathons = hackathons.filter((h) => {
      const haystack = [
        h.title,
        h.organizer,
        h.location,
        ...(Array.isArray(h.themes) ? h.themes : []),
        ...(Array.isArray(h.matched_domains) ? h.matched_domains : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return {
    success: true,
    source: data.source || 'Devpost',
    candidate_domains: Array.isArray(data.candidate_domains) ? data.candidate_domains : [],
    retrieved_count: Number(data.retrieved_count) || hackathons.length,
    matched_count: hackathons.length,
    filters: {
      ...(data.filters || {}),
      ...(domain ? { domain } : {}),
      ...(search ? { search } : {}),
    },
    hackathons,
  };
}

export function getHackathonSummary(): HackathonSummary {
  const data = readHackathonData();
  const hackathons = Array.isArray(data.hackathons) ? data.hackathons : [];

  const highlyCompetitive = hackathons.filter(
    (event) => event.competition_level === 'Highly Competitive'
  ).length;

  const moderatelyCompetitive = hackathons.filter(
    (event) => event.competition_level === 'Moderately Competitive'
  ).length;

  return {
    success: true,
    candidate_domains: Array.isArray(data.candidate_domains) ? data.candidate_domains : [],
    retrieved_count: Number(data.retrieved_count) || hackathons.length,
    matched_count: Number(data.matched_count) || hackathons.length,
    highly_competitive_count: highlyCompetitive,
    moderately_competitive_count: moderatelyCompetitive,
  };
}

export const hackathonService = {
  getHackathons,
  getHackathonSummary,
  readHackathonData,
};

export default hackathonService;
