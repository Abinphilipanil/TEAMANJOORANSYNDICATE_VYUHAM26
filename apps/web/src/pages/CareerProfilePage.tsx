import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { CareerRole } from '@af03/contracts';
import { SkillBadge } from '../components/SkillBadge';
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  IndianRupee, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Briefcase,
  Layers,
  Award,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CareerProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [role, setRole] = useState<CareerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setSelectedRole } = useApp();

  useEffect(() => {
    if (slug) {
      loadRole(slug);
    }
  }, [slug]);

  const loadRole = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getCareerByIdOrSlug(identifier);
      setRole(data);
      setSelectedRole(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load career role details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoadmap = () => {
    if (role) {
      setSelectedRole(role);
      navigate(`/onboarding?role=${role.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading career intelligence profile...</p>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Career Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">{error || "The requested role could not be located."}</p>
        <Link
          to="/careers"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Explorer</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        to="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Career Explorer</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {role.domain}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{role.salaryInsight.marketTrend}</span>
                {role.salaryInsight.trendPercentage && (
                  <span className="ml-1 text-emerald-600 font-mono">({role.salaryInsight.trendPercentage})</span>
                )}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {role.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {role.overviewDescription}
            </p>
          </div>

          {/* Primary Action Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl w-full lg:w-80 shadow-lg flex-shrink-0">
            <div className="text-xs text-slate-300 font-medium">Verified Industry Demand</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {role.salaryInsight.midLevelINR}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Average Mid-Level Annual Compensation</div>

            <button
              onClick={handleStartRoadmap}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>BUILD MY PERSONALIZED ROADMAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Salary Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 uppercase font-semibold">Entry Level (0-2 Yrs)</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-1">{role.salaryInsight.entryLevelINR}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border-2 border-brand-200 text-center shadow-sm">
          <div className="text-xs text-brand-600 uppercase font-bold">Mid Level (3-5 Yrs)</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{role.salaryInsight.midLevelINR}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-400 uppercase font-semibold">Senior Level (6+ Yrs)</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-1">{role.salaryInsight.seniorLevelINR}</div>
        </div>
      </div>

      {/* Grid: Technical Skills & Soft Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Technical Skills Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <span>Required Technical Proficiencies</span>
            </h2>
            <span className="text-xs text-slate-400">
              {role.requiredTechnicalSkills.length} competencies
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {role.requiredTechnicalSkills.map((skill) => (
              <div key={skill.name} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-800 text-sm">{skill.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      {skill.category.replace('_', ' ')}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500">
                      Req. Level: <strong className="text-slate-700 capitalize">{skill.minimumProficiency}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SkillBadge importance={skill.importance} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills & Core Competencies */}
        <div className="space-y-6">
          {/* Core Competencies */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Core Engineering Competencies</span>
            </h3>
            <ul className="space-y-2.5">
              {role.coreCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Soft Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Required Soft Skills</span>
            </h3>
            <div className="space-y-3">
              {role.requiredSoftSkills.map((soft) => (
                <div key={soft.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{soft.name}</span>
                    <SkillBadge importance={soft.importance} />
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    {soft.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sample Market Postings Section */}
      {role.sampleJobPostings && role.sampleJobPostings.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <span>Sample Real-World Job Postings & Benchmarks</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role.sampleJobPostings.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {job.experienceLevel}
                    </span>
                  </div>
                  <div className="text-xs text-brand-700 font-semibold mt-0.5">{job.company} • {job.location}</div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.requiredSkills.map((s) => (
                      <span key={s} className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Source: {job.sourcePlatform}</span>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-800 inline-flex items-center gap-1 font-semibold"
                  >
                    <span>View Posting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky CTA */}
      <div className="mt-12 text-center p-8 bg-brand-50 rounded-2xl border border-brand-200">
        <h3 className="text-xl font-bold text-slate-900">Ready to bridge your gap to {role.title}?</h3>
        <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
          Submit your resume, GitHub, or background summary. Our agent will analyze your current competencies and generate your personalized roadmap.
        </p>
        <button
          onClick={handleStartRoadmap}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>BUILD MY PERSONALIZED ROADMAP</span>
        </button>
      </div>
    </div>
  );
};

