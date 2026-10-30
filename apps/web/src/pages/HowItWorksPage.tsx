import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Cpu, 
  FolderKanban, 
  CheckSquare, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  GitBranch,
  BarChart3,
  Terminal
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Target Role Selection & Market Benchmarking',
      icon: Compass,
      description: 'Select your target career from verified high-demand tech roles or define a custom path. Our system retrieves realistic compensation data and multi-posting employer skill expectations.',
      details: ['Aggregated salary trends', 'Categorized technical & soft skill tiers', 'Multi-posting market validation'],
    },
    {
      step: '02',
      title: 'Multi-Modal Profile Ingestion & AI Normalization',
      icon: Cpu,
      description: 'Submit your background using resumes (PDF/DOCX), plain text descriptions, LinkedIn, or GitHub. The AI agent extracts programming languages, frameworks, and projects, mapping them to canonical taxonomies.',
      details: ['PDF/DOCX resume parsing', 'GitHub commit & repository signals', 'Confidence-scored evidence extraction'],
    },
    {
      step: '03',
      title: 'Explainable Skill-Gap Matrix & Readiness Scoring',
      icon: BarChart3,
      description: 'Your verified skills are mapped against role benchmarks, distinguishing between possessed skills, partially developed areas, unknown items, and critical missing gaps to produce an explainable readiness percentage.',
      details: ['Deterministic scoring breakdown', 'Distinction between unknown vs missing', 'Evidence quality weighting'],
    },
    {
      step: '04',
      title: 'Controlled Server-Side Learning Workspace',
      icon: FolderKanban,
      description: 'Unlike generic course libraries, AF-03 generates actual physical folders and subfolders on the server filesystem (Fundamentals, Advanced Concepts, Resources, Projects) with safe download tools.',
      details: ['Actual server disk directory tree', 'Controlled study guide downloader', 'Isolated sandboxed filesystem'],
    },
    {
      step: '05',
      title: 'Actionable "Learn-Then-Prove" & Opportunities',
      icon: CheckSquare,
      description: 'Execute weekly project assignments, attach practical repository proofs to update your proficiency, and discover matched hackathons, competitions, and conferences.',
      details: ['Weekly milestone checklist', 'Dynamic role-readiness recalculation', 'Verified hackathon opportunities'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Architecture & Methodology
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How AF-03 Bridges the Career-Skill Gap
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg">
          The difference between passive video watching and authentic role-readiness: our agent builds structured, verifiable software engineering capability.
        </p>
      </div>

      {/* 5-Step Process */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-start gap-6 hover:border-brand-300 transition-all"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 font-extrabold text-xl font-mono border border-brand-200">
                {item.step}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-brand-600" />
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.details.map((d, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/80 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
        <h2 className="text-2xl font-bold">Start Your Career Transformation</h2>
        <p className="text-xs text-slate-400 mt-2">
          Experience the full agentic loop. Select your target role or upload your background to receive an instant gap matrix and workspace.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            to="/careers"
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <span>Explore Careers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/onboarding"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            <span>Direct Onboarding</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

