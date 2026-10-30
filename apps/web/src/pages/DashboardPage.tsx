import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { SkillBadge } from '../components/SkillBadge';
import { 
  FolderKanban, 
  CheckSquare, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Layers, 
  Target,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { SkillGapStatus } from '@af03/contracts';

export const DashboardPage: React.FC = () => {
  const { roadmap, roleReadiness, skillGaps, workspace } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | SkillGapStatus>('all');

  if (!roadmap) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
        <Sparkles className="w-12 h-12 text-brand-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900">No Active Career Roadmap Found</h3>
        <p className="text-xs text-slate-500 mt-2">
          Select a career and submit your profile background to generate your tailored skill-gap analysis.
        </p>
        <Link
          to="/onboarding"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <span>Start Career Onboarding</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const filteredGaps = skillGaps.filter((g) => {
    if (activeTab === 'all') return true;
    return g.status === activeTab;
  });

  const possessedCount = skillGaps.filter(g => g.status === 'already_possessed').length;
  const partialCount = skillGaps.filter(g => g.status === 'partially_developed').length;
  const missingCount = skillGaps.filter(g => g.status === 'missing').length;
  const verifyCount = skillGaps.filter(g => g.status === 'needs_verification').length;

  return (
    <div className="space-y-8">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Readiness Gauge Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <ReadinessGauge
            score={roadmap.currentReadiness}
            ratingBand={roleReadiness?.ratingBand}
          />
          <div className="text-xs text-slate-500 mt-2 font-medium">Role Benchmark Score</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Initial: {roadmap.readinessAtCreation}% • Target: 100%
          </div>
        </div>

        {/* Milestone Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Roadmap Progress</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
              {roadmap.overallProgressPercentage}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Weekly verified project checklist completion
            </p>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.overallProgressPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>{roadmap.weeklyMilestones.filter(m => m.isCompleted).length} / {roadmap.totalWeeks} Weeks Done</span>
              <Link to="/progress" className="text-brand-600 hover:underline font-semibold">View Tasks</Link>
            </div>
          </div>
        </div>

        {/* Weekly Commitment Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Weekly Target</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
              {roadmap.weeklyHoursPlanned} <span className="text-sm font-sans font-normal text-slate-500">hrs/week</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Calibrated for steady concept mastery
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Total Duration:</span>
            <span className="font-bold text-slate-800">{roadmap.totalWeeks} Weeks</span>
          </div>
        </div>

        {/* Workspace Quick Launch Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="text-xs text-brand-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4" />
              <span>Server Workspace</span>
            </div>
            <h4 className="text-base font-bold text-white mt-2">
              {workspace ? workspace.targetRoleSlug : roadmap.targetRoleTitle}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              {workspace ? `${workspace.totalFoldersCount} folders created on disk` : 'Ready to inspect'}
            </p>
          </div>

          <Link
            to="/workspace"
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Learning Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-4">
        <Sparkles className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase text-brand-800 tracking-wider">Agent Evaluation Rationale</h4>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
            {roadmap.summaryRationale}
          </p>
        </div>
      </div>

      {/* Skill Analysis Matrix Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <span>Interactive Skill-Gap Analysis Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified competencies classified by verified proof and market priority
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({skillGaps.length})
            </button>
            <button
              onClick={() => setActiveTab('already_possessed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'already_possessed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Possessed ({possessedCount})
            </button>
            <button
              onClick={() => setActiveTab('partially_developed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'partially_developed' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              Partial ({partialCount})
            </button>
            <button
              onClick={() => setActiveTab('missing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'missing' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Missing Gaps ({missingCount})
            </button>
            <button
              onClick={() => setActiveTab('needs_verification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'needs_verification' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              Needs Proof ({verifyCount})
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Skill / Competency</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Market Importance</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Est. Study Hours</th>
                <th className="pb-3 pr-2">Evidence / Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((gap) => (
                <tr key={gap.skillName} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-800">
                    {gap.skillName}
                  </td>
                  <td className="py-3.5 text-slate-500 font-mono capitalize">
                    {gap.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5">
                    <SkillBadge importance={gap.importance} />
                  </td>
                  <td className="py-3.5">
                    <SkillBadge status={gap.status} />
                  </td>
                  <td className="py-3.5 font-mono text-slate-600">
                    {gap.estimatedHoursToMaster > 0 ? `${gap.estimatedHoursToMaster} hrs` : '0 hrs (Mastered)'}
                  </td>
                  <td className="py-3.5 pr-2 text-slate-600 max-w-xs truncate" title={gap.reasoning}>
                    {gap.reasoning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Milestones Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              <span>Personalized Weekly Roadmap Overview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured step-by-step phases to attain 100% role-readiness
            </p>
          </div>
          <Link
            to="/progress"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            <span>Open Checklist Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.weeklyMilestones.slice(0, 6).map((ms) => (
            <div
              key={ms.weekNumber}
              className={`p-4 rounded-xl border transition-all ${
                ms.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-brand-700 font-mono">Week {ms.weekNumber}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">{ms.phaseName}</span>
              </div>
              <p className="text-xs font-medium text-slate-800 line-clamp-2">{ms.goal}</p>

              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{ms.items.length} Modules & Project</span>
                {ms.isCompleted ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <Link to="/workspace" className="text-brand-600 hover:underline font-semibold">
                    Workspace &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

