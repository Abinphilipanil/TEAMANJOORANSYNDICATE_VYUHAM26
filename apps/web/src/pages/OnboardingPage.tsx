import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { CareerRole, LearningPace, ResourceType } from '@af03/contracts';
import { 
  Compass, 
  Upload, 
  FileText, 
  Github, 
  Linkedin, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  CheckSquare,
  Cpu, 
  BarChart3, 
  FolderKanban,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    selectedRole, 
    setSelectedRole, 
    setUserProfile, 
    setRoadmap, 
    setWorkspace, 
    setSkillGaps, 
    setRoleReadiness 
  } = useApp();

  const [step, setStep] = useState(1);
  const [careers, setCareers] = useState<CareerRole[]>([]);
  const [targetRoleId, setTargetRoleId] = useState(selectedRole?.id || '');
  const [fullName, setFullName] = useState('Arjun Nair');
  const [email, setEmail] = useState('arjun.nair@example.com');
  const [profileText, setProfileText] = useState(
    'Intermediate full-stack developer with 1.5 years experience building React.js interfaces, Node.js and Express REST APIs, and writing SQL queries in PostgreSQL. Used Git and GitHub for version control. Looking to master Docker containerization and cloud deployments.'
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [linkedInUrl, setLinkedInUrl] = useState('https://linkedin.com/in/arjun-nair-dev');
  const [githubUrl, setGithubUrl] = useState('https://github.com/arjunnair');

  // Preferences
  const [learningPace, setLearningPace] = useState<LearningPace>('moderate');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [budget, setBudget] = useState(0);
  const [currency] = useState('INR');
  const [targetWeeks, setTargetWeeks] = useState(12);
  const [preferredFormats, setPreferredFormats] = useState<ResourceType[]>([
    'documentation',
    'interactive',
    'project',
  ]);
  const [preferredLocation, setPreferredLocation] = useState('Remote');

  // Agent Running State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const data = await apiClient.getCareers();
      setCareers(data);
      const roleParam = searchParams.get('role');
      if (roleParam) {
        const matched = data.find((c) => c.slug === roleParam || c.id === roleParam);
        if (matched) {
          setTargetRoleId(matched.id);
          setSelectedRole(matched);
        }
      } else if (!targetRoleId && data.length > 0) {
        setTargetRoleId(data[0].id);
        setSelectedRole(data[0]);
      }
    } catch (err) {
      console.error('Failed to load careers:', err);
    }
  };

  const handleFormatToggle = (format: ResourceType) => {
    if (preferredFormats.includes(format)) {
      if (preferredFormats.length > 1) {
        setPreferredFormats(preferredFormats.filter((f) => f !== format));
      }
    } else {
      setPreferredFormats([...preferredFormats, format]);
    }
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStage(1);

    try {
      // Stage 1 animation
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStage(2);

      // Stage 2 animation
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStage(3);

      const response = await apiClient.analyzeCareer(
        {
          targetRoleId,
          fullName,
          email,
          profileText,
          linkedInUrl,
          githubUrl,
          preferences: {
            learningPace,
            hoursPerWeek,
            budget,
            currency,
            targetWeeks,
            preferredLearningFormats: preferredFormats,
            preferredLocation,
          },
        },
        resumeFile || undefined
      );

      setAnalysisStage(4);
      await new Promise((r) => setTimeout(r, 600));

      // Save to global context
      setSelectedRole(response.careerRole);
      setUserProfile(response.userProfile);
      setRoadmap(response.roadmap);
      setWorkspace(response.workspace);
      setSkillGaps(response.skillGaps);
      setRoleReadiness(response.roleReadiness);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Agent analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Indicator Header */}
      {!isAnalyzing && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { num: 1, title: 'Target Role' },
              { num: 2, title: 'Your Background' },
              { num: 3, title: 'Preferences' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === s.num
                      ? 'bg-brand-600 text-white shadow-md'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step === s.num ? 'text-slate-900' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Target Career */}
      {!isAnalyzing && step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Step 1: Select Your Target Career</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose the specific role you want the AI agent to benchmark you against.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {careers.map((role) => (
              <div
                key={role.id}
                onClick={() => {
                  setTargetRoleId(role.id);
                  setSelectedRole(role);
                }}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  targetRoleId === role.id
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500">{role.domain}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    targetRoleId === role.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                  }`}>
                    {targetRoleId === role.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">{role.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{role.summary}</p>
                <div className="mt-3 text-[11px] font-mono text-emerald-600 font-semibold">
                  Comp: {role.salaryInsight.midLevelINR}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!targetRoleId}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              <span>Continue to Background</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Background Submission */}
      {!isAnalyzing && step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Step 2: Provide Your Background</h2>
          <p className="text-xs text-slate-500 mt-1">
            Provide as much context as you wish. You can upload a resume, paste project descriptions, or provide URLs.
          </p>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Resume (PDF, DOCX) - Optional
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-brand-600 mb-2" />
                  <span className="text-xs font-semibold text-slate-800">
                    {resumeFile ? resumeFile.name : 'Click to select resume file (PDF or DOCX)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Safe local analysis • Up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {/* Direct text input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Text / Skills & Experience Summary
              </label>
              <textarea
                rows={4}
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Mention languages, frameworks, databases, projects, and certifications..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-600" />
                  <span>GitHub Profile URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn Profile URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              <span>Continue to Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preferences */}
      {!isAnalyzing && step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Step 3: Learning Preferences & Constraints</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure your availability, learning speed, and budget so the agent creates a realistic schedule.
          </p>

          <div className="mt-6 space-y-6">
            {/* Learning Pace */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Learning Pace</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'fast', label: 'Fast Pace', desc: 'Aggressive bootcamp schedule' },
                  { id: 'moderate', label: 'Moderate', desc: 'Balanced regular progress' },
                  { id: 'steady', label: 'Steady / Slow', desc: 'Working professional schedule' },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setLearningPace(p.id as LearningPace)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                      learningPace === p.id
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800">{p.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Hours & Target Weeks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Available Hours Per Week</span>
                  <span className="font-bold text-brand-600 font-mono">{hoursPerWeek} hrs/wk</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Target Completion Period</span>
                  <span className="font-bold text-brand-600 font-mono">{targetWeeks} Weeks</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="2"
                  value={targetWeeks}
                  onChange={(e) => setTargetWeeks(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>

            {/* Budget & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Budget (INR, Default ₹0)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value || '0', 10))}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Job Location
                </label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Remote">Remote (Anywhere India)</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kochi / Kerala">Kochi / Kerala</option>
                </select>
              </div>
            </div>

            {/* Preferred Formats */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Learning Formats
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'documentation', label: 'Official Documentation' },
                  { id: 'interactive', label: 'Interactive Tutorials' },
                  { id: 'project', label: 'Hands-on Projects' },
                  { id: 'video', label: 'Video Walkthroughs' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFormatToggle(f.id as ResourceType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      preferredFormats.includes(f.id as ResourceType)
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-600/25"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>LAUNCH AI AGENT ANALYSIS</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Live AI Agent Execution Screen */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/30 animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-5">
            Agent Orchestration In Progress
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Running 4-stage career analysis pipeline and initializing local server workspace...
          </p>

          <div className="mt-8 space-y-4 text-left">
            {[
              { id: 1, label: 'Profile Extraction & Taxonomy Normalization', icon: Cpu },
              { id: 2, label: 'Job-Market Multi-Posting Aggregation', icon: BarChart3 },
              { id: 3, label: 'Explainable Skill-Gap Matrix & Role-Readiness', icon: CheckSquare },
              { id: 4, label: 'Roadmap Synthesis & Server Workspace Initialization', icon: FolderKanban },
            ].map((stage) => {
              const Icon = stage.icon;
              const isDone = analysisStage > stage.id;
              const isCurrent = analysisStage === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isCurrent
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                      : 'border-slate-100 opacity-40 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white animate-spin'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold">{stage.label}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-6 p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
