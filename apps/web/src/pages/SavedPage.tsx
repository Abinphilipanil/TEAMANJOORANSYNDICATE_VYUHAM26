import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowRight, IconCheckCircle } from '../components/career-agent/Icons';

export const SavedPage: React.FC = () => {
  const navigate = useNavigate();

  const savedItems = [
    {
      id: "saved-1",
      title: "Senior Full-Stack Cloud Engineer",
      company: "Starlight Tech Solutions",
      type: "Role Bookmark",
      dateSaved: "Oct 28, 2026",
      matchScore: "92%",
    },
    {
      id: "saved-2",
      title: "Kubernetes & IaC Masterclass Roadmap",
      company: "Curated Learning Track",
      type: "Roadmap Sprint",
      dateSaved: "Oct 29, 2026",
      matchScore: "Phase 2",
    },
  ];

  return (
    <div className="ca-page-container ca-saved-page">
      <div className="saved-page-header">
        <span className="page-badge">Saved Items</span>
        <h1 className="page-title">Saved Opportunities & Roadmaps</h1>
        <p className="page-subtitle">Quickly access bookmarked career paths, job listings, and learning modules.</p>
      </div>

      <div className="saved-items-grid">
        {savedItems.map((item) => (
          <div key={item.id} className="saved-item-card">
            <div className="saved-card-top">
              <span className="saved-type-pill">{item.type}</span>
              <span className="saved-date">Saved on {item.dateSaved}</span>
            </div>

            <h3 className="saved-card-title">{item.title}</h3>
            <span className="saved-company">{item.company}</span>

            <div className="saved-card-footer">
              <div className="saved-match-indicator">
                <IconCheckCircle className="w-4 h-4 text-emerald" />
                <span>{item.matchScore}</span>
              </div>

              <button
                type="button"
                className="btn-view-saved"
                onClick={() => navigate('/job-matching')}
              >
                <span>View Details</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPage;

