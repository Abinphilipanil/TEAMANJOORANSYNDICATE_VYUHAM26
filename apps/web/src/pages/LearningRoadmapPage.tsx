import React from 'react';
import RoadmapFullView from '../components/career-agent/views/RoadmapFullView';
import { learningRoadmap } from '../data/sampleData';
import { useApp } from '../context/AppContext';

export const LearningRoadmapPage: React.FC = () => {
  const { selectedRole } = useApp();
  const targetRoleTitle = selectedRole?.title || 'Cloud Solutions Architect';

  return (
    <div className="ca-page-container ca-roadmap-page max-w-6xl mx-auto px-4 py-8">
      <RoadmapFullView
        roadmap={learningRoadmap}
        targetRoleTitle={targetRoleTitle}
      />
    </div>
  );
};

export default LearningRoadmapPage;

