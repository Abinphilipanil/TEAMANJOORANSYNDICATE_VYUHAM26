import React, { useState } from 'react';
import { IconAlertTriangle, IconCheckCircle, IconClock } from './Icons';
import { SkillGapItem } from '../../data/sampleData';

interface SkillGapOverviewProps {
  skillGaps: SkillGapItem[];
  targetRoleTitle?: string;
  onNavigateToRoadmap?: () => void;
}

export const SkillGapOverview: React.FC<SkillGapOverviewProps> = ({
  skillGaps,
  targetRoleTitle = 'Cloud Solutions Architect',
  onNavigateToRoadmap,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const filteredGaps =
    filterPriority === 'All'
      ? skillGaps
      : skillGaps.filter((g) => g.priority === filterPriority);

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div>
          <div className="badge-title-row">
            <h2 className="section-title">Prioritized Skill Gap Analysis</h2>
            <span className="section-badge-pill">Target: {targetRoleTitle}</span>
          </div>
          <p className="section-subtitle">
            Identified competencies required to transition into the target role, ranked by market urgency.
          </p>
        </div>

        <div className="filter-pills-row">
          {['All', 'Critical', 'High', 'Medium'].map((priority) => (
            <button
              key={priority}
              type="button"
              className={`filter-pill ${filterPriority === priority ? 'active' : ''}`}
              onClick={() => setFilterPriority(priority)}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      <div className="skill-gaps-table-wrapper">
        <div className="gaps-list">
          {filteredGaps.map((gap) => {
            const priorityClass = `priority-${gap.priority.toLowerCase()}`;

            return (
              <div key={gap.id} className="gap-item-card">
                <div className="gap-item-header">
                  <div className="gap-title-group">
                    <span className={`priority-badge ${priorityClass}`}>
                      {gap.priority} Priority
                    </span>
                    <h3 className="gap-skill-name">{gap.skill}</h3>
                    <span className="gap-category-tag">{gap.category}</span>
                  </div>

                  <div className="gap-time-estimate">
                    <IconClock className="w-3.5 h-3.5 inline-icon" />
                    <span>Est. {gap.estimatedHours}</span>
                  </div>
                </div>

                <div className="gap-progress-section">
                  <div className="gap-levels-row">
                    <span className="level-current">
                      Current: <strong>{gap.currentLevel}</strong> ({gap.currentScore}%)
                    </span>
                    <span className="level-arrow">&rarr;</span>
                    <span className="level-target">
                      Target: <strong>{gap.targetLevel}</strong> ({gap.targetScore}%)
                    </span>
                  </div>

                  <div className="gap-progress-track">
                    <div
                      className="gap-progress-fill-current"
                      style={{ width: `${gap.currentScore}%` }}
                      title={`Current proficiency: ${gap.currentScore}%`}
                    />
                    <div
                      className="gap-progress-fill-target"
                      style={{ width: `${gap.targetScore}%` }}
                      title={`Target benchmark: ${gap.targetScore}%`}
                    />
                  </div>
                </div>

                <div className="gap-action-box">
                  <span className="gap-action-label">
                    <IconCheckCircle className="w-3.5 h-3.5 inline-icon text-blue" /> Recommended Action:
                  </span>
                  <p className="gap-action-text">{gap.recommendedAction}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onNavigateToRoadmap && (
        <div className="section-footer-banner">
          <span className="footer-banner-text">
            Ready to close these skill gaps with structured learning modules?
          </span>
          <button
            type="button"
            className="btn-action-primary"
            onClick={onNavigateToRoadmap}
          >
            Generate Learning Roadmap &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillGapOverview;

