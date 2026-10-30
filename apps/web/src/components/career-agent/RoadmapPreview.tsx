import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Play, 
  Lock, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  FolderKanban, 
  Sparkles 
} from 'lucide-react';
import { RoadmapPhase, RoadmapStep } from '../../data/sampleData';

interface RoadmapPreviewProps {
  roadmap: RoadmapPhase[];
  targetRoleTitle?: string;
  onViewFullRoadmap?: () => void;
  onNavigateToWorkspace?: () => void;
}

export const RoadmapPreview: React.FC<RoadmapPreviewProps> = ({
  roadmap,
  targetRoleTitle = 'Cloud Solutions Architect',
  onViewFullRoadmap,
  onNavigateToWorkspace,
}) => {
  // State for collapsible phases (default: first two phases expanded)
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  });

  const togglePhase = (idx: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <section className="ci-section-box" aria-labelledby="roadmap-timeline-heading">
      <div className="ci-section-header-row">
        <div className="ci-section-header-title-wrap">
          <h2 id="roadmap-timeline-heading">Curriculum Timeline & Learning Phases</h2>
          <p>
            Structured sequential milestones tailored to transition you into{' '}
            <strong className="text-slate-900">{targetRoleTitle}</strong>.
          </p>
        </div>

        {onViewFullRoadmap && (
          <button
            type="button"
            className="ci-btn-secondary"
            onClick={onViewFullRoadmap}
          >
            Open Full Curriculum
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="ci-roadmap-timeline">
        {roadmap.map((phase, idx) => {
          const isExpanded = !!expandedPhases[idx];
          const isCompleted = phase.status === 'Completed';
          const isInProgress = phase.status === 'In Progress';
          const isUpcoming = phase.status === 'Upcoming';

          const phaseClass = isCompleted
            ? 'phase-completed'
            : isInProgress
            ? 'phase-in-progress'
            : 'phase-upcoming';

          const statusBadgeClass = isCompleted
            ? 'status-completed'
            : isInProgress
            ? 'status-in-progress'
            : 'status-upcoming';

          const progressFillClass = isCompleted
            ? 'fill-emerald'
            : isInProgress
            ? 'fill-blue'
            : 'fill-slate';

          return (
            <article key={idx} className={`ci-timeline-phase-card ${phaseClass}`}>
              <div className="ci-phase-header">
                <div>
                  <div className="ci-phase-tag-row">
                    <span className="ci-phase-num-pill">{phase.phase}</span>
                    <span className={`ci-phase-status-pill ${statusBadgeClass}`}>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isInProgress && <Play className="w-3 h-3 fill-current" />}
                      {isUpcoming && <Clock className="w-3 h-3" />}
                      {phase.status}
                    </span>
                  </div>
                  <h3 className="ci-phase-title">{phase.title}</h3>
                </div>

                <div className="ci-phase-duration-wrap">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{phase.duration}</span>
                </div>
              </div>

              <p className="ci-phase-summary">{phase.summary}</p>

              {/* Phase Progress Bar */}
              <div className="ci-phase-progress-strip">
                <div className="progress-wrap ci-progress-bar">
                  <div className="ci-progress-track">
                    <div
                      className={`ci-progress-fill ${progressFillClass}`}
                      style={{ width: `${phase.completionPercentage}%` }}
                      role="progressbar"
                      aria-valuenow={phase.completionPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <span className="ci-phase-progress-pct">
                  {phase.completionPercentage}% Complete
                </span>
              </div>

              {/* Milestones Accordion */}
              <div className="ci-steps-container">
                <button
                  type="button"
                  className="ci-steps-header-toggle"
                  onClick={() => togglePhase(idx)}
                  aria-expanded={isExpanded}
                >
                  <span>Curriculum Milestones ({phase.steps.length} modules)</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {phase.steps.map((step) => {
                      const stepCompleted = step.status === 'completed';
                      const stepInProgress = step.status === 'in-progress';

                      const glyphClass = stepCompleted
                        ? 'glyph-completed'
                        : stepInProgress
                        ? 'glyph-in-progress'
                        : 'glyph-upcoming';

                      return (
                        <div key={step.id} className="ci-step-row">
                          <div className="ci-step-left">
                            <span className={`ci-step-check-glyph ${glyphClass}`} aria-hidden="true">
                              {stepCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                              {stepInProgress && <Play className="w-2.5 h-2.5 fill-current" />}
                              {!stepCompleted && !stepInProgress && <span style={{ fontSize: '8px' }}>●</span>}
                            </span>
                            <span className="ci-step-name">{step.title}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="ci-step-duration">{step.duration}</span>
                            <span
                              className={`ci-phase-status-pill ${
                                stepCompleted
                                  ? 'status-completed'
                                  : stepInProgress
                                  ? 'status-in-progress'
                                  : 'status-upcoming'
                              }`}
                              style={{ fontSize: '10.5px', padding: '2px 8px' }}
                            >
                              {step.status === 'completed'
                                ? 'Done'
                                : step.status === 'in-progress'
                                ? 'In Progress'
                                : 'Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* In-Progress Phase Callout Action */}
              {isInProgress && onNavigateToWorkspace && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                  <button
                    type="button"
                    className="ci-btn-secondary"
                    onClick={onNavigateToWorkspace}
                    style={{ fontSize: '12.5px', padding: '7px 14px' }}
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    Open Learning Workspace for this Phase
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RoadmapPreview;
