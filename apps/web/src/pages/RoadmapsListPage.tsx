import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Milestone, 
  ArrowRight, 
  Plus, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckSquare, 
  FolderKanban,
  Sparkles
} from 'lucide-react';

export const RoadmapsListPage: React.FC = () => {
  const { roadmap } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Career Roadmaps</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your generated career learning pathways and active learning workspaces.
          </p>
        </div>

        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Career Roadmap</span>
        </Link>
      </div>

      {roadmap ? (
        <div className="bg-white rounded-2xl border border-brand-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Learning Track
                </span>
                <span className="text-xs text-slate-400">Created: {new Date(roadmap.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{roadmap.targetRoleTitle}</h3>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Readiness</div>
              <div className="text-base font-bold text-brand-600 font-mono mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{roadmap.currentReadiness}%</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Checklist Progress</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                {roadmap.overallProgressPercentage}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Target</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                {roadmap.weeklyHoursPlanned} hrs/wk
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Duration</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                {roadmap.totalWeeks} Weeks
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {roadmap.summaryRationale}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">No Roadmaps Created Yet</h4>
          <p className="text-xs text-slate-500 mt-1">Start by exploring careers and launching agent analysis.</p>
        </div>
      )}
    </div>
  );
};

