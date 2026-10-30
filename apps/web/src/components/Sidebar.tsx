import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Milestone, 
  FolderKanban, 
  CheckSquare, 
  Sparkles, 
  UserCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { roadmap, roleReadiness } = useApp();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/careers', label: 'Explore Careers', icon: Compass },
    { to: '/roadmaps', label: 'My Roadmaps', icon: Milestone },
    { to: '/workspace', label: 'Learning Workspace', icon: FolderKanban },
    { to: '/progress', label: 'Progress Tracking', icon: CheckSquare },
    { to: '/opportunities', label: 'Opportunities', icon: Sparkles },
    { to: '/profile', label: 'My Profile', icon: UserCircle2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-sm">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-base text-white tracking-tight">SkillGapper</span>
          <span className="ml-1.5 text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">AF-03</span>
        </div>
      </div>

      {/* Target Role Pill */}
      {roadmap && (
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Career Track</div>
          <div className="font-semibold text-white text-sm truncate mt-0.5">{roadmap.targetRoleTitle}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
              <span>Readiness</span>
            </span>
            <span className="font-bold text-brand-400">{roadmap.currentReadiness}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${roadmap.currentReadiness}%` }}
            />
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Agent Engine</span>
          <span className="text-emerald-400 font-medium">Online</span>
        </div>
        <div className="text-[10px] text-slate-600 mt-1">Local Sandboxed Storage</div>
      </div>
    </aside>
  );
};

