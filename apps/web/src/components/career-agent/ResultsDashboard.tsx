import React from 'react';
import {
  IconCheckCircle,
  IconAlertTriangle,
  IconXCircle,
  IconSparkles,
  IconBookOpen,
  IconInfo,
  IconClock,
} from './Icons';
import { ResumeAnalysisResult } from '../../services/resumeAnalysisService';

interface ResultsDashboardProps {
  results: ResumeAnalysisResult | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  if (!results) return null;

  const {
    overallMatch,
    readinessAssessment,
    skillsBreakdown,
    gapSummary,
    actionableSuggestions,
    resumeMeta,
    isPrototypeData,
  } = results;

  const score = overallMatch.score;
  const matchColorClass =
    score >= 80 ? 'score-high' : score >= 65 ? 'score-moderate' : 'score-low';

  return (
    <section className="cm-results-section" aria-label="Analysis Results Dashboard">
      {/* Disclaimer / Transparency Tag */}
      {isPrototypeData && (
        <div className="cm-prototype-notice-banner">
          <div className="cm-notice-badge">
            <IconInfo className="w-4 h-4 text-primary" /> Phase 1 Benchmark Showcase
          </div>
          <div className="cm-notice-content">
            <strong>Sample Analysis Benchmark:</strong> Demonstrates the Phase 1 UI and evaluation cards for file <code>{resumeMeta?.fileName}</code>. In Phase 2, a live Python FastAPI / Agent pipeline will parse and evaluate uploaded documents in real time.
          </div>
        </div>
      )}

      {/* Top Level Summary Grid: Match Score + Readiness Assessment */}
      <div className="cm-results-top-grid">
        {/* Card 1: Overall Skill-Match Score */}
        <div className="cm-card cm-match-score-card">
          <div className="cm-card-header">
            <span className="cm-card-eyebrow">Overall Alignment</span>
            <h3 className="cm-card-heading">Skill-Match Score</h3>
          </div>

          <div className="cm-score-display-row">
            <div className={`cm-score-circle ${matchColorClass}`}>
              <span className="cm-score-val">{score}%</span>
              <span className="cm-score-lbl">MATCH</span>
            </div>

            <div className="cm-score-details">
              <span className="cm-score-category">{overallMatch.category}</span>
              <p className="cm-score-summary">{overallMatch.summary}</p>
            </div>
          </div>

          <div className="cm-coverage-metrics-strip">
            <div className="cm-metric-pill">
              <span className="cm-pill-count text-emerald">{gapSummary.matchedCount}</span>
              <span className="cm-pill-label">Matched</span>
            </div>
            <div className="cm-metric-pill">
              <span className="cm-pill-count text-amber">{gapSummary.partialCount}</span>
              <span className="cm-pill-label">Partial</span>
            </div>
            <div className="cm-metric-pill">
              <span className="cm-pill-count text-red">{gapSummary.missingCount}</span>
              <span className="cm-pill-label">Missing</span>
            </div>
            <div className="cm-metric-pill">
              <span className="cm-pill-count">{gapSummary.coveragePercentage}%</span>
              <span className="cm-pill-label">Coverage</span>
            </div>
          </div>
        </div>

        {/* Card 2: Job-Readiness Assessment */}
        <div className="cm-card cm-readiness-card">
          <div className="cm-card-header">
            <span className="cm-card-eyebrow">Readiness Diagnostic</span>
            <h3 className="cm-card-heading">Job-Readiness Assessment</h3>
          </div>

          <div className="cm-readiness-badge-row">
            <span className={`cm-readiness-status-badge status-${readinessAssessment.statusLevel}`}>
              <IconCheckCircle className="w-4 h-4 inline-icon" /> {readinessAssessment.status}
            </span>
          </div>

          <div className="cm-readiness-points">
            <div className="cm-readiness-point">
              <span className="cm-point-title">Primary Strength:</span>
              <p className="cm-point-desc">{readinessAssessment.keyStrength}</p>
            </div>
            <div className="cm-readiness-point">
              <span className="cm-point-title">Identified Risk / Gap:</span>
              <p className="cm-point-desc">{readinessAssessment.primaryRisk}</p>
            </div>
          </div>

          <div className="cm-timeline-indicator">
            <IconClock className="w-4 h-4 text-primary flex-shrink-0" />
            <span><strong>Target Window:</strong> {readinessAssessment.recommendedTimeline}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Skills Breakdown Columns (Matched, Partial, Missing) */}
      <div className="cm-skills-breakdown-section">
        <div className="cm-section-title-wrap">
          <h3 className="cm-section-heading">Detailed Skill Breakdown</h3>
          <p className="cm-section-subline">
            Categorized skills extracted from your resume compared against the target job requirements.
          </p>
        </div>

