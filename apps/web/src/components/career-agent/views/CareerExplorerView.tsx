import React, { useState } from 'react';
import {
  IconTarget,
  IconCheckCircle,
  IconAlertTriangle,
  IconTrendingUp,
} from '../Icons';
import { CareerRecommendation } from '../../../data/sampleData';

interface CareerExplorerViewProps {
  careerRecommendations: CareerRecommendation[];
  selectedRole?: CareerRecommendation | null;
  onSelectRole?: (role: CareerRecommendation) => void;
  onNavigateToRoadmap?: () => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careerRecommendations,
  selectedRole,
  onSelectRole,
  onNavigateToRoadmap,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredRoles = careerRecommendations.filter(
    (role) =>
      role.roleName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="view-header-card">
        <div>
          <span className="view-badge">Career Path Intelligence</span>
          <h2 className="view-main-title">Career Explorer & Role Alignment</h2>
          <p className="view-sub-text">
            Compare target opportunities, evaluate competency overlap, and choose your active learning track.
          </p>
        </div>
        <div className="view-header-action">
          <input
            type="text"
            className="search-input"
            placeholder="Search roles or technologies..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="roles-detail-list">
        {filteredRoles.map((role) => {
          const isSelected = selectedRole?.id === role.id;
          return (
            <div
              key={role.id}
              className={`role-detail-card ${isSelected ? 'role-card-selected' : ''}`}
            >
              <div className="role-detail-top">
                <div>
                  <div className="role-title-row">
                    <h3 className="role-detail-title">{role.roleName}</h3>
                    {isSelected && (
                      <span className="selected-indicator-pill">
                        <IconTarget className="w-3.5 h-3.5 inline-icon" /> Selected Target Track
                      </span>
                    )}
                  </div>
                  <div className="role-meta-tags">
                    <span className="meta-pill text-emerald">
                      <IconTrendingUp className="w-3.5 h-3.5 inline-icon" /> {role.marketDemand}
                    </span>
                    <span className="meta-pill text-muted">Est. Compensation: {role.averageSalary}</span>
                  </div>
                </div>

                <div className="role-match-ring-wrap">
                  <div className="match-ring-box">
                    <span className="ring-score">{role.matchPercentage}%</span>
                    <span className="ring-sub">{role.matchLevel}</span>
                  </div>
                </div>
              </div>

              <p className="role-long-desc">{role.description}</p>

              <div className="role-fit-analysis-box">
                <span className="fit-analysis-label">Why You Fit This Role:</span>
                <p className="fit-analysis-text">{role.fitRationale}</p>
              </div>

              <div className="role-competency-grid">
                <div className="competency-col">
                  <span className="col-label text-emerald">
                    <IconCheckCircle className="w-3.5 h-3.5 inline-icon" /> Core Skills Matched ({role.matchingSkills.length})
                  </span>
                  <div className="col-pills-row">
                    {role.matchingSkills.map((s, idx) => (
                      <span key={idx} className="skill-chip chip-match">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="competency-col">
                  <span className="col-label text-amber">
                    <IconAlertTriangle className="w-3.5 h-3.5 inline-icon" /> Gaps to Close ({role.keySkillGaps.length})
                  </span>
                  <div className="col-pills-row">
                    {role.keySkillGaps.map((g, idx) => (
                      <span key={idx} className="skill-chip chip-gap">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="role-detail-footer">
                <span className="start-hint">
                  <strong>Recommended Launch Step:</strong> {role.recommendedStartingPoint}
                </span>

                <div className="role-buttons-row">
                  {onSelectRole && (
                    <button
                      type="button"
                      className={`btn-select-track ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectRole(role)}
                    >
                      {isSelected ? 'Active Career Track' : 'Set as Target Goal'}
                    </button>
                  )}

                  {onNavigateToRoadmap && (
                    <button
                      type="button"
                      className="btn-open-roadmap"
                      onClick={onNavigateToRoadmap}
                    >
                      View Learning Roadmap &rarr;
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

export default CareerExplorerView;

