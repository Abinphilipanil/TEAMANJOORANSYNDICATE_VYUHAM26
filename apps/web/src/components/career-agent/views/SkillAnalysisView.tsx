import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Target, 
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
  alignmentScore?: number;
  onNavigateToRoadmap?: () => void;
}

export const SkillAnalysisView: React.FC<SkillAnalysisViewProps> = ({
  currentSkills,
  skillGaps,
  targetRoleTitle = 'Cloud Solutions Architect',
  alignmentScore,
  onNavigateToRoadmap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Frontend & Core', 'Backend', 'DevOps & Tools', 'Data', 'Cloud'];

  // Calculate reliable dynamic metrics from actual datasets
  const metrics = useMemo(() => {
    const total = currentSkills.length;
    const gapsCount = skillGaps.length;
    const highGapsCount = skillGaps.filter(
      (g) => g.priority.toLowerCase() === 'critical' || g.priority.toLowerCase() === 'high'
    ).length;
    const mediumGapsCount = skillGaps.filter((g) => g.priority.toLowerCase() === 'medium').length;
    const avgScore = total > 0 ? Math.round(currentSkills.reduce((acc, s) => acc + s.score, 0) / total) : 75;

    return {
      total,
      gapsCount,
      highGapsCount,
      mediumGapsCount,
      alignment: alignmentScore !== undefined ? alignmentScore : avgScore,
    };
  }, [currentSkills, skillGaps, alignmentScore]);

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
          <span className="ci-summary-subtext">Verified from your resume</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">High Priority Gaps</span>
            <div className="ci-summary-icon icon-rose">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-rose-600">{metrics.highGapsCount}</span>
          <span className="ci-summary-subtext">Critical & high urgency</span>
        </div>

        <div className="ci-summary-card">
          <div className="ci-summary-header">
            <span className="ci-summary-label">Medium Priority Gaps</span>
            <div className="ci-summary-icon icon-amber">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="ci-summary-value text-amber-600">{metrics.mediumGapsCount}</span>
          <span className="ci-summary-subtext">Secondary competencies</span>
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

      {/* 3. Verified Current Skills Section (No Progress Bar / Percentage) */}
      <section className="ci-section-box" aria-labelledby="verified-skills-heading">
        <div className="ci-section-header-row">
          <div className="ci-section-header-title-wrap">
            <h2 id="verified-skills-heading">Verified Current Skills ({filteredCurrentSkills.length})</h2>
            <p>Demonstrated engineering competencies and technologies extracted from your resume.</p>
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

        {/* Clean Tech Cards Grid - Tech Name in Box Without Progress Bars */}
        <div className="ci-skills-cards-grid">
          {filteredCurrentSkills.map((item) => (
            <article key={item.name} className="ci-skill-card ci-verified-tech-card">
              <div className="ci-skill-card-top">
                <span className="ci-skill-category-tag">{item.category}</span>
                <span className="ci-skill-verified-pill">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  Verified
                </span>
              </div>

              <h3 className="ci-skill-card-name">{item.name}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Target-Role Gap Analysis Component (High & Medium Priority Skills) */}
      <SkillGapOverview 
        skillGaps={skillGaps} 
        targetRoleTitle={targetRoleTitle} 
        onNavigateToRoadmap={onNavigateToRoadmap}
      />
    </div>
  );
};

export default SkillAnalysisView;
