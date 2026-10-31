import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, BookOpen, LayoutDashboard, ArrowRight, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { roadmap } = useApp();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">CareerAgent</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-mono">AF-03</span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-1 hidden sm:block">AI-Powered Career & Skill-Gap Intelligence</p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/resume-analysis"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/resume-analysis')
                ? 'text-brand-700 bg-brand-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Resume Analyzer
            </span>
          </Link>
          <Link
            to="/how-it-works"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/how-it-works')
                ? 'text-brand-700 bg-brand-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              How It Works
            </span>
          </Link>
          {roadmap && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </span>
            </Link>
          )}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {roadmap ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all shadow-brand-600/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/resume-analysis"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-300" />
              <span>Analyse Resume</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
