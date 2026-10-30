import React from 'react';
import RoadmapPreview from '../RoadmapPreview';
import { IconMap } from '../Icons';
import { RoadmapPhase } from '../../../data/sampleData';

interface RoadmapFullViewProps {
  roadmap: RoadmapPhase[];
  targetRoleTitle?: string;
}

export const RoadmapFullView: React.FC<RoadmapFullViewProps> = ({
  roadmap,
  targetRoleTitle = 'Cloud Solutions Architect',
}) => {
  return (
    <div className="view-container">
      <div className="view-header-card">
        <div>
          <span className="view-badge">Learning Architecture</span>
          <h2 className="view-main-title">Personalized Learning Roadmap</h2>
          <p className="view-sub-text">
            Step-by-step curriculum formulated for <strong>{targetRoleTitle}</strong> with realistic time commitments.
          </p>
        </div>
      </div>

      <div className="roadmap-strategy-card">
        <div className="strategy-header">
          <div className="strategy-icon">
            <IconMap className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h3 className="strategy-title">Target Progression Strategy</h3>
            <p className="strategy-desc">
              Focus is weighted towards Hands-On Container Orchestration (Phase 2) and Distributed Cloud Architectures (Phase 3). Total estimated study effort: <strong>137 hours</strong> across 16 weeks.
            </p>
          </div>
        </div>

        <div className="strategy-metrics-row">
          <div className="strategy-metric">
            <span className="metric-label">Weekly Recommended Pace</span>
            <span className="metric-value">8 - 10 hours/wk</span>
          </div>
          <div className="strategy-metric">
            <span className="metric-label">Completed Units</span>
            <span className="metric-value text-emerald">5 of 11 modules</span>
          </div>
          <div className="strategy-metric">
            <span className="metric-label">Est. Completion Target</span>
            <span className="metric-value">March 2027</span>
          </div>
        </div>
      </div>

      <RoadmapPreview roadmap={roadmap} targetRoleTitle={targetRoleTitle} />
    </div>
  );
};

export default RoadmapFullView;

