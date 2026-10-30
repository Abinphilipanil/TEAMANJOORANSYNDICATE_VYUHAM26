import React, { useState } from 'react';
import SkillGapOverview from '../SkillGapOverview';
import { SkillGapItem } from '../../../data/sampleData';

interface CurrentSkillItem {
  name: string;
  level: string;
  category: string;
  score: number;
}

interface SkillAnalysisViewProps {
  currentSkills: CurrentSkillItem[];
  skillGaps: SkillGapItem[];
  targetRoleTitle?: string;
}

export const SkillAnalysisView: React.FC<SkillAnalysisViewProps> = ({
  currentSkills,
  skillGaps,
  targetRoleTitle = 'Cloud Solutions Architect',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Frontend & Core', 'Backend', 'DevOps & Tools', 'Data', 'Cloud'];

  const filteredCurrentSkills = currentSkills.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="view-container">
      <div className="view-header-card">
        <div>
          <span className="view-badge">Competency Matrix</span>
          <h2 className="view-main-title">Skill Profiling & Gap Analysis</h2>
          <p className="view-sub-text">
            Compare your verified baseline profile against industry benchmarks for{' '}
            <strong>{targetRoleTitle}</strong>.
          </p>
        </div>
      </div>

      {/* Current Verified Skills Section */}
      <div className="dashboard-section-card">
        <div className="section-card-header">
          <div>
            <div className="badge-title-row">
              <h2 className="section-title">Verified Current Skills ({currentSkills.length})</h2>
              <span className="section-badge-pill">Baseline Assessment</span>
            </div>
            <p className="section-subtitle">
              Self-assessed and code-verified technical competencies.
            </p>
          </div>

          <div className="filter-button-group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${selectedCategory === cat ? 'filter-btn-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="current-skills-grid">
          {filteredCurrentSkills.map((item) => (
            <div key={item.name} className="current-skill-card">
              <div className="skill-card-top">
                <span className="skill-card-cat">{item.category}</span>
                <span className={`skill-level-badge level-${item.level.toLowerCase()}`}>
                  {item.level}
                </span>
              </div>
              <h3 className="skill-card-name">{item.name}</h3>

              <div className="skill-card-meter">
                <div className="meter-labels">
                  <span>Proficiency</span>
                  <strong>{item.score}%</strong>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reusable SkillGapOverview component embedded with full data */}
      <SkillGapOverview skillGaps={skillGaps} targetRoleTitle={targetRoleTitle} />
    </div>
  );
};

export default SkillAnalysisView;

