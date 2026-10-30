import React from 'react';
import SkillAnalysisView from '../components/career-agent/views/SkillAnalysisView';
import { currentSkills, skillGaps } from '../data/sampleData';
import { useApp } from '../context/AppContext';

export const SkillGapsPage: React.FC = () => {
  const { selectedRole } = useApp();
  const targetRoleTitle = selectedRole?.title || 'Cloud Solutions Architect';

  return (
    <div className="ca-page-container ca-skill-gaps-page max-w-6xl mx-auto px-4 py-8">
      <SkillAnalysisView
        currentSkills={currentSkills}
        skillGaps={skillGaps}
        targetRoleTitle={targetRoleTitle}
      />
    </div>
  );
};

export default SkillGapsPage;

