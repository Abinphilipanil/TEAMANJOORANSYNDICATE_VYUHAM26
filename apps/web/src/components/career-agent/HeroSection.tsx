import React from 'react';
import { IconArrowRight, IconFileText, IconCheckCircle, IconAlertCircle, IconClock } from './Icons';

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  return (
    <section className="ca-hero-section">
      <div className="hero-content">
        <h1 className="hero-headline">
          Turn Your Skills Into Real Opportunities
        </h1>
        <p className="hero-subtext">
          Upload your resume, get AI-powered insights, find skill gaps and receive a personalised learning roadmap.
        </p>

        {/* Primary CTA Button */}
        <div className="hero-actions">
          <button
            type="button"
            className="btn-primary-cta"
            onClick={onStartAnalysis}
          >
            <span>Analyse My Resume</span>
            <IconArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Illustration: Resume card connected to three compact insight cards */}
      <div className="hero-illustration-wrap" aria-hidden="true">
        <div className="illustration-canvas">
          {/* Main Resume Card */}
          <div className="resume-preview-card">
            <div className="resume-card-header">
              <div className="resume-card-icon">
                <IconFileText className="w-5 h-5" />
              </div>
              <div className="resume-header-lines">
                <div className="line line-title" />
                <div className="line line-sub" />
              </div>
            </div>
            <div className="resume-card-body">
              <div className="line line-body-full" />
              <div className="line line-body-half" />
              <div className="line line-body-three-quarter" />
            </div>
          </div>

          {/* Three Compact Insight Cards */}
          <div className="insight-floating-cards">
            {/* 1. Job Match */}
            <div className="insight-card card-match">
              <div className="insight-icon match-icon">
                <IconCheckCircle className="w-4 h-4" />
              </div>
              <div className="insight-info">
                <span className="insight-label">Job Match</span>
                <span className="insight-val text-blue">78%</span>
              </div>
            </div>

            {/* 2. Skill Gaps */}
            <div className="insight-card card-gaps">
              <div className="insight-icon gap-icon">
                <IconAlertCircle className="w-4 h-4" />
              </div>
              <div className="insight-info">
                <span className="insight-label">Skill Gaps</span>
                <span className="insight-val text-red">3 Critical</span>
              </div>
            </div>

            {/* 3. Learning Plan */}
            <div className="insight-card card-plan">
              <div className="insight-icon plan-icon">
                <IconClock className="w-4 h-4" />
              </div>
              <div className="insight-info">
                <span className="insight-label">Learning Plan</span>
                <span className="insight-val text-blue">12 Weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

