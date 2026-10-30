import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
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
      : skillGaps.filter((g) => g.priority.toLowerCase() === filterPriority.toLowerCase());

  return (
    <section className="ci-section-box" aria-labelledby="skill-gaps-heading">
      <div className="ci-section-header-row">
        <div className="ci-section-header-title-wrap">
          <h2 id="skill-gaps-heading">Prioritized Skill Gap Analysis</h2>
          <p>
            Identified competencies required to transition into{' '}
            <strong className="text-slate-900">{targetRoleTitle}</strong>, ranked by market urgency.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="ci-filter-bar" role="toolbar" aria-label="Priority filters">
          {['All', 'Critical', 'High', 'Medium'].map((priority) => (
            <button
              key={priority}
              type="button"
              className={`ci-filter-btn ${filterPriority.toLowerCase() === priority.toLowerCase() ? 'active' : ''}`}
              onClick={() => setFilterPriority(priority)}
            >
              {priority} Priority
            </button>
          ))}
        </div>
      </div>

      <div className="ci-gaps-list">
        {filteredGaps.map((gap) => {
          const priorityClass =
            gap.priority.toLowerCase() === 'critical'
              ? 'priority-critical'
              : gap.priority.toLowerCase() === 'high'
              ? 'priority-high'
              : 'priority-medium';

          const gapSize = Math.max(0, gap.targetScore - gap.currentScore);

          return (
            <article key={gap.id} className="ci-gap-item-card">
              <div className="ci-gap-item-header">
                <div className="ci-gap-title-group">
                  <span className={`ci-priority-pill ${priorityClass}`}>
                    {gap.priority} Priority
                  </span>
                  <h3 className="ci-gap-name">{gap.skill}</h3>
                  <span className="ci-gap-category">{gap.category}</span>
                </div>

                <div className="ci-gap-time">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. {gap.estimatedHours}</span>
                </div>
              </div>

              {/* Dual-Point Comparative Progress Bar */}
              <div className="ci-gap-comparison-block">
                <div className="ci-comparison-labels">
                  <span className="ci-cur-label">
                    Current: <strong>{gap.currentLevel}</strong> ({gap.currentScore}%)
                  </span>
                  <span className="ci-gap-delta-pill">+{gapSize}% Gap to Close</span>
                  <span className="ci-tar-label">
                    Target: <strong>{gap.targetLevel}</strong> ({gap.targetScore}%)
                  </span>
                </div>

                <div className="ci-dual-meter-track" title={`Current: ${gap.currentScore}%, Target Benchmark: ${gap.targetScore}%`}>
                  <div
                    className="ci-dual-meter-target"
                    style={{ width: `${gap.targetScore}%` }}
                  />
                  <div
                    className="ci-dual-meter-current"
                    style={{ width: `${gap.currentScore}%` }}
                  />
                </div>
              </div>

              {/* Recommended Action Callout */}
              <div className="ci-gap-action-box">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <strong>Recommended Action:</strong> {gap.recommendedAction}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {onNavigateToRoadmap && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <button
            type="button"
            className="ci-btn-primary"
            onClick={onNavigateToRoadmap}
          >
            Bridge Gaps with Structured Roadmap
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default SkillGapOverview;
