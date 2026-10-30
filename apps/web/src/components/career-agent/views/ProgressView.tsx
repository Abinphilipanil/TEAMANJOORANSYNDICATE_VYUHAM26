import React from 'react';
import { IconClock } from '../Icons';
import { RoadmapPhase } from '../../../data/sampleData';

interface ProgressViewProps {
  metrics: {
    roadmapProgressPercent: number;
    completedMilestones: number;
    totalMilestones: number;
  };
  roadmap: RoadmapPhase[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ metrics, roadmap }) => {
  return (
    <div className="view-container">
      <div className="view-header-card">
        <div>
          <span className="view-badge">Learning Analytics</span>
          <h2 className="view-main-title">Progress & Milestone Tracking</h2>
          <p className="view-sub-text">
            Track module completions, study hours invested, and readiness velocity towards target certification.
          </p>
        </div>
      </div>

      <div className="progress-kpi-grid">
        <div className="progress-kpi-card">
          <span className="kpi-label">Overall Completion</span>
          <div className="kpi-val-row">
            <span className="kpi-number">{metrics.roadmapProgressPercent}%</span>
            <span className="kpi-pill pill-green">+12% this month</span>
          </div>
          <div className="kpi-bar-track">
            <div className="kpi-bar-fill" style={{ width: `${metrics.roadmapProgressPercent}%` }} />
          </div>
          <span className="kpi-sub">7 milestones completed out of 11 total</span>
        </div>

        <div className="progress-kpi-card">
          <span className="kpi-label">Study Hours Invested</span>
          <div className="kpi-val-row">
            <span className="kpi-number">64 hrs</span>
            <span className="kpi-pill pill-blue">On Track</span>
          </div>
          <div className="kpi-bar-track">
            <div className="kpi-bar-fill fill-blue" style={{ width: '47%' }} />
          </div>
          <span className="kpi-sub">Target: 137 total curriculum hours</span>
        </div>

        <div className="progress-kpi-card">
          <span className="kpi-label">Consecutive Weekly Streak</span>
          <div className="kpi-val-row">
            <span className="kpi-number">5 Weeks</span>
            <span className="kpi-pill pill-purple">High Consistency</span>
          </div>
          <div className="kpi-bar-track">
            <div className="kpi-bar-fill fill-purple" style={{ width: '80%' }} />
          </div>
          <span className="kpi-sub">Active sprint: Kubernetes & Helm packaging</span>
        </div>
      </div>

      <div className="dashboard-section-card">
        <div className="section-card-header">
          <h2 className="section-title">Milestone Breakdown by Phase</h2>
          <span className="section-badge-pill">Verification Status</span>
        </div>

        <div className="phase-milestone-list">
          {roadmap.map((phase) => (
            <div key={phase.phase} className="milestone-row">
              <div className="milestone-left">
                <span className="milestone-phase-tag">{phase.phase}</span>
                <div>
                  <h4 className="milestone-name">{phase.title}</h4>
                  <span className="milestone-time">
                    <IconClock className="w-3.5 h-3.5 inline-icon" /> {phase.duration}
                  </span>
                </div>
              </div>

              <div className="milestone-right">
                <div className="milestone-progress-bar">
                  <div
                    className="milestone-progress-fill"
                    style={{ width: `${phase.completionPercentage}%` }}
                  />
                </div>
                <span className="milestone-pct">{phase.completionPercentage}%</span>
                <span className={`milestone-badge badge-${phase.status.toLowerCase().replace(' ', '-')}`}>
                  {phase.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;

