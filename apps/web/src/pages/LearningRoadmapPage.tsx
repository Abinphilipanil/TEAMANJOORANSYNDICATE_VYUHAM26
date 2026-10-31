import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Info, ArrowRight } from 'lucide-react';
import RoadmapFullView from '../components/career-agent/views/RoadmapFullView';
import { learningRoadmap } from '../data/sampleData';
import { useApp } from '../context/AppContext';
import { generateDynamicRoadmapFromAnalysis } from '../utils/dynamicRoadmap';

export const LearningRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRole, resumeAnalysisResult, roadmap } = useApp();
  const targetRoleTitle = selectedRole?.title || 'Cloud Solutions Architect';

  // Generate dynamic curriculum based on live AI resume analysis and estimated hours
  const dynamicResult = useMemo(() => {
    return generateDynamicRoadmapFromAnalysis(resumeAnalysisResult, targetRoleTitle, roadmap);
  }, [resumeAnalysisResult, targetRoleTitle, roadmap]);

  const activeRoadmap = dynamicResult.isAiGenerated ? dynamicResult.phases : learningRoadmap;

  return (
    <div className="ca-page-container ca-roadmap-page">
      {/* Live AI Calibration Banner */}
      {dynamicResult.isAiGenerated ? (
        <aside
          className="ci-ai-status-banner banner-live"
          style={{
            margin: '0 0 20px 0',
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))',
            border: '1px solid rgba(37,99,235,0.22)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
          aria-label="AI Roadmap Status"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                Personalized AI Study Curriculum
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>
                Dynamically generated from your resume evaluation ({resumeAnalysisResult?.overallMatch?.score}% match). Modules and study hours are calibrated to bridge your actual missing competencies.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="ci-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => navigate('/analysis-results')}
          >
            Review Gap Analysis <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
          </button>
        </aside>
      ) : (
        <aside
          className="ci-ai-status-banner banner-demo"
          style={{
            margin: '0 0 20px 0',
            padding: '14px 20px',
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
          aria-label="AI Roadmap Status"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                Showing Benchmark Demonstration Curriculum
              </span>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>
                Upload your resume in the Resume Analyzer to dynamically extract your real skill gaps and calculate custom study hours.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="ci-btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => navigate('/resume-analysis')}
          >
            Upload Resume &rarr;
          </button>
        </aside>
      )}

      <RoadmapFullView
        roadmap={activeRoadmap}
        targetRoleTitle={targetRoleTitle}
        strategy={dynamicResult.strategy}
        onNavigateToWorkspace={() => navigate('/skill-gaps')}
      />
    </div>
  );
};

export default LearningRoadmapPage;
