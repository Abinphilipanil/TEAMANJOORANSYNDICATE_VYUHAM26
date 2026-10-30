import React from 'react';
import { IconClock, IconCheckCircle } from './Icons';
import { RoadmapPhase } from '../../data/sampleData';

interface RoadmapPreviewProps {
  roadmap: RoadmapPhase[];
  targetRoleTitle?: string;
  onViewFullRoadmap?: () => void;
}

export const RoadmapPreview: React.FC<RoadmapPreviewProps> = ({
  roadmap,
  targetRoleTitle = 'Cloud Solutions Architect',
  onViewFullRoadmap,
}) => {
  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div>
          <div className="badge-title-row">
            <h2 className="section-title">Personalized Learning Roadmap</h2>
            <span className="section-badge-pill">Role: {targetRoleTitle}</span>
          </div>
          <p className="section-subtitle">
            Step-by-step modular curriculum customized to bridge verified skill gaps.
          </p>
        </div>

        {onViewFullRoadmap && (
          <button
            type="button"
            className="btn-secondary-link"
            onClick={onViewFullRoadmap}
          >
            Open Full Curriculum &rarr;
          </button>
        )}
      </div>

      <div className="roadmap-phases-timeline">
        {roadmap.map((phase, idx) => {
          const statusClass =
            phase.status === 'Completed'
              ? 'phase-completed'
              : phase.status === 'In Progress'
              ? 'phase-in-progress'
              : 'phase-upcoming';

          return (
            <div key={idx} className={`timeline-phase-card ${statusClass}`}>
              <div className="phase-card-header">
                <div className="phase-meta-col">
                  <span className="phase-tag">{phase.phase}</span>
                  <h3 className="phase-title">{phase.title}</h3>
                </div>

                <div className="phase-status-col">
                  <span className={`phase-status-pill ${statusClass}`}>
                    {phase.status === 'Completed' && (
                      <IconCheckCircle className="w-3.5 h-3.5 inline-icon" />
                    )}
                    {phase.status}
                  </span>
                  <span className="phase-duration">
                    <IconClock className="w-3.5 h-3.5 inline-icon" /> {phase.duration}
                  </span>
                </div>
              </div>

              <p className="phase-summary">{phase.summary}</p>

              <div className="phase-progress-mini">
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${phase.completionPercentage}%` }}
                  />
                </div>
                <span className="progress-bar-text">{phase.completionPercentage}% Complete</span>
              </div>

              <div className="phase-steps-list">
                <span className="steps-list-label">Curriculum Milestones:</span>
                <div className="steps-chips-grid">
                  {phase.steps.map((step) => {
                    const stepIcon =
                      step.status === 'completed'
                        ? '✓ '
                        : step.status === 'in-progress'
                        ? '► '
                        : '○ ';

                    return (
                      <div
                        key={step.id}
                        className={`step-item-pill status-${step.status}`}
                        title={`${step.title} (${step.duration})`}
                      >
                        <span className="step-icon-glyph">{stepIcon}</span>
                        <span className="step-name">{step.title}</span>
                        <span className="step-time">({step.duration})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPreview;

