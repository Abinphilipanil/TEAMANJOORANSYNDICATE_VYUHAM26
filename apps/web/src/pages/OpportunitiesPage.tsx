import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { Opportunity } from '@af03/contracts';
import { 
  Sparkles, 
  Trophy, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  RotateCw,
  Zap,
  Globe,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { roadmap, resumeAnalysisResult, userProfile } = useApp();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dedicated active view tab: 'hackathons' | 'conferences' | 'comparative'
  const [activeTab, setActiveTab] = useState<'hackathons' | 'conferences' | 'comparative'>('hackathons');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [refreshKey, setRefreshKey] = useState(0);

  // Derive candidate skills from uploaded resume analysis or profile
  const candidateSkills = useMemo(() => {
    const matched = resumeAnalysisResult?.skillsBreakdown?.matched?.map((s) => s.name);
    if (matched && matched.length > 0) return matched;
    if (userProfile?.detectedSkills && userProfile.detectedSkills.length > 0) {
      return userProfile.detectedSkills.map((s) => (typeof s === 'string' ? s : s.skillName || (s as any).name));
    }
    try {
      const stored = localStorage.getItem('af03_resume_analysis');
      if (stored) {
        const parsed = JSON.parse(stored);
        const m = parsed?.skillsBreakdown?.matched?.map((s: any) => s.name);
        if (m?.length) return m;
      }
    } catch (_) {}
    return [];
  }, [resumeAnalysisResult, userProfile]);

  const loadOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch without type filter so we can accurately segment hackathons and conferences in client state
      const data = await apiClient.getOpportunities(
        roadmap?.targetRoleTitle,
        undefined,
        selectedLocation === 'All' ? undefined : selectedLocation,
        candidateSkills
      );
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  }, [roadmap, selectedLocation, candidateSkills]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities, refreshKey]);

  // Strictly segment into Hackathons vs Conferences
  const hackathonsList = useMemo(() => {
    return opportunities.filter((opp) => opp.type !== 'conference');
  }, [opportunities]);

  const conferencesList = useMemo(() => {
    return opportunities.filter((opp) => opp.type === 'conference');
  }, [opportunities]);

  const displayedList = useMemo(() => {
    if (activeTab === 'hackathons') return hackathonsList;
    if (activeTab === 'conferences') return conferencesList;
    return opportunities;
  }, [activeTab, hackathonsList, conferencesList, opportunities]);

  // Render an individual opportunity card with format-specific badges & CTAs
  const renderCard = (opp: Opportunity) => {
    const isConference = opp.type === 'conference';

    return (
      <div
        key={opp.id}
        className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
      >
        <div>
          {/* Top Row: Type & Verification Badges */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isConference
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : opp.isLiveScraped
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {isConference ? '🌐 Tech Summit' : opp.isLiveScraped ? '🏆 Devpost Live' : '🏆 Hackathon'}
              </span>

              {opp.matchScore && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>{opp.matchScore}% FIT</span>
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{opp.verificationStatus.replace('_', ' ').toUpperCase()}</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {opp.title}
          </h3>
          <div className="text-xs font-semibold text-blue-700 mt-0.5">
            Organized by {opp.organization}
          </div>

          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
            {opp.summary}
          </p>

          {/* AI Personalized Strategy Callout */}
          {opp.aiRecommendation && (
            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs ${
                isConference
                  ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold text-[11px] mb-1 ${
                  isConference ? 'text-purple-800' : 'text-emerald-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{isConference ? 'KEYNOTE & WORKSHOP STRATEGY' : 'AI HACKATHON STRATEGY'}</span>
              </div>
              <p className="leading-relaxed m-0">{opp.aiRecommendation}</p>
            </div>
          )}

          {/* Prize / Perks Banner */}
          {opp.prizeOrPerks && (
            <div
              className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                isConference
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              {isConference ? (
                <Globe className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              ) : (
                <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
              )}
              <span>{opp.prizeOrPerks}</span>
            </div>
          )}

          {/* Relevant Skills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {opp.relevantSkills.map((skill) => {
              const isCandidateSkill = candidateSkills.some(
                (s: string) => s.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(s.toLowerCase())
              );
              return (
                <span
                  key={skill}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    isCandidateSkill
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isCandidateSkill ? `✓ ${skill}` : skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Event Metadata & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1 text-slate-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{isConference ? `Summit Dates: ${opp.startDate}` : `Starts: ${opp.startDate}`} {opp.deadlineDate && `• Reg: ${opp.deadlineDate}`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{opp.location} {opp.isRemote && '(Virtual Stream Available)'}</span>
            </div>
          </div>

          <a
            href={opp.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold transition-colors flex-shrink-0 shadow-sm ${
              isConference ? 'bg-purple-900 hover:bg-purple-800' : 'bg-slate-900 hover:bg-blue-600'
            }`}
          >
            <span>{isConference ? 'Official Summit Website' : 'Apply / Register'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Live AI Web Scraping & Skill Personalization Banner */}
      <aside
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(37, 99, 235, 0.08))',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
        aria-label="Live Opportunities Intelligence"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                Separate Verified Opportunities: Hackathons & Premier Tech Summits
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#065f46',
                  backgroundColor: '#d1fae5',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                LIVE SCRAPED
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
              {candidateSkills.length > 0 ? (
                <>
                  Segregated feeds for <strong>Hackathons (Devpost)</strong> and <strong>Tech Conferences</strong>. Personalized using your verified resume skills:
                  <strong style={{ color: '#0f172a' }}> {candidateSkills.slice(0, 5).join(', ')}{candidateSkills.length > 5 ? ` +${candidateSkills.length - 5} more` : ''}</strong>.
                </>
              ) : (
                <>
                  Strictly separate outputs for live hackathons and tech summits. Upload your resume in the Analyzer to customize your matching scores!
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((prev) => prev + 1)}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#065f46',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Scan live web for new hackathons and conferences"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Live Rescan</span>
        </button>
      </aside>

      {/* Header Banner & Distinct Segment Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Grounded Opportunities Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'hackathons'
                ? 'Hackathons & Engineering Challenges'
                : activeTab === 'conferences'
                ? 'Premier Tech Conferences & Global Summits'
                : 'Comparative Opportunities Overview'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {activeTab === 'hackathons'
                ? 'Build working software products, win cash prizes, and prove your implementation skills in live competition.'
                : activeTab === 'conferences'
                ? 'Connect with global technical leadership, explore architecture keynotes, and access student/diversity passes.'
                : 'Side-by-side comparative views of upcoming hackathons and premier industry conferences.'}
            </p>
          </div>

          {/* Quick Location Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Virtual / Remote</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kochi">Kochi / Kerala</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        {/* Dedicated Tab Switcher - Strict Separation */}
        <div className="mt-6 flex items-center flex-wrap gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('hackathons')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hackathons'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Hackathons ({hackathonsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('conferences')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'conferences'
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Tech Conferences ({conferencesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparative')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'comparative'
                ? 'bg-blue-900 text-white shadow-md'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Comparative View (Both)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Web-scraping live opportunities & personalizing with AI...</p>
        </div>
      ) : activeTab === 'comparative' ? (
        /* COMPARATIVE VIEW: TWO DISTINCT SECTIONS */
        <div className="space-y-10">
          {/* Section 1: Hackathons */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Verified Hackathons & Code Competitions ({hackathonsList.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">Devpost & Verified Challenge Portals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hackathonsList.map(renderCard)}
            </div>
          </section>

          {/* Section 2: Conferences */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-purple-950">
                  Premier Tech Conferences & Summits ({conferencesList.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">Official 2026-2027 Global Summits</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conferencesList.map(renderCard)}
            </div>
          </section>
        </div>
      ) : (
        /* SINGLE TAB VIEW: STRICTLY SELECTED FORMAT ONLY */
        displayedList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            {activeTab === 'conferences' ? (
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            ) : (
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            )}
            <h4 className="text-base font-bold text-slate-800">No events matched your location</h4>
            <p className="text-xs text-slate-500 mt-1">Try switching location filters to "All Locations".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedList.map(renderCard)}
          </div>
        )
      )}
    </div>
  );
};

export default OpportunitiesPage;
