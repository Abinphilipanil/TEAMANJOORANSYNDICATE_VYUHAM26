import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Briefcase, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Filter 
} from 'lucide-react';
import { CareerRecommendation } from '../../../data/sampleData';

interface CareerExplorerViewProps {
  careerRecommendations: CareerRecommendation[];
  selectedRole?: CareerRecommendation | null;
  onSelectRole?: (role: CareerRecommendation) => void;
  onNavigateToRoadmap?: () => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careerRecommendations,
  selectedRole: propSelectedRole,
  onSelectRole,
  onNavigateToRoadmap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'architecture' | 'engineering'>('all');

  // Fallback to first role if not explicitly provided
  const activeRole = propSelectedRole || careerRecommendations[0];

  // Filtering logic
  const filteredRoles = useMemo(() => {
    return careerRecommendations.filter((role) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        role.keySkillGaps.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'high') return role.matchPercentage >= 80;
      if (filterType === 'architecture') return role.roleName.toLowerCase().includes('architect');
      if (filterType === 'engineering') return role.roleName.toLowerCase().includes('engineer') || role.roleName.toLowerCase().includes('developer');

      return true;
    });
  }, [careerRecommendations, searchQuery, filterType]);

  const otherRoles = useMemo(() => {
    return filteredRoles.filter((r) => r.id !== activeRole?.id);
  }, [filteredRoles, activeRole]);

  return (
    <div className="ci-view-container ca-career-explorer">
      {/* 1. Header Card */}
      <header className="ci-page-header">
        <div className="ci-header-content">
          <span className="ci-eyebrow">
            <Compass className="w-3.5 h-3.5" />
            Career Intelligence
          </span>
          <h1 className="ci-title">Career Explorer & Role Alignment</h1>
          <p className="ci-subtitle">
            Evaluate multidimensional competency overlap, compare industry compensation and demand benchmarks, and select your active target trajectory.
          </p>
        </div>

        <div className="ci-header-actions">
          <div className="ci-search-box">
            <Search className="ci-search-icon" />
            <input
              type="text"
              className="ci-search-input"
              placeholder="Search roles, skills, or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search roles or technologies"
            />
          </div>
        </div>
      </header>

      {/* Filter Tabs Bar */}
      <div className="ci-filter-bar" role="toolbar" aria-label="Role filters">
        <button
          type="button"
          className={`ci-filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Roles ({careerRecommendations.length})
        </button>
        <button
          type="button"
          className={`ci-filter-btn ${filterType === 'high' ? 'active' : ''}`}
          onClick={() => setFilterType('high')}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Top Matches (80%+)
        </button>
        <button
          type="button"
          className={`ci-filter-btn ${filterType === 'architecture' ? 'active' : ''}`}
          onClick={() => setFilterType('architecture')}
        >
          Architecture
        </button>
        <button
          type="button"
          className={`ci-filter-btn ${filterType === 'engineering' ? 'active' : ''}`}
          onClick={() => setFilterType('engineering')}
        >
          Engineering & Cloud
        </button>
      </div>

      {/* 2. Prominent Selected Target Track Hero Card */}
      {activeRole && (
        <section className="ci-selected-role-hero" aria-labelledby="active-target-track-heading">
          <div className="ci-hero-badge-pill">
            <Target className="w-3.5 h-3.5" />
            Selected Target Track
          </div>

          <div className="ci-hero-top-section">
            <div className="ci-hero-title-group">
              <h2 id="active-target-track-heading" className="ci-hero-role-title">
                {activeRole.roleName}
              </h2>
              <p className="ci-hero-role-desc">{activeRole.description}</p>
            </div>

            <div className="ci-match-ring-card" aria-label={`Match score: ${activeRole.matchPercentage}%`}>
              <span className="ci-ring-score">{activeRole.matchPercentage}%</span>
              <span className="ci-ring-level">{activeRole.matchLevel}</span>
            </div>
          </div>

          {/* Visual Progress Bar for Overall Match */}
          <div className="ci-progress-bar">
            <div className="ci-progress-track">
              <div
                className="ci-progress-fill fill-blue"
                style={{ width: `${activeRole.matchPercentage}%` }}
                aria-valuenow={activeRole.matchPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>
          </div>

          {/* Supporting Metrics 4-Col Grid */}
          <div className="ci-hero-metrics-grid">
            <div className="ci-hero-metric-cell">
              <span className="metric-label">Role Alignment</span>
              <span className="metric-val text-primary">{activeRole.matchPercentage}% Match</span>
            </div>
            <div className="ci-hero-metric-cell">
              <span className="metric-label">Market Demand</span>
              <span className="metric-val text-emerald flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {activeRole.marketDemand}
              </span>
            </div>
            <div className="ci-hero-metric-cell">
              <span className="metric-label">Est. Compensation</span>
              <span className="metric-val flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {activeRole.averageSalary}
              </span>
            </div>
            <div className="ci-hero-metric-cell">
              <span className="metric-label">Recommended Focus</span>
              <span className="metric-val text-slate-800 flex items-center gap-1 truncate" title={activeRole.recommendedStartingPoint}>
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="truncate">{activeRole.recommendedStartingPoint}</span>
              </span>
            </div>
          </div>

          {/* Match Analysis Rationale Callout */}
          <div className="ci-fit-rationale-box">
            <Sparkles className="fit-icon w-5 h-5 flex-shrink-0" />
            <div className="fit-text">
              <strong>Match Analysis Rationale:</strong> {activeRole.fitRationale}
            </div>
          </div>

          {/* Match Analysis Competency Breakdown (2 Columns) */}
          <div className="ci-competencies-breakdown">
            {/* Matched Skills */}
            <div className="ci-competency-panel">
              <div className="ci-competency-panel-header">
                <span className="ci-panel-title title-matched">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Competencies
                </span>
                <span className="ci-panel-count-badge badge-matched">
                  {activeRole.matchingSkills.length} Verified
                </span>
              </div>
              <div className="ci-chips-row">
                {activeRole.matchingSkills.map((skill, idx) => (
                  <span key={idx} className="ci-skill-chip chip-matched">
                    <Check className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Gaps to Bridge */}
            <div className="ci-competency-panel">
              <div className="ci-competency-panel-header">
                <span className="ci-panel-title title-gap">
                  <AlertTriangle className="w-4 h-4" />
                  Identified Gaps to Bridge
                </span>
                <span className="ci-panel-count-badge badge-gap">
                  {activeRole.keySkillGaps.length} Action Items
                </span>
              </div>
              <div className="ci-chips-row">
                {activeRole.keySkillGaps.map((gap, idx) => (
                  <span key={idx} className="ci-skill-chip chip-gap">
                    <AlertTriangle className="w-3 h-3" />
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="ci-hero-footer">
            <span className="ci-start-hint">
              <strong>Recommended Launch Step:</strong> {activeRole.recommendedStartingPoint}
            </span>

            <div className="ci-action-buttons-group">
              <span className="ci-btn-active-track">
                <CheckCircle2 className="w-4 h-4" />
                Active Track Set
              </span>

              {onNavigateToRoadmap && (
                <button
                  type="button"
                  className="ci-btn-primary"
                  onClick={onNavigateToRoadmap}
                >
                  Generate & View Roadmap
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Alternative Career Roles & Comparison Grid */}
      <section className="ci-alternatives-section" aria-labelledby="alternative-roles-heading">
        <div className="ci-section-heading-bar">
          <div className="ci-section-title-wrap">
            <h3 id="alternative-roles-heading">Alternative Roles & Comparison</h3>
            <p>Compare adjacent career paths against your verified profile to explore broader opportunities.</p>
          </div>
        </div>

        {otherRoles.length > 0 ? (
          <div className="ci-roles-grid" style={{ marginTop: '16px' }}>
            {otherRoles.map((role) => {
              const isSelected = activeRole?.id === role.id;
              const matchClass = role.matchPercentage >= 80 ? 'match-high' : 'match-med';

              return (
                <article
                  key={role.id}
                  className={`ci-role-card ${isSelected ? 'is-selected' : ''}`}
                >
                  <div className="ci-role-card-header">
                    <div>
                      <h4 className="ci-role-card-title">{role.roleName}</h4>
                      <p className="ci-role-desc">{role.description}</p>
                    </div>
                    <span className={`ci-role-match-pill ${matchClass}`}>
                      {role.matchPercentage}% Match
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="ci-progress-bar">
                    <div className="ci-progress-track">
                      <div
                        className={`ci-progress-fill ${role.matchPercentage >= 80 ? 'fill-emerald' : 'fill-blue'}`}
                        style={{ width: `${role.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Supporting Stats Strip */}
                  <div className="ci-role-stats-row">
                    <div className="ci-stat-group">
                      <span className="lbl">Demand</span>
                      <span className="val">{role.marketDemand.split(' ')[0]}</span>
                    </div>
                    <div className="ci-stat-group">
                      <span className="lbl">Est. Salary</span>
                      <span className="val">{role.averageSalary}</span>
                    </div>
                    <div className="ci-stat-group">
                      <span className="lbl">Skills</span>
                      <span className="val text-emerald-600">{role.matchingSkills.length} Matched</span>
                    </div>
                    <div className="ci-stat-group">
                      <span className="lbl">Gaps</span>
                      <span className="val text-amber-600">{role.keySkillGaps.length} Gaps</span>
                    </div>
                  </div>

                  {/* Preview of skills as distinct tags */}
                  <div className="ci-chips-row" style={{ marginTop: '4px' }}>
                    {role.matchingSkills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="ci-skill-chip chip-matched" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {s}
                      </span>
                    ))}
                    {role.keySkillGaps.slice(0, 2).map((g, idx) => (
                      <span key={idx} className="ci-skill-chip chip-gap" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {g}
                      </span>
                    ))}
                    {(role.matchingSkills.length + role.keySkillGaps.length > 5) && (
                      <span className="ci-skill-chip chip-neutral" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        +{role.matchingSkills.length + role.keySkillGaps.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className="ci-role-card-footer">
                    <div className="ci-role-counts-indicator">
                      <span className="ci-count-tag tag-matched">
                        <Check className="w-3 h-3 inline" /> {role.matchingSkills.length} matched
                      </span>
                      <span>•</span>
                      <span className="ci-count-tag tag-gap">
                        {role.keySkillGaps.length} gaps
                      </span>
                    </div>

                    {onSelectRole && (
                      <button
                        type="button"
                        className={`ci-btn-secondary ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectRole(role)}
                        style={{ padding: '7px 14px', fontSize: '12.5px' }}
                      >
                        {isSelected ? 'Active Track' : 'Select Target Track'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="ci-section-box" style={{ textAlign: 'center', padding: '40px 20px', marginTop: '16px' }}>
            <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 style={{ margin: '0 0 6px', color: '#0F172A', fontSize: '16px' }}>No alternative roles match your query</h4>
            <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>
              Try searching with another keyword or reset the role filters above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CareerExplorerView;
