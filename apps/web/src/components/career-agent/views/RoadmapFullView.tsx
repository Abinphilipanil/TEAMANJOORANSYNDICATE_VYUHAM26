import React, { useMemo } from 'react';
import { 
  Milestone, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  BarChart3, 
  Zap, 
  Layers, 
  Map,
  Target 
} from 'lucide-react';
import RoadmapPreview from '../RoadmapPreview';
import { RoadmapPhase } from '../../../data/sampleData';

interface RoadmapFullViewProps {
  roadmap: RoadmapPhase[];
  targetRoleTitle?: string;
  strategy?: {
    immediatePriority: string;
    description: string;
    recommendedVelocity?: string;
    verificationModel?: string;
    totalHours?: string;
    duration?: string;
    weeklyCommitment?: string;
    completedUnits?: string;
    completionPercent?: number;
    targetDate?: string;
  };
  onNavigateToWorkspace?: () => void;
}

export const RoadmapFullView: React.FC<RoadmapFullViewProps> = ({
  roadmap,
  targetRoleTitle = 'Cloud Solutions Architect',
  strategy,
  onNavigateToWorkspace,
}) => {
  // Calculate real metrics from the roadmap data
  const overviewMetrics = useMemo(() => {
    let totalHours = 0;
    let completedSteps = 0;
    let totalSteps = 0;

    roadmap.forEach((phase) => {
      phase.steps.forEach((step) => {
        totalSteps += 1;
        if (step.status === 'completed') {
          completedSteps += 1;
        }
        const hourMatch = step.duration.match(/(\d+)\s*hr/);
        if (hourMatch) {
          totalHours += parseInt(hourMatch[1], 10);
        }
      });
    });

    const totalWeeks = roadmap.reduce((acc, p) => {
      const match = p.duration.match(/(\d+)\s*Week/i);
      return acc + (match ? parseInt(match[1], 10) : 4);
    }, 0);

    const completionPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const weeklyHours = totalWeeks > 0 ? Math.round(totalHours / totalWeeks) : 10;

    const targetDateObj = new Date();
    targetDateObj.setDate(targetDateObj.getDate() + Math.max(4, totalWeeks) * 7);
    const dynamicTargetDate = targetDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return {
      totalHours: strategy?.totalHours || (totalHours > 0 ? `${totalHours} Hours` : '137 Hours'),
      duration: strategy?.duration || `${totalWeeks || 16} Weeks`,
      weeklyCommitment: strategy?.weeklyCommitment || `${weeklyHours} - ${weeklyHours + 2} hrs/wk`,
      completedUnits: strategy?.completedUnits || `${completedSteps} of ${totalSteps} Units`,
      completionPercent: strategy?.completionPercent !== undefined ? strategy.completionPercent : completionPercent,
      targetDate: strategy?.targetDate || dynamicTargetDate,
    };
  }, [roadmap, strategy]);

  const immediatePriorityText = useMemo(() => {
    if (strategy?.immediatePriority) return strategy.immediatePriority;
    const active = roadmap.find((p) => p.status === 'In Progress') || roadmap[0];
    return active ? `${active.title} (${active.phase})` : 'Core Architecture Alignment';
  }, [roadmap, strategy]);

  return (
    <div className="ci-view-container ca-learning-roadmap">
      {/* 1. Header Card */}
      <header className="ci-page-header">
        <div className="ci-header-content">
          <span className="ci-eyebrow">
            <Milestone className="w-3.5 h-3.5" />
            Learning Architecture
          </span>
          <h1 className="ci-title">Personalized Learning Roadmap</h1>
          <p className="ci-subtitle">
            Sequenced modular curriculum calibrated to bridge verified competency gaps for{' '}
            <strong className="text-slate-900">{targetRoleTitle}</strong> with realistic time commitments.
          </p>
        </div>

        <div className="ci-header-actions">
          <span className="ci-skill-chip chip-matched" style={{ fontSize: '13px', padding: '6px 14px' }}>
            <Target className="w-4 h-4" />
            Role: {targetRoleTitle}
          </span>
        </div>
      </header>

      {/* 2. Roadmap Executive Overview (5 Metrics Cards) */}
      <section className="ci-summary-grid" aria-label="Roadmap Curriculum Summary">
        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Estimated Effort</span>
            <div className="ci-summary-icon icon-blue">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value">{overviewMetrics.totalHours}</span>
          <span className="ci-summary-subtext">Across {roadmap.length} sequential phases</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Estimated Duration</span>
            <div className="ci-summary-icon icon-emerald">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-emerald-600">{overviewMetrics.duration}</span>
          <span className="ci-summary-subtext">Structured milestone progression</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Weekly Commitment</span>
            <div className="ci-summary-icon icon-amber">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value">{overviewMetrics.weeklyCommitment}</span>
          <span className="ci-summary-subtext">Self-paced project practice</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Completed Modules</span>
            <div className="ci-summary-icon icon-blue">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-blue-600">{overviewMetrics.completedUnits}</span>
          <span className="ci-summary-subtext">{overviewMetrics.completionPercent}% overall completion</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Target Completion</span>
            <div className="ci-summary-icon icon-blue">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value">{overviewMetrics.targetDate}</span>
          <span className="ci-summary-subtext">Projected certification timeline</span>
        </div>
      </section>

      {/* 3. Target Progression Strategy Informational Panel */}
      <section className="ci-strategy-card" aria-labelledby="progression-strategy-heading">
        <div className="ci-strategy-top">
          <div className="ci-strategy-icon-box">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 id="progression-strategy-heading" className="ci-strategy-title">
              Target Progression Strategy & Core Priorities
            </h2>
            <p className="ci-strategy-desc">
              {strategy?.description || (
                <>
                  Focus is strategically weighted toward <strong>{immediatePriorityText}</strong>. Curriculum activities are sequenced to maximize rapid prototype deployment and role readiness.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="ci-strategy-metrics-row">
          <div className="ci-strategy-metric">
            <span className="lbl">Immediate Priority</span>
            <span className="val text-primary">{strategy?.immediatePriority || immediatePriorityText}</span>
          </div>
          <div className="ci-strategy-metric">
            <span className="lbl">Recommended Velocity</span>
            <span className="val text-emerald">{strategy?.recommendedVelocity || '2 Modules per Month'}</span>
          </div>
          <div className="ci-strategy-metric">
            <span className="lbl">Verification Model</span>
            <span className="val">{strategy?.verificationModel || 'Sandboxed Project Proofs'}</span>
          </div>
        </div>
      </section>

      {/* 4. Sequential Interactive Roadmap Timeline */}
      <RoadmapPreview 
        roadmap={roadmap} 
        targetRoleTitle={targetRoleTitle}
        onNavigateToWorkspace={onNavigateToWorkspace}
      />
    </div>
  );
};

export default RoadmapFullView;