        <div className="cm-skills-three-col-grid">
          {/* Column A: Matched Skills */}
          <div className="cm-card cm-skill-col-card border-green">
            <div className="cm-col-header">
              <div className="cm-col-title-group">
                <IconCheckCircle className="w-5 h-5 text-emerald" />
                <h4 className="cm-col-title">Matched Skills</h4>
              </div>
              <span className="cm-col-badge badge-green">{skillsBreakdown.matched.length} Verified</span>
            </div>

            <div className="cm-skill-items-list">
              {skillsBreakdown.matched.map((skill, index) => (
                <div key={index} className="cm-skill-item item-matched">
                  <div className="cm-skill-item-header">
                    <span className="cm-skill-name">{skill.name}</span>
                    <span className="cm-skill-category-tag">{skill.category}</span>
                  </div>
                  <span className="cm-skill-context">{skill.context}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Partially Matched */}
          <div className="cm-card cm-skill-col-card border-amber">
            <div className="cm-col-header">
              <div className="cm-col-title-group">
                <IconAlertTriangle className="w-5 h-5 text-amber" />
                <h4 className="cm-col-title">Partially Matched</h4>
              </div>
              <span className="cm-col-badge badge-amber">{skillsBreakdown.partiallyMatched.length} To Reinforce</span>
            </div>

            <div className="cm-skill-items-list">
              {skillsBreakdown.partiallyMatched.map((skill, index) => (
                <div key={index} className="cm-skill-item item-partial">
                  <div className="cm-skill-item-header">
                    <span className="cm-skill-name">{skill.name}</span>
                    <span className="cm-skill-category-tag">{skill.category}</span>
                  </div>
                  <p className="cm-skill-notes">{skill.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column C: Missing Skills */}
          <div className="cm-card cm-skill-col-card border-red">
            <div className="cm-col-header">
              <div className="cm-col-title-group">
                <IconXCircle className="w-5 h-5 text-red" />
                <h4 className="cm-col-title">Missing Required Skills</h4>
              </div>
              <span className="cm-col-badge badge-red">{skillsBreakdown.missing.length} Gaps</span>
            </div>

            <div className="cm-skill-items-list">
              {skillsBreakdown.missing.map((skill, index) => (
                <div key={index} className="cm-skill-item item-missing">
                  <div className="cm-skill-item-header">
                    <span className="cm-skill-name">{skill.name}</span>
                    <span className={`cm-priority-tag priority-${skill.priority.toLowerCase()}`}>
                      {skill.priority}
                    </span>
                  </div>
                  <p className="cm-skill-importance">{skill.importance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Actionable Suggestions */}
      <div className="cm-actionable-suggestions-section">
        <div className="cm-section-title-wrap">
          <h3 className="cm-section-heading">Actionable Development & Optimization</h3>
          <p className="cm-section-subline">
            Targeted recommendations to improve your resume impact and bridge critical skill gaps.
          </p>
        </div>

        <div className="cm-suggestions-two-col-grid">
          {/* Card A: Resume Enhancements */}
          <div className="cm-card cm-suggestion-card">
            <div className="cm-suggestion-header">
              <div className="cm-icon-box bg-blue-subtle">
                <IconSparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="cm-card-heading">Resume Bullet Optimizations</h4>
                <p className="cm-card-subline">Recommended phrase enhancements for immediate impact</p>
              </div>
            </div>

            <div className="cm-suggestion-list">
              {actionableSuggestions.resumeImprovements.map((rec) => (
                <div key={rec.id} className="cm-suggestion-item">
                  <span className="cm-rec-section-pill">{rec.section}</span>
                  <h5 className="cm-rec-title">{rec.title}</h5>
                  <p className="cm-rec-desc">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: Skill Development Plan */}
          <div className="cm-card cm-suggestion-card">
            <div className="cm-suggestion-header">
              <div className="cm-icon-box bg-purple-subtle">
                <IconBookOpen className="w-5 h-5 text-purple" />
              </div>
              <div>
                <h4 className="cm-card-heading">High-Priority Learning Tasks</h4>
                <p className="cm-card-subline">Accelerated milestones to close requirement gaps</p>
              </div>
            </div>

            <div className="cm-suggestion-list">
              {actionableSuggestions.skillDevelopment.map((task) => (
                <div key={task.id} className="cm-suggestion-item">
                  <div className="cm-rec-top">
                    <span className="cm-rec-skill-name">{task.skill}</span>
                    <span className="cm-rec-time-badge">
                      <IconClock className="w-3.5 h-3.5 inline-icon" /> {task.timeEstimate}
                    </span>
                  </div>
                  <p className="cm-rec-desc">{task.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDashboard;

