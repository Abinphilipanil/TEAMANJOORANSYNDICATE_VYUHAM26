import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Target
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

  const counts = useMemo(() => {
    const high = skillGaps.filter(
      (g) => g.priority.toLowerCase() === 'critical' || g.priority.toLowerCase() === 'high'
    ).length;
    const medium = skillGaps.filter((g) => g.priority.toLowerCase() === 'medium').length;
    return { all: skillGaps.length, high, medium };
  }, [skillGaps]);

  const filteredGaps = useMemo(() => {
    if (filterPriority === 'High & Critical') {
      return skillGaps.filter(
        (g) => g.priority.toLowerCase() === 'critical' || g.priority.toLowerCase() === 'high'
      );
    }
    if (filterPriority === 'Medium') {
      return skillGaps.filter((g) => g.priority.toLowerCase() === 'medium');
    }
    return skillGaps;
  }, [skillGaps, filterPriority]);

  return (
    <section className="ci-section-box" aria-labelledby="skill-gaps-heading">
      <div className="ci-section-header-row">
        <div className="ci-section-header-title-wrap">
          <h2 id="skill-gaps-heading">Prioritized Skills to Learn ({filteredGaps.length})</h2>
          <p>
            Missing competencies required to transition into{' '}
            <strong className="text-slate-900">{targetRoleTitle}</strong>, ranked by market priority with recommended actions and estimated time.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="ci-filter-bar" role="toolbar" aria-label="Priority filters">
          <button
            type="button"
            className={`ci-filter-btn ${filterPriority === 'All' ? 'active' : ''}`}
            onClick={() => setFilterPriority('All')}
          >
            All Priorities ({counts.all})
          </button>
          <button
            type="button"
            className={`ci-filter-btn ${filterPriority === 'High & Critical' ? 'active' : ''}`}
            onClick={() => setFilterPriority('High & Critical')}
          >
            High & Critical Priority ({counts.high})
          </button>
          <button
            type="button"
            className={`ci-filter-btn ${filterPriority === 'Medium' ? 'active' : ''}`}
            onClick={() => setFilterPriority('Medium')}
          >
            Medium Priority ({counts.medium})
          </button>
        </div>
      </div>

      <div className="ci-gaps-list">
        {filteredGaps.map((gap) => {
          const pLower = gap.priority.toLowerCase();
          const priorityClass =
            pLower === 'critical'
              ? 'priority-critical'
              : pLower === 'high'
              ? 'priority-high'
              : 'priority-medium';

          return (
            <article key={gap.id} className="ci-gap-item-card">
              {/* Card Header: Priority Pill, Skill Name, Category, and Estimated Time */}
              <div className="ci-gap-item-header">
                <div className="ci-gap-title-group">
                  <span className={`ci-priority-pill ${priorityClass}`}>
                    {gap.priority} Priority
                  </span>
                  <h3 className="ci-gap-name">{gap.skill}</h3>
                  <span className="ci-gap-category">{gap.category}</span>
                </div>

                {/* Estimated Time in Correct Top-Right Position */}
                <div className="ci-gap-time" title="Estimated study time">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Est. {gap.estimatedHours}</span>
                </div>
              </div>

              {/* Recommended Action & Requirement Context (No Percentage Progress Bars) */}
              <div className="ci-gap-details-card">
                <div className="ci-gap-detail-row">
                  <span className="ci-gap-detail-label">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    Recommended Action:
                  </span>
                  <p className="ci-gap-detail-text">{gap.recommendedAction}</p>
                </div>

                {gap.importanceReason && gap.importanceReason !== gap.recommendedAction && (
                  <div className="ci-gap-detail-row ci-gap-reason-row">
                    <span className="ci-gap-detail-label">
                      <Target className="w-4 h-4 text-slate-500 shrink-0" />
                      Role Requirement:
                    </span>
                    <p className="ci-gap-detail-text text-slate-600">{gap.importanceReason}</p>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {filteredGaps.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No skill gaps found for the selected priority filter.
          </div>
        )}
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
