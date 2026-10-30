import React from 'react';
import { IconTarget, IconCheckCircle, IconAlertTriangle, IconTrendingUp } from './Icons';
import { CareerRecommendation } from '../../data/sampleData';

interface CareerRecommendationsProps {
  recommendations: CareerRecommendation[];
  selectedRole?: CareerRecommendation | null;
  onSelectRole: (role: CareerRecommendation) => void;
  onViewGaps?: () => void;
}

export const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({
  recommendations,
  selectedRole,
  onSelectRole,
  onViewGaps,
}) => {
  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div>
          <div className="badge-title-row">
            <h2 className="section-title">Recommended Career Roles</h2>
            <span className="section-badge-pill">Sample Recommendations</span>
          </div>
          <p className="section-subtitle">
            Curated benchmark roles based on baseline profile skills and industry demand patterns.
          </p>
        </div>
        <span className="benchmark-notice-tag">Challenge AF-03 Evaluation</span>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((role) => {
          const isSelected = selectedRole?.id === role.id;
          const matchColor =
            role.matchPercentage >= 85
              ? 'high-match'
              : role.matchPercentage >= 75
              ? 'medium-match'
              : 'moderate-match';

          return (
            <div
              key={role.id}
              className={`role-card ${isSelected ? 'role-card-selected' : ''}`}
            >
              <div className="role-card-header">
                <div className="role-meta">
                  <div className="role-title-row">
                    <h3 className="role-name">{role.roleName}</h3>
                    {isSelected && (
                      <span className="selected-indicator-pill">
                        <IconTarget className="w-3.5 h-3.5 inline-icon" /> Active Target
                      </span>
                    )}
                  </div>
                  <div className="role-tags">
                    <span className="role-tag-sub">
                      <IconTrendingUp className="w-3.5 h-3.5 inline-icon" /> {role.marketDemand}
                    </span>
                    <span className="role-tag-sub">&bull; {role.averageSalary}</span>
                  </div>
                </div>

                <div className="match-score-badge">
                  <div className={`score-ring ${matchColor}`}>
                    <span className="score-number">{role.matchPercentage}%</span>
                    <span className="score-label">MATCH</span>
                  </div>
                </div>
              </div>

              <p className="role-description">{role.description}</p>

              <div className="skills-comparison-block">
                <div className="skills-sub-block">
                  <span className="skills-block-label text-emerald">
                    <IconCheckCircle className="w-3.5 h-3.5 inline-icon" /> Matching Competencies (
                    {role.matchingSkills.length})
                  </span>
                  <div className="skill-pills-row">
                    {role.matchingSkills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="skill-chip chip-match">
                        {skill}
                      </span>
                    ))}
                    {role.matchingSkills.length > 4 && (
                      <span className="skill-chip chip-more">
                        +{role.matchingSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="skills-sub-block">
                  <span className="skills-block-label text-amber">
                    <IconAlertTriangle className="w-3.5 h-3.5 inline-icon" /> Critical Skill Gaps (
                    {role.keySkillGaps.length})
                  </span>
                  <div className="skill-pills-row">
                    {role.keySkillGaps.slice(0, 3).map((gap, i) => (
                      <span key={i} className="skill-chip chip-gap">
                        {gap}
                      </span>
                    ))}
                    {role.keySkillGaps.length > 3 && (
                      <span className="skill-chip chip-more">
                        +{role.keySkillGaps.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="role-card-footer">
                <span className="learning-start-hint">
                  <strong>Recommended Start:</strong> {role.recommendedStartingPoint}
                </span>

                <div className="role-actions-group">
                  <button
                    type="button"
                    className={`btn-select-role ${isSelected ? 'btn-selected' : ''}`}
                    onClick={() => onSelectRole(role)}
                  >
                    {isSelected ? 'Selected Track' : 'Select Target'}
                  </button>

                  {onViewGaps && (
                    <button
                      type="button"
                      className="btn-view-gaps"
                      onClick={onViewGaps}
                      title="Inspect detailed skill gaps"
                    >
                      View Gaps &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerRecommendations;

