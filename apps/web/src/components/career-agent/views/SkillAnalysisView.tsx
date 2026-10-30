import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Target, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
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
  onNavigateToRoadmap?: () => void;
}

export const SkillAnalysisView: React.FC<SkillAnalysisViewProps> = ({
  currentSkills,
  skillGaps,
  targetRoleTitle = 'Cloud Solutions Architect',
  onNavigateToRoadmap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Frontend & Core', 'Backend', 'DevOps & Tools', 'Data', 'Cloud'];

  // Calculate reliable dynamic metrics from actual datasets
  const metrics = useMemo(() => {
    const total = currentSkills.length;
    const strong = currentSkills.filter((s) => s.score >= 80).length;
    const gapsCount = skillGaps.length;
    const avgScore = total > 0 ? Math.round(currentSkills.reduce((acc, s) => acc + s.score, 0) / total) : 75;

    return {
      total,
      strong,
      gapsCount,
      alignment: avgScore,
    };
  }, [currentSkills, skillGaps]);

  const filteredCurrentSkills = useMemo(() => {
    if (selectedCategory === 'ALL') return currentSkills;
    return currentSkills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [currentSkills, selectedCategory]);

  return (
    <div className="ci-view-container ca-skill-analysis">
      {/* 1. Header Card */}
      <header className="ci-page-header">
        <div className="ci-header-content">
          <span className="ci-eyebrow">
            <Layers className="w-3.5 h-3.5" />
            Competency Matrix
          </span>
          <h1 className="ci-title">Skill Profiling & Gap Analysis</h1>
          <p className="ci-subtitle">
            Benchmark your verified technical capabilities against live employer benchmarks for{' '}
            <strong className="text-slate-900">{targetRoleTitle}</strong>.
          </p>
        </div>
      </header>

      {/* 2. Top Summary Metrics Cards (4 Metrics) */}
      <section className="ci-summary-grid" aria-label="Skill Metrics Overview">
        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Total Verified Skills</span>
            <div className="ci-summary-icon icon-blue">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value">{metrics.total}</span>
          <span className="ci-summary-subtext">Across {categories.length - 1} technical domains</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Strong Competencies</span>
            <div className="ci-summary-icon icon-emerald">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-emerald-600">{metrics.strong}</span>
          <span className="ci-summary-subtext">Advanced (≥80% proficiency)</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Skills to Improve</span>
            <div className="ci-summary-icon icon-amber">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-amber-600">{metrics.gapsCount}</span>
          <span className="ci-summary-subtext">Ranked by market urgency</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Target Role Alignment</span>
            <div className="ci-summary-icon icon-blue">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-blue-600">{metrics.alignment}%</span>
          <span className="ci-summary-subtext">Match for {targetRoleTitle}</span>
        </div>
      </section>

      {/* 3. Verified Current Skills Section */}
      <section className="ci-section-box" aria-labelledby="verified-skills-heading">
        <div className="ci-section-header-row">
          <div className="ci-section-header-title-wrap">
            <h2 id="verified-skills-heading">Verified Current Skills ({filteredCurrentSkills.length})</h2>
            <p>Self-assessed, project-evaluated, and verified engineering competencies.</p>
          </div>

          <div className="ci-filter-bar" role="tablist" aria-label="Skill categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ci-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ci-skills-cards-grid">
          {filteredCurrentSkills.map((item) => {
            const levelClass =
              item.level.toLowerCase() === 'advanced'
                ? 'level-advanced'
                : item.level.toLowerCase() === 'intermediate'
                ? 'level-intermediate'
                : 'level-beginner';

            const fillClass =
              item.score >= 80 ? 'fill-emerald' : item.score >= 60 ? 'fill-blue' : 'fill-amber';

            return (
              <article key={item.name} className="ci-skill-card">
                <div className="ci-skill-card-top">
                  <span className="ci-skill-category-tag">{item.category}</span>
                  <span className={`ci-skill-level-badge ${levelClass}`}>
                    {item.level}
                  </span>
                </div>

                <h3 className="ci-skill-card-name">{item.name}</h3>

                <div className="ci-skill-meter-wrap">
                  <div className="ci-meter-info">
                    <span>Proficiency</span>
                    <strong>{item.score}%</strong>
                  </div>
                  <div className="ci-progress-bar">
                    <div className="ci-progress-track">
                      <div
                        className={`ci-progress-fill ${fillClass}`}
                        style={{ width: `${item.score}%` }}
                        role="progressbar"
                        aria-valuenow={item.score}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Target-Role Gap Analysis Component */}
      <SkillGapOverview 
        skillGaps={skillGaps} 
        targetRoleTitle={targetRoleTitle} 
        onNavigateToRoadmap={onNavigateToRoadmap}
      />
    </div>
  );
};

export default SkillAnalysisView;
