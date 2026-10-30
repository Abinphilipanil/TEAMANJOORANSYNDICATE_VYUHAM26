import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Sparkles, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { apiClient } from '../api/client';
import './HackathonsPage.css';

interface HackathonTimeline {
  original?: string;
  start_date?: string;
  end_date?: string;
  duration_days?: number;
}

interface HackathonItem {
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

interface HackathonsResponse {
  success: boolean;
  source: string;
  candidate_domains: string[];
  retrieved_count: number;
  matched_count: number;
  filters?: Record<string, any>;
  hackathons: HackathonItem[];
}

interface HackathonSummaryResponse {
  success: boolean;
  candidate_domains: string[];
  retrieved_count: number;
  matched_count: number;
  highly_competitive_count: number;
  moderately_competitive_count: number;
}

function formatRegistrations(value?: number): string {
  return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
}

const Detail: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="hack-detail">
    <span className="hack-detail__label">{label}</span>
    <span className="hack-detail__value">{value || 'Not specified'}</span>
  </div>
);

const TagGroup: React.FC<{ title: string; items?: string[] }> = ({ title, items }) => {
  if (!items?.length) return null;

  return (
    <div className="hack-tag-section">
      <p className="hack-tag-section__title">{title}</p>
      <div className="hack-tags">
        {items.map((item) => (
          <span className="hack-tag" key={`${title}-${item}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const HackathonCard: React.FC<{ hackathon: HackathonItem }> = ({ hackathon }) => {
  const timeline = hackathon.submission_timeline ?? {};
  const status = (hackathon.status || 'unknown').toLowerCase();
  const dateRange =
    timeline.original ||
    [timeline.start_date, timeline.end_date].filter(Boolean).join(' – ') ||
    'Not specified';
  const duration = Number.isFinite(Number(timeline.duration_days))
    ? `${timeline.duration_days} days`
    : 'Not specified';

  return (
    <article className="hack-card">
      <div className="hack-card__top">
        <span className={`hack-status hack-status--${status}`}>
          {status.replace(/_/g, ' ')}
        </span>
        <span className="hack-card__platform">
          {hackathon.platform || 'Hackathon'}
        </span>
      </div>

      <div className="hack-card__heading">
        <h2>{hackathon.title}</h2>
        <p>Organized by {hackathon.organizer?.trim() || 'Unknown organizer'}</p>
      </div>

      <div className="hack-prize-row">
        <div>
          <span className="hack-mini-label">Prize pool</span>
          <strong className="hack-prize">
            {hackathon.prize_pool || 'Not listed'}
          </strong>
        </div>
        {hackathon.competition_level && (
          <span className="hack-competition">
            {hackathon.competition_level}
          </span>
        )}
      </div>

      <div className="hack-details">
        <Detail label="Submission window" value={dateRange} />
        <Detail label="Location" value={hackathon.location} />
        <Detail label="Duration" value={duration} />
        <Detail label="Invite only" value={hackathon.invite_only ? 'Yes' : 'No'} />
      </div>

      <TagGroup title="Matched domains" items={hackathon.matched_domains} />
      <TagGroup title="Themes" items={hackathon.themes} />

      <div className="hack-card__footer">
        <span className="hack-registrations">
          <strong>{formatRegistrations(hackathon.registrations)}</strong>
          {' registrations'}
        </span>
        {hackathon.url ? (
          <a
            className="hack-view-link"
            href={hackathon.url}
            target="_blank"
            rel="noreferrer"
          >
            <span>View hackathon</span>
            <ExternalLink className="w-3.5 h-3.5 inline-icon" />
          </a>
        ) : (
          <span className="hack-view-link hack-view-link--disabled">
            Link unavailable
          </span>
        )}
      </div>
    </article>
  );
};

export const HackathonsPage: React.FC = () => {
  const [data, setData] = useState<HackathonsResponse | null>(null);
  const [summary, setSummary] = useState<HackathonSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [hackathonsResponse, summaryResponse] = await Promise.all([
          apiClient.getHackathons(),
          apiClient.getHackathonSummary().catch(() => null),
        ]);

        if (!ignore) {
          setData(hackathonsResponse);
          if (summaryResponse) {
            setSummary(summaryResponse);
          }
          setError(null);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || 'Failed to load hackathon recommendations.');
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const hackathons = useMemo(
    () => (Array.isArray(data?.hackathons) ? data.hackathons : []),
    [data]
  );

  const domains = useMemo(() => {
    if (Array.isArray(data?.candidate_domains) && data.candidate_domains.length > 0) {
      return [...data.candidate_domains].sort((a, b) => a.localeCompare(b));
    }
    return [...new Set(hackathons.flatMap((item) => item.matched_domains ?? []))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [data, hackathons]);

  const filteredHackathons = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return hackathons.filter((item) => {
      const matchesDomain =
        selectedDomain === 'all' ||
        (item.matched_domains ?? []).some(
          (d) => d.toLowerCase() === selectedDomain.toLowerCase()
        );

      const searchableText = [
        item.title,
        item.organizer,
        item.location,
        ...(item.themes ?? []),
        ...(item.matched_domains ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesDomain && (!query || searchableText.includes(query));
    });
  }, [hackathons, searchTerm, selectedDomain]);

  const matchedCount = summary?.matched_count ?? data?.matched_count ?? hackathons.length;
  const retrievedCount = summary?.retrieved_count ?? data?.retrieved_count ?? hackathons.length;
  const registrationStatus = data?.filters?.registration_status ?? 'Open';
  const highlyCompetitiveCount = summary?.highly_competitive_count ?? 0;

  return (
    <div className="ca-page-container ca-hackathons-page">
      {/* Hero Header */}
      <section className="hack-hero">
        <p className="hack-eyebrow">OPPORTUNITY EXPLORER</p>
        <h1>
          Hackathons <em>worth exploring.</em>
        </h1>
        <p>
          Browse real opportunities matched to your technical development domains, compare
          timelines, prize pools, and requirements, and register directly on Devpost.
        </p>
      </section>

      {/* Stats Summary Panel */}
      <section className="hack-stats" aria-label="Dataset summary">
        <div className="hack-stat-card">
          <span>Matching Opportunities</span>
          <strong>{matchedCount}</strong>
        </div>
        <div className="hack-stat-card">
          <span>Total Retrieved</span>
          <strong>{retrievedCount}</strong>
        </div>
        <div className="hack-stat-card">
          <span>Registration Status</span>
          <strong className="status-pill">{registrationStatus}</strong>
        </div>
        {highlyCompetitiveCount > 0 && (
          <div className="hack-stat-card">
            <span>Highly Competitive</span>
            <strong style={{ color: '#b54708' }}>{highlyCompetitiveCount}</strong>
          </div>
        )}
      </section>

      {/* Search and Domain Filters Toolbar */}
      <section className="hack-toolbar" aria-label="Search and filters">
        <label className="hack-search-wrap">
          <span className="hack-search-icon" aria-hidden="true">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="search"
            className="hack-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by hackathon, organizer, or theme..."
            aria-label="Search hackathons"
          />
        </label>

        <div className="hack-domain-filter">
          <select
            className="hack-domain-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            aria-label="Filter by matched domain"
          >
            <option value="all">All matched domains ({domains.length})</option>
            {domains.map((domain) => (
              <option value={domain} key={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="hack-refresh-btn"
          onClick={handleRefresh}
          title="Reload recommendations from backend"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </section>

      {/* Result Count Status Line */}
      <div className="hack-result-line" aria-live="polite">
        <span>
          Showing {filteredHackathons.length} of {hackathons.length} opportunities
          {selectedDomain !== 'all' && ` in "${selectedDomain}"`}
          {searchTerm.trim() && ` matching "${searchTerm.trim()}"`}
        </span>
        <span>Card view</span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="hack-state-box" role="status" aria-busy="true">
          <div className="hack-state-spinner" />
          <h3>Loading Hackathon Recommendations...</h3>
          <p>Fetching domain-matched hackathons from the Pathfinder backend service.</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="hack-state-box error-box" role="alert">
          <AlertCircle className="w-8 h-8 text-red" />
          <h3>Unable to Load Hackathons</h3>
          <p>{error}</p>
          <button type="button" className="hack-retry-btn" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      )}

      {/* Hackathons Cards Grid */}
      {!isLoading && !error && (
        <section className="hack-grid" aria-label="Hackathon opportunities">
          {filteredHackathons.length > 0 ? (
            filteredHackathons.map((hackathon) => (
              <HackathonCard
                hackathon={hackathon}
                key={hackathon.id ?? hackathon.title}
              />
            ))
          ) : (
            <div className="hack-empty">
              <Sparkles className="w-8 h-8 text-muted mx-auto" />
              <h2>No hackathons found</h2>
              <p>
                {searchTerm
                  ? `No opportunities match "${searchTerm}". Try another search term or reset domain filters.`
                  : 'Try selecting a different domain filter above.'}
              </p>
            </div>
          )}
        </section>
      )}

      <footer className="hack-footer" style={{ marginTop: '24px', fontSize: '12px', color: '#667085' }}>
        AF-03 · Career and Skill-Gap Analysis Agent · Live recommendations sourced from {data?.source || 'Devpost'}.
      </footer>
    </div>
  );
};

export default HackathonsPage;

