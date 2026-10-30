import React from 'react';

export interface SummaryMetricsData {
  jobMatch: string;
  criticalGaps: string;
  recommendedPlan: string;
  relevantRoles: string;
}

interface SummaryMetricsProps {
  metrics?: SummaryMetricsData;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ metrics }) => {
  const defaultMetrics: SummaryMetricsData = {
    jobMatch: "78%",
    criticalGaps: "3",
    recommendedPlan: "12 weeks",
    relevantRoles: "5+",
  };

  const data = metrics || defaultMetrics;

  return (
    <section className="ca-summary-metrics-strip" aria-label="Key Career Metrics">
      <div className="metrics-horizontal-card">
        {/* Metric 1: Job Match */}
        <div className="metric-col">
          <span className="metric-label">Job Match</span>
          <span className="metric-value text-blue">{data.jobMatch}</span>
          <span className="metric-hint">Based on recent profile</span>
        </div>

        <div className="metric-divider" />

        {/* Metric 2: Critical Skill Gaps */}
        <div className="metric-col">
          <span className="metric-label">Critical Skill Gaps</span>
          <span className="metric-value text-red">{data.criticalGaps}</span>
          <span className="metric-hint">Immediate focus areas</span>
        </div>

        <div className="metric-divider" />

        {/* Metric 3: Recommended Plan */}
        <div className="metric-col">
          <span className="metric-label">Recommended Plan</span>
          <span className="metric-value text-blue">{data.recommendedPlan}</span>
          <span className="metric-hint">Structured learning path</span>
        </div>

        <div className="metric-divider" />

        {/* Metric 4: Relevant Job Roles */}
        <div className="metric-col">
          <span className="metric-label">Relevant Job Roles</span>
          <span className="metric-value text-blue">{data.relevantRoles}</span>
          <span className="metric-hint">Matched opportunities</span>
        </div>
      </div>
    </section>
  );
};

export default SummaryMetrics;

