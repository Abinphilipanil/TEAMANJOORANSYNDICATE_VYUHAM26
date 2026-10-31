import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard,
  FileText,
  Layers,
  Milestone,
  Settings,
  CheckSquare,
  Sparkles,
  UserCircle2,
  TrendingUp,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { roadmap } = useApp();

  const primaryNavItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/resume-analysis', label: 'Resume Analyzer', icon: FileText },
    { to: '/skill-gaps', label: 'Skill Gaps', icon: Layers },
    { to: '/learning-roadmap', label: 'Learning Roadmap', icon: Milestone },
  ];

  const teamWorkspaceItems = [
    { to: '/progress', label: 'Progress Tracking', icon: CheckSquare },
    { to: '/opportunities', label: 'Opportunities', icon: Sparkles },
    { to: '/profile', label: 'My Profile', icon: UserCircle2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`ca-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo and Brand Header */}
        <div className="sidebar-brand-header">
          <div className="sidebar-brand-logo">
            <div className="brand-icon-box">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="brand-text">CareerAgent AI</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Track Card (Clean, light theme) */}
        {roadmap && (
          <div className="mx-3 my-2 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Active Track</div>
            <div className="font-semibold text-slate-800 text-xs truncate mt-0.5">{roadmap.targetRoleTitle}</div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-brand-600" />
                <span>Readiness</span>
              </span>
              <span className="font-bold text-brand-600">{roadmap.currentReadiness}%</span>
            </div>
            <div className="w-full bg-blue-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.currentReadiness}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Navigation List */}
        <nav className="sidebar-nav-container" aria-label="Sidebar Navigation">
          <ul className="sidebar-nav-list">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-item-icon" />
                    <span className="nav-item-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}

            {/* Team Extended Features Section */}
            <li className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Platform</span>
            </li>

            {teamWorkspaceItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-item-icon" />
                    <span className="nav-item-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings Anchored at Bottom */}
        <div className="sidebar-bottom-section">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `sidebar-nav-item settings-item ${isActive ? 'active' : ''}`}
          >
            <Settings className="nav-item-icon" />
            <span className="nav-item-label">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
