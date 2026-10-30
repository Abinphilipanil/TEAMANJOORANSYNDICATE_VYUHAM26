import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { Opportunity, OpportunityType } from '@af03/contracts';
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Tag, 
  Search,
  Filter
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { roadmap } = useApp();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const types = ['All', 'hackathon', 'competition', 'conference', 'community'];

  useEffect(() => {
    loadOpportunities();
  }, [roadmap, selectedType, selectedLocation]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getOpportunities(
        roadmap?.targetRoleTitle,
        selectedType === 'All' ? undefined : selectedType,
        selectedLocation === 'All' ? undefined : selectedLocation
      );
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Skill-Profile Matched Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hackathons, Competitions & Industry Summits
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Curated career acceleration events aligned with your target role ({roadmap ? roadmap.targetRoleTitle : 'Tech Careers'}) to prove your skills in real-world arenas.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Virtual / Remote</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kochi">Kochi / Kerala</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="mt-6 flex items-center flex-wrap gap-2 pt-6 border-t border-slate-100">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedType === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t === 'All' ? 'All Formats' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Filtering verified career events...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">No events matched your filters</h4>
          <p className="text-xs text-slate-500 mt-1">Try switching locations or viewing all formats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {opp.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{opp.verificationStatus.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {opp.title}
                </h3>
                <div className="text-xs font-semibold text-brand-700 mt-0.5">
                  Organized by {opp.organization}
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {opp.summary}
                </p>

                {/* Prize / Perks Banner */}
                {opp.prizeOrPerks && (
                  <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
                    <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{opp.prizeOrPerks}</span>
                  </div>
                )}

                {/* Target Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {opp.relevantSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Metadata & CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Start: {opp.startDate} {opp.deadlineDate && `• Reg Deadline: ${opp.deadlineDate}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location} {opp.isRemote && '(Virtual)'}</span>
                  </div>
                </div>

                <a
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold transition-colors flex-shrink-0 shadow-sm"
                >
                  <span>Apply / Register</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

