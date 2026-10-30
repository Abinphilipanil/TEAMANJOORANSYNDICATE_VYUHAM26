import React from 'react';
import { Compass, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">AF-03 SkillGapper</span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs text-slate-500">AI-Powered Career & Skill-Gap Analysis Agent</span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Vyuham 2026 Hackathon
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Modular Monorepo Architecture</span>
            <span>•</span>
            <span>Safe Disk Workspace</span>
            <span>•</span>
            <span>Deterministic Scoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

