import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { Opportunity } from '@af03/contracts';
import { 
  Sparkles, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  ShieldAlert, 
  Award, 
  Layers, 
  Milestone, 
  RotateCw,
  Target,
  FileText,
  Globe
} from 'lucide-react';
import { 
  generateDynamicSkillGapsFromAnalysis, 
  generateDynamicRoadmapFromAnalysis 
} from '../utils/dynamicRoadmap';
import { currentSkills as sampleCurrentSkills, skillGaps as sampleSkillGaps, learningRoadmap as sampleRoadmap } from '../data/sampleData';

export const AgentOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resumeAnalysisResult, selectedRole, userProfile, roadmap } = useApp();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const targetRoleTitle = selectedRole?.title || 'Cloud Solutions Architect';

  // 1. Dynamic Skill Gaps and Verified Skills from Agent Pipeline
  const dynamicGapsData = useMemo(() => {
    return generateDynamicSkillGapsFromAnalysis(resumeAnalysisResult, targetRoleTitle);
  }, [resumeAnalysisResult, targetRoleTitle]);

  const activeCurrentSkills = dynamicGapsData.isAiGenerated && dynamicGapsData.currentSkills.length > 0
    ? dynamicGapsData.currentSkills
    : sampleCurrentSkills;

  const activeSkillGaps = dynamicGapsData.isAiGenerated && dynamicGapsData.skillGaps.length > 0
    ? dynamicGapsData.skillGaps
    : sampleSkillGaps;

  // 2. Dynamic Roadmap Progression from Agent Pipeline
  const dynamicRoadmapData = useMemo(() => {
    return generateDynamicRoadmapFromAnalysis(resumeAnalysisResult, targetRoleTitle, roadmap);
  }, [resumeAnalysisResult, targetRoleTitle, roadmap]);

  const activeRoadmap = dynamicRoadmapData.isAiGenerated ? dynamicRoadmapData.phases : sampleRoadmap;
  const activeStrategy = dynamicRoadmapData.strategy;

  // Candidate verified skills list
  const candidateSkills = useMemo(() => {
    const fromAnalysis = resumeAnalysisResult?.skillsBreakdown?.matched?.map((s) => s.name);
    if (fromAnalysis && fromAnalysis.length > 0) return fromAnalysis;
    if (activeCurrentSkills && activeCurrentSkills.length > 0) {
      return activeCurrentSkills.map((s) => s.name);
    }
    return ['React.js', 'Node.js', 'JavaScript', 'SQL'];
  }, [resumeAnalysisResult, activeCurrentSkills]);

  // Tab state for dashboard opportunities section
  const [dashboardOppTab, setDashboardOppTab] = useState<'hackathons' | 'conferences'>('hackathons');

  // 3. Load Live Web-Scraped Opportunities from Devpost + Grounded Conferences + AI Matching
  const loadOpportunities = useCallback(async () => {
    try {
      setLoadingOpps(true);
      const data = await apiClient.getOpportunities(
        targetRoleTitle,
        undefined,
        undefined,
        candidateSkills
      );
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load live opportunities for dashboard:', err);
    } finally {
      setLoadingOpps(false);
    }
  }, [targetRoleTitle, candidateSkills]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities, refreshKey]);

  // 4. Compute Scores: Standard Percentage and Score out of 10
  const matchPercentage = resumeAnalysisResult?.overallMatch?.score ?? 78;
  const scoreOutOf10 = (matchPercentage / 10).toFixed(1);
  const matchCategory = resumeAnalysisResult?.overallMatch?.category || (matchPercentage >= 75 ? 'Strong Potential' : 'Competitive Alignment');
  const readinessStatus = resumeAnalysisResult?.readinessAssessment?.status || 'Interview Ready with Prerequisites';
  const keyStrength = resumeAnalysisResult?.readinessAssessment?.keyStrength || 'Demonstrated core fundamentals directly mirror the target position requirements.';
  const primaryRisk = resumeAnalysisResult?.readinessAssessment?.primaryRisk || 'Key production tools and deployment automation need hands-on proof artifacts.';
  const recommendedTimeline = resumeAnalysisResult?.readinessAssessment?.recommendedTimeline || '2 to 3 weeks of targeted hands-on implementation.';

  // Critical and High priority gaps
  const prioritizedGaps = useMemo(() => {
    return activeSkillGaps.slice(0, 4);
  }, [activeSkillGaps]);

  // Strictly segregated hackathons vs conferences
  const topHackathons = useMemo(() => {
    return opportunities.filter((o) => o.type !== 'conference').slice(0, 4);
  }, [opportunities]);

  const topConferences = useMemo(() => {
    return opportunities.filter((o) => o.type === 'conference').slice(0, 4);
  }, [opportunities]);

  const displayedDashboardOpps = dashboardOppTab === 'hackathons' ? topHackathons : topConferences;

  return (
    <div className="ca-page-container ca-dashboard-page" style={{ paddingBottom: '60px' }}>
      {/* Executive Agent Header */}
      <section className="ci-page-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="ci-section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              CONSOLIDATED AGENT INTELLIGENCE
            </span>
            <h1 className="ci-page-title" style={{ margin: '4px 0 6px 0', fontSize: '28px', fontWeight: 800 }}>
              Executive Career & Skill Dashboard
            </h1>
            <p className="ci-page-description" style={{ margin: 0, maxWidth: '800px', fontSize: '14px', color: '#64748b' }}>
              Autonomous synthesis of your profile, verified competencies, prioritizeable skill gaps, dynamic study roadmap, and live web-scraped hackathon opportunities in a single unified view.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="ci-btn-secondary"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px' }}
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingOpps ? 'animate-spin' : ''}`} />
              <span>Rescan Data</span>
            </button>
            <button
              type="button"
              className="ci-btn-primary"
              onClick={() => navigate('/resume-analysis')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px' }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Update Resume</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live AI Status Banner */}
      <aside
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(16,185,129,0.06))',
          border: '1px solid rgba(37,99,235,0.22)',
          borderRadius: '14px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
        aria-label="Agent Synthesis Status"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)',
              flexShrink: 0,
            }}
          />
          <div>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
              Multi-Module Cognitive Synthesis Active
            </span>
            <span style={{ fontSize: '13px', color: '#475569', marginLeft: '10px' }}>
              Targeting: <strong>{targetRoleTitle}</strong> • Live Groq AI Reasoning + Real-Time Devpost Web Scrape
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#1d4ed8',
              backgroundColor: '#dbeafe',
              padding: '3px 10px',
              borderRadius: '12px',
            }}
          >
            SCORE: {scoreOutOf10} / 10
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#065f46',
              backgroundColor: '#d1fae5',
              padding: '3px 10px',
              borderRadius: '12px',
            }}
          >
            {matchPercentage}% MATCH
          </span>
        </div>
      </aside>

      {/* Overview Metric Summary Strip (4 Cards) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
        aria-label="Executive Metrics"
      >
        {/* Metric 1: Readiness Score (out of 10 & 100%) */}
        <div className="ci-card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Role Readiness Score</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{scoreOutOf10}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>/ 10</span>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginLeft: 'auto' }}>({matchPercentage}%)</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8' }}>
              {matchCategory}
            </span>
          </div>
        </div>

        {/* Metric 2: Verified Skills */}
        <div className="ci-card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Verified Competencies</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{activeCurrentSkills.length}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>demonstrated</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Extracted from resume & profile
            </span>
          </div>
        </div>

        {/* Metric 3: Critical Skill Gaps */}
        <div className="ci-card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Skill Gaps to Bridge</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#e11d48' }}>{activeSkillGaps.length}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>identified</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '8px', background: '#fef2f2', color: '#be123c' }}>
              {activeSkillGaps.filter((g) => g.priority.toLowerCase() === 'critical').length} Critical Priority
            </span>
          </div>
        </div>

        {/* Metric 4: Live Matched Hackathons */}
        <div className="ci-card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Live Opportunities</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{topHackathons.length}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>hackathons + {topConferences.length} summits</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
              Devpost live + verified summits
            </span>
          </div>
        </div>
      </section>

      {/* Strategic Diagnostic Assessment (3 Columns) */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award className="w-4 h-4 text-blue-600" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Executive Readiness Diagnosis & Strategic Advisory
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Key Strength */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Primary Asset & Strength
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {keyStrength}
            </p>
          </div>

          {/* Primary Risk */}
          <div style={{ background: '#fffbfa', padding: '16px', borderRadius: '12px', border: '1px solid #fee4e2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Primary Hiring Risk to Bridge
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {primaryRisk}
            </p>
          </div>

          {/* Target Timeline & Strategy */}
          <div style={{ background: '#eff8ff', padding: '16px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Clock className="w-4 h-4 text-blue-600" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Calibration & Velocity
              </span>
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              <strong>Status:</strong> {readinessStatus}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Est. Timeline: <strong>{recommendedTimeline}</strong> ({activeStrategy.weeklyCommitment})
            </p>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Skill Gaps on Left + Roadmap Snapshot on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        {/* Left Column: Verified Skills & High Priority Gaps */}
        <section
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Verified Skills & Bridgeable Gaps
              </h2>
            </div>
            <button
              type="button"
              className="ci-btn-secondary"
              onClick={() => navigate('/skill-gaps')}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              Full Matrix <ArrowRight className="w-3 h-3 inline ml-1" />
            </button>
          </div>

          {/* Sub-section: Demonstrated Skills Tags */}
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              Verified Current Competencies
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {activeCurrentSkills.slice(0, 10).map((skill, idx) => (
                <span
                  key={`curr-${idx}`}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#065f46',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  ✓ {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '8px 0 16px 0' }} />

          {/* Sub-section: Prioritized Skill Gaps */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
              High-Impact Gaps to Bridge
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {prioritizedGaps.map((gap, idx) => {
                const priorityColor = gap.priority.toLowerCase() === 'critical' ? '#be123c' : gap.priority.toLowerCase() === 'high' ? '#b45309' : '#047857';
                const priorityBg = gap.priority.toLowerCase() === 'critical' ? '#fff1f2' : gap.priority.toLowerCase() === 'high' ? '#fffbeb' : '#ecfdf5';
                const priorityBorder = gap.priority.toLowerCase() === 'critical' ? '#fecdd3' : gap.priority.toLowerCase() === 'high' ? '#fde68a' : '#a7f3d0';

                return (
                  <div
                    key={`gap-${idx}`}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: priorityColor,
                            backgroundColor: priorityBg,
                            border: `1px solid ${priorityBorder}`,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {gap.priority}
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{gap.skill}</strong>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#475569',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        Est. {gap.estimatedHours || (gap as any).estimatedHoursToBridge || '15-20 hrs'}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                      <strong>Why needed:</strong> {gap.importanceReason || (gap as any).reasoning || 'Required for target position competence.'}
                    </p>

                    {gap.recommendedAction && (
                      <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', lineHeight: 1.4, fontWeight: 500 }}>
                        <strong>Action:</strong> {gap.recommendedAction}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Personalized Roadmap Snapshot */}
        <section
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Milestone className="w-4 h-4 text-blue-600" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Personalized Learning Architecture
              </h2>
            </div>
            <button
              type="button"
              className="ci-btn-secondary"
              onClick={() => navigate('/learning-roadmap')}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              Full Roadmap <ArrowRight className="w-3 h-3 inline ml-1" />
            </button>
          </div>

          {/* Roadmap Strategy Meta Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>Immediate Milestone:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                {activeStrategy.duration}
              </span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
              {activeStrategy.immediatePriority}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Total Effort</span>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{activeStrategy.totalHours}</strong>
              </div>
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Weekly Velocity</span>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{activeStrategy.weeklyCommitment}</strong>
              </div>
              <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Target Date</span>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{activeStrategy.targetDate}</strong>
              </div>
            </div>
          </div>

          {/* Roadmap Sequential Phases Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            {activeRoadmap.slice(0, 3).map((phase, idx) => (
              <div
                key={`phase-${idx}`}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: phase.status === 'In Progress' ? '#eff8ff' : '#ffffff',
                  borderColor: phase.status === 'In Progress' ? '#bfdbfe' : '#e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                    {phase.phase} • {phase.status}
                  </span>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginTop: '2px' }}>
                    {phase.title}
                  </strong>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, flexShrink: 0 }}>
                  {phase.duration}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Full-Width Section: Grounded & Segregated Opportunities (Hackathons & Summits) */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {dashboardOppTab === 'hackathons' ? (
                <Trophy className="w-5 h-5 text-amber-600" />
              ) : (
                <Globe className="w-5 h-5 text-purple-600" />
              )}
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {dashboardOppTab === 'hackathons'
                  ? 'Matched Hackathons & Competitions (Devpost Live Scrape)'
                  : 'Premier Tech Conferences & Global Summits (2026-2027)'}
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              {dashboardOppTab === 'hackathons'
                ? `Active coding hackathons with cash prize pools matched to your skills (${candidateSkills.slice(0, 4).join(', ')})`
                : `Official industry summits, architecture keynotes, and student passes matched to your career path`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Segregated Segment Switcher */}
            <div style={{ display: 'inline-flex', padding: '3px', background: '#f1f5f9', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setDashboardOppTab('hackathons')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: dashboardOppTab === 'hackathons' ? '#0f172a' : 'transparent',
                  color: dashboardOppTab === 'hackathons' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                🏆 Hackathons ({topHackathons.length})
              </button>
              <button
                type="button"
                onClick={() => setDashboardOppTab('conferences')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: dashboardOppTab === 'conferences' ? '#581c87' : 'transparent',
                  color: dashboardOppTab === 'conferences' ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                🌐 Conferences ({topConferences.length})
              </button>
            </div>

            <button
              type="button"
              className="ci-btn-secondary"
              onClick={() => navigate('/opportunities')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Explore All <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        </div>

        {loadingOpps ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span style={{ fontSize: '13px' }}>Scraping opportunities & personalizing with AI...</span>
          </div>
        ) : displayedDashboardOpps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              No active {dashboardOppTab} found right now. Try rescanning.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {displayedDashboardOpps.map((opp) => {
              const isConf = opp.type === 'conference';
              return (
                <div
                  key={opp.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: isConf ? '#6b21a8' : '#1d4ed8',
                            background: isConf ? '#f3e8ff' : '#eff6ff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {isConf ? 'TECH SUMMIT' : opp.isLiveScraped ? 'DEVPOST LIVE' : 'HACKATHON'}
                        </span>
                        {opp.matchScore && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#065f46',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              padding: '2px 6px',
                              borderRadius: '10px',
                            }}
                          >
                            {opp.matchScore}% FIT
                          </span>
                        )}
                      </div>
                      {opp.prizeOrPerks && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isConf ? '#4338ca' : '#b45309',
                            background: isConf ? '#e0e7ff' : '#fffbeb',
                            padding: '2px 8px',
                            borderRadius: '8px',
                          }}
                        >
                          {opp.prizeOrPerks}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {opp.title}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                      Organized by {opp.organization}
                    </span>

                    {/* AI Strategic Recommendation */}
                    {opp.aiRecommendation && (
                      <div
                        style={{
                          background: isConf ? '#faf5ff' : '#f0fdf4',
                          border: isConf ? '1px solid #e9d5ff' : '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginBottom: '10px',
                          fontSize: '12px',
                          color: isConf ? '#581c87' : '#14532d',
                          lineHeight: 1.45,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            color: isConf ? '#7e22ce' : '#15803d',
                            marginBottom: '2px',
                          }}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isConf ? 'Keynote & Workshop Strategy' : 'AI Hackathon Strategy'}</span>
                        </div>
                        {opp.aiRecommendation}
                      </div>
                    )}

                    {/* Matched / Relevant Skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {opp.relevantSkills.slice(0, 4).map((skill) => {
                        const isMatched = candidateSkills.some(
                          (s) => s.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(s.toLowerCase())
                        );
                        return (
                          <span
                            key={skill}
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: isMatched ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                              background: isMatched ? '#ecfdf5' : '#f8fafc',
                              color: isMatched ? '#065f46' : '#475569',
                              fontWeight: isMatched ? 600 : 500,
                            }}
                          >
                            {isMatched ? `✓ ${skill}` : skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.deadlineDate || opp.startDate}</span>
                    </div>
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ci-btn-primary"
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none',
                        background: isConf ? '#581c87' : '#0f172a',
                      }}
                    >
                      <span>{isConf ? 'Summit Website' : 'Apply / Register'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AgentOverviewDashboard;
