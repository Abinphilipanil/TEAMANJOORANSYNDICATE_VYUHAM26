import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import CareerExplorerView from '../components/career-agent/views/CareerExplorerView';
import { careerRecommendations, CareerRecommendation } from '../data/sampleData';
import { useApp } from '../context/AppContext';

export const JobMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRole: contextRole, setSelectedRole: setContextRole, resumeAnalysisResult } = useApp();

  const [selectedRole, setSelectedRole] = useState<CareerRecommendation>(() => {
    if (contextRole?.title) {
      const match = careerRecommendations.find(
        (r) => r.roleName.toLowerCase() === contextRole.title.toLowerCase()
      );
      if (match) return match;
    }
    return careerRecommendations[0];
  });

  // Dynamically calibrate match score when resume analysis is present
  const activeRecommendations = useMemo(() => {
    if (!resumeAnalysisResult) return careerRecommendations;
    return careerRecommendations.map((r) => {
      const isSelected = r.id === selectedRole.id || r.roleName.toLowerCase() === (contextRole?.title || '').toLowerCase();
      if (isSelected) {
        const score = resumeAnalysisResult.overallMatch?.score ?? r.matchPercentage;
        return {
          ...r,
          matchPercentage: score,
          matchLevel:
            score >= 80 ? 'High Match' : score >= 60 ? 'Moderate Match' : 'Developing Match',
        };
      }
      return r;
    });
  }, [resumeAnalysisResult, selectedRole.id, contextRole?.title]);

  const activeSelectedRole = useMemo(() => {
    return activeRecommendations.find((r) => r.id === selectedRole.id) || selectedRole;
  }, [activeRecommendations, selectedRole]);

  const handleSelectRole = (role: CareerRecommendation) => {
    setSelectedRole(role);
    setContextRole({
      id: role.id,
      slug: role.id,
      title: role.roleName,
      domain: 'Web & Cloud',
      summary: role.description,
      overviewDescription: role.fitRationale,
      salaryInsight: {
        entryLevelINR: '₹8,00,000 - ₹12,00,000',
        midLevelINR: role.averageSalary,
        seniorLevelINR: '₹25,00,000+',
        marketTrend: 'High Demand',
        trendPercentage: '+24%',
        sourceCitation: 'Industry Benchmark 2026',
        isDemoData: false,
      },
      requiredTechnicalSkills: role.matchingSkills.map((s) => ({
        name: s,
        category: 'cloud_devops',
        importance: 'critical',
        minimumProficiency: 'intermediate',
      })),
      requiredSoftSkills: [],
      coreCompetencies: role.matchingSkills,
      typicalRolesIncluded: [role.roleName],
    });
  };

  return (
    <div className="ca-page-container ca-job-matching-page">
      {resumeAnalysisResult && (
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
          aria-label="AI Role Alignment Status"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                AI Evaluated Candidate Fit
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginLeft: '8px' }}>
                Overall role alignment computed at <strong>{resumeAnalysisResult.overallMatch?.score}%</strong> based on your evaluated credentials.
              </span>
            </div>
          </div>
          <button
            type="button"
            className="ci-btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => navigate('/analysis-results')}
          >
            Detailed Fit Breakdown <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
          </button>
        </aside>
      )}

      <CareerExplorerView
        careerRecommendations={activeRecommendations}
        selectedRole={activeSelectedRole}
        onSelectRole={handleSelectRole}
        onNavigateToRoadmap={() => navigate('/learning-roadmap')}
      />
    </div>
  );
};

export default JobMatchingPage;
