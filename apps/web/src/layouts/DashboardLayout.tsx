import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useApp } from '../context/AppContext';
import { Search, Bell, Menu } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { userProfile, roadmap } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = userProfile?.fullName || 'Alex Rivera';
  const displayRole = userProfile?.headline || (roadmap ? roadmap.targetRoleTitle : 'Software Engineer');
  const initials = userProfile?.fullName
    ? userProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AR';

  return (
    <div className="ca-app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main App Frame */}
      <div className="ca-main-wrapper">
        {/* 2. Top Bar */}
        <header className="ca-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-sidebar-toggle"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Field */}
            <div className="topbar-search-box">
              <Search className="search-icon w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for jobs, skills or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for jobs, skills or roles"
              />
            </div>
          </div>

          <div className="topbar-right">
            {/* Notification Control */}
            <button
              type="button"
              className="topbar-icon-btn"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="notification-dot" />
            </button>

            {/* User Profile Pill */}
            <Link to="/profile" className="topbar-profile" title={`${displayName} (Profile)`}>
              <div className="profile-avatar">{initials}</div>
              <div className="profile-text-wrap">
                <span className="profile-name">{displayName}</span>
                <span className="profile-role">{displayRole}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* 3. Main Dashboard Content View */}
        <main className="ca-dashboard-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
