import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CareerExplorerView from '../components/career-agent/views/CareerExplorerView';
import { careerRecommendations, CareerRecommendation } from '../data/sampleData';

export const JobMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<CareerRecommendation>(careerRecommendations[0]);

  return (
    <div className="ca-page-container ca-job-matching-page max-w-6xl mx-auto px-4 py-8">
      <CareerExplorerView
        careerRecommendations={careerRecommendations}
        selectedRole={selectedRole}
        onSelectRole={(role) => setSelectedRole(role)}
        onNavigateToRoadmap={() => navigate('/learning-roadmap')}
      />
    </div>
  );
};

export default JobMatchingPage;

