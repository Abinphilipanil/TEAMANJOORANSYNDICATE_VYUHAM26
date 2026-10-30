import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { CareerRole } from '@af03/contracts';
import { 
  Search, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Briefcase,
  Layers,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CareerExplorerPage: React.FC = () => {
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDomain, setCustomDomain] = useState('Web & Cloud');
  const [customDesc, setCustomDesc] = useState('');
  const [creatingCustom, setCreatingCustom] = useState(false);

  const navigate = useNavigate();
  const { setSelectedRole } = useApp();

  const domains = ['All', 'Web & Cloud', 'Data & AI', 'Cloud & Infrastructure', 'Security'];

  useEffect(() => {
    loadCareers();
  }, [search, selectedDomain]);

  const loadCareers = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCareers(search, selectedDomain === 'All' ? undefined : selectedDomain);
      setCareers(data);
    } catch (err) {
      console.error('Failed to load careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCareer = (role: CareerRole) => {
    setSelectedRole(role);
    navigate(`/careers/${role.slug}`);
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    try {
      setCreatingCustom(true);
      const newRole = await apiClient.createCustomRole({
        title: customTitle,
        domain: customDomain,
        description: customDesc,
      });
      setIsCustomModalOpen(false);
      setCustomTitle('');
      setCustomDesc('');
      setSelectedRole(newRole);
      navigate(`/careers/${newRole.slug}`);
    } catch (err) {
      console.error('Failed to create custom role:', err);
    } finally {
      setCreatingCustom(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>AF-03 Career Intelligence Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Explore High-Demand Tech Careers & Bridge Your Skill Gaps
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Target real employer requirements, analyze your current proficiencies, and execute structured weekly projects in a sandboxed local workspace.
        </p>

        {/* Search & Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, technology (e.g. React, Python, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Custom Role</span>
          </button>
        </div>

        {/* Domain Filter Pills */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-2">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDomain === dom
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Career Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm">Fetching verified career benchmarks...</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No matching careers found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or create a custom career role to generate a tailor-made roadmap.
          </p>
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Role</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-lg hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {role.domain}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>{role.salaryInsight.marketTrend}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {role.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
                {role.summary}
              </p>

              {/* Salary Indicator */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mid-Level Comp</span>
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {role.salaryInsight.midLevelINR}
                </span>
              </div>

              {/* Top Skills Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.requiredTechnicalSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill.name}
                    className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80"
                  >
                    {skill.name}
                  </span>
                ))}
                {role.requiredTechnicalSkills.length > 4 && (
                  <span className="text-[11px] text-slate-400 self-center">
                    +{role.requiredTechnicalSkills.length - 4} more
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectCareer(role)}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
              >
                <span>View Career Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Career Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Define Custom Career Role</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Specify any niche or emerging role. Our AI agent will dynamically synthesize technical requirements and a tailored roadmap.
            </p>

            <form onSubmit={handleCreateCustom} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Career Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Computing Specialist, Rust Systems Engineer..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technology Domain
                </label>
                <select
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Web & Cloud">Web & Cloud</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Security">Security</option>
                  <option value="Embedded & Systems">Embedded & Systems</option>
                  <option value="Other">Other Specialized Domain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Overview / Goal (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe key responsibilities or target industry..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCustom}
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {creatingCustom ? 'Synthesizing...' : 'Generate Career Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

