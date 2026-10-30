import React from 'react';
import { IconCheckCircle, IconTarget, IconAlertTriangle, IconClock } from './Icons';

interface SummaryCardsProps {
  metrics: {
    currentSkillsCount: number;
    recommendedRolesCount: number;
    identifiedGapsCount: number;
    roadmapProgressPercent: number;
    completedMilestones: number;
    totalMilestones: number;
  };
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  return (
    <div className="summary-cards-grid">
      {/* Card 1: Verified Skills */}
      <div className="summary-card">
        <div className="card-header-row">
          <span className="card-label">Current Skills</span>
          <div className="card-icon-badge bg-blue-subtle">
            <IconCheckCircle className="w-5 h-5 text-blue" />
          </div>
        </div>
        <div className="card-value-row">
          <span className="card-value">{metrics.currentSkillsCount}</span>
          <span className="card-unit">Competencies</span>
        </div>
        <p className="card-footer-text">
          Extracted from your resume & validated via practical projects
        </p>
      </div>

      {/* Card 2: Recommended Roles */}
      <div className="summary-card">
        <div className="card-header-row">
          <span className="card-label">Target Roles</span>
          <div className="card-icon-badge bg-emerald-subtle">
            <IconTarget className="w-5 h-5 text-emerald" />
          </div>
        </div>
        <div className="card-value-row">
          <span className="card-value">{metrics.recommendedRolesCount}</span>
          <span className="card-unit">Matched</span>
        </div>
        <p className="card-footer-text">
          High overlap with cloud & full-stack development tracks
        </p>
      </div>

      {/* Card 3: Identified Gaps */}
      <div className="summary-card">
        <div className="card-header-row">
          <span className="card-label">Skill Gaps</span>
          <div className="card-icon-badge bg-amber-subtle">
            <IconAlertTriangle className="w-5 h-5 text-amber" />
          </div>
        </div>
        <div className="card-value-row">
          <span className="card-value text-amber">{metrics.identifiedGapsCount}</span>
          <span className="card-unit">Identified</span>
        </div>
        <p className="card-footer-text">
          2 critical priorities: Kubernetes and Terraform IaC
        </p>
      </div>

      {/* Card 4: Roadmap Progress */}
      <div className="summary-card">
        <div className="card-header-row">
          <span className="card-label">Roadmap Progress</span>
          <div className="card-icon-badge bg-purple-subtle">
            <IconClock className="w-5 h-5 text-purple" />
          </div>
        </div>
        <div className="card-value-row">
          <span className="card-value">{metrics.roadmapProgressPercent}%</span>
          <span className="card-unit">
            {metrics.completedMilestones}/{metrics.totalMilestones} steps
          </span>
        </div>
        <div className="card-mini-progress">
          <div
            className="mini-progress-fill"
            style={{ width: `${metrics.roadmapProgressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

