import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardLayout: React.FC = () => {
  const { userProfile, roadmap } = useApp();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-800">
              {roadmap ? roadmap.targetRoleTitle : 'Career Intelligence Dashboard'}
            </h1>
            {roadmap && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
                Active Roadmap
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Switch / Re-analyze</span>
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-800 leading-tight">
                  {userProfile?.fullName || 'Candidate'}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {userProfile?.email || 'Logged in'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

