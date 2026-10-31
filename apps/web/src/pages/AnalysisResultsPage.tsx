import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ResultsDashboard from '../components/career-agent/ResultsDashboard';
import { IconArrowRight, IconRefreshCw, IconMap, IconTarget } from '../components/career-agent/Icons';

export const AnalysisResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    resumeAnalysisResult,
    setResumeAnalysisResult,
    setAnalysisResumeFile,
    setAnalysisJobDescription,
  } = useApp();

  const handleAnalyzeAnother = () => {
    setAnalysisResumeFile(null);
    setAnalysisJobDescription('');
    setResumeAnalysisResult(null);
    navigate('/resume-analysis');
  };

  if (!resumeAnalysisResult) {
    return (
      <div className="ca-page-container ca-empty-results max-w-4xl mx-auto px-4 py-12">
        <div className="empty-results-card text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">No Analysis Available</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            You haven't run a resume analysis yet. Upload your resume and paste a job description to get started.
          </p>
          <button
            type="button"
            className="btn-primary-cta mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
            onClick={handleAnalyzeAnother}
          >
            Start New Resume Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ca-page-container ca-results-page">
      {/* Page Header with Action Bar */}
      <div className="results-page-header">
        <div className="header-text-group">
          <span className="results-badge">Evaluation Complete</span>
          <h1 className="results-main-title">Resume & Job Fit Analysis</h1>
          <p className="results-subtext">
            Comprehensive evaluation comparing your resume credentials against target role requirements.
          </p>
        </div>

        <div className="results-top-actions">
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => navigate('/resume-analysis')}
            title="Modify job description or review inputs"
          >
            &larr; Back to Analysis
          </button>

          <button
            type="button"
            className="btn-secondary-action"
            onClick={handleAnalyzeAnother}
            title="Start fresh with a different resume"
          >
            <IconRefreshCw className="w-4 h-4 inline-icon" /> Analyze Another
          </button>

          <button
            type="button"
            className="btn-primary-action"
            onClick={() => navigate('/learning-roadmap')}
            title="Explore recommended learning roadmap"
          >
            <IconMap className="w-4 h-4 inline-icon" /> View Learning Roadmap
            <IconArrowRight className="w-4 h-4 inline-icon" />
          </button>
        </div>
      </div>

      {/* Complete Dedicated Results Dashboard */}
      <div className="results-dashboard-wrapper">
        <ResultsDashboard results={resumeAnalysisResult} />
      </div>

      {/* Bottom Action Bar */}
      <div className="results-bottom-actions">
        <div className="bottom-actions-left">
          <span className="action-caption">Next Step: Close skill gaps or explore matching roles</span>
        </div>
        <div className="bottom-actions-right">
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => navigate('/skill-gaps')}
          >
            <IconTarget className="w-4 h-4 inline-icon" /> View Skill Gaps
          </button>
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => navigate('/learning-roadmap')}
          >
            <IconMap className="w-4 h-4 inline-icon" /> Open Actionable Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsPage;

