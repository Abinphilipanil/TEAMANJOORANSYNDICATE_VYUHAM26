import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/career-agent/HeroSection';
import SummaryMetrics from '../components/career-agent/SummaryMetrics';
import HowItWorksSection from '../components/career-agent/HowItWorksSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="ca-page-container ca-home-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Hero Section with Dominant "Analyse My Resume" CTA */}
      <HeroSection onStartAnalysis={() => navigate('/resume-analysis')} />

      {/* 2. Compact Summary Metrics Strip */}
      <SummaryMetrics />

      {/* 3. Simple 'How It Works' 3-Step Section */}
      <HowItWorksSection />
    </div>
  );
};

export default HomePage;

