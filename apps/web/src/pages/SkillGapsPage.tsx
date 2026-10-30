import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Info, ArrowRight } from 'lucide-react';
import SkillAnalysisView from '../components/career-agent/views/SkillAnalysisView';
import { currentSkills as sampleCurrentSkills, skillGaps as sampleSkillGaps } from '../data/sampleData';
import { useApp } from '../context/AppContext';
import { generateDynamicSkillGapsFromAnalysis } from '../utils/dynamicRoadmap';

export const SkillGapsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRole, resumeAnalysisResult } = useApp();
  const targetRoleTitle = selectedRole?.title || 'Cloud Solutions Architect';

  // Derive dynamic skills and gaps from the live AI resume analysis result
  const dynamicGapsData = useMemo(() => {
    return generateDynamicSkillGapsFromAnalysis(resumeAnalysisResult, targetRoleTitle);
  }, [resumeAnalysisResult, targetRoleTitle]);

  const activeCurrentSkills = dynamicGapsData.isAiGenerated && dynamicGapsData.currentSkills.length > 0
    ? dynamicGapsData.currentSkills
    : sampleCurrentSkills;

  const activeSkillGaps = dynamicGapsData.isAiGenerated && dynamicGapsData.skillGaps.length > 0
    ? dynamicGapsData.skillGaps
    : sampleSkillGaps;

  return (
    <div className="ca-page-container ca-skill-gaps-page">
      {/* Live AI Status Banner */}
      {dynamicGapsData.isAiGenerated ? (
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
          aria-label="AI Skill Gap Status"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                Live AI Competency Extraction
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>
                Verified {activeCurrentSkills.length} demonstrated skills and identified {activeSkillGaps.length} prioritizeable gaps from your resume.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="ci-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => navigate('/learning-roadmap')}
          >
            Personalized Roadmap <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
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
          aria-label="AI Skill Gap Status"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                Showing Benchmark Skill Gap Profile
              </span>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>
                Analyze your resume against a target job to replace demonstration benchmarks with your live verified skills and gaps.
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

      <SkillAnalysisView
        currentSkills={activeCurrentSkills}
        skillGaps={activeSkillGaps}
        targetRoleTitle={targetRoleTitle}
        onNavigateToRoadmap={() => navigate('/learning-roadmap')}
      />
    </div>
  );
};

export default SkillGapsPage;
