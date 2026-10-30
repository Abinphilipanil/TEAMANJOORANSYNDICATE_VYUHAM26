import React from 'react';
import { IconUploadCloud, IconSparkles, IconMap } from './Icons';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Upload Your Resume",
      description: "Get started by uploading your resume in PDF format or targeting a role.",
      icon: IconUploadCloud,
    },
    {
      step: 2,
      title: "Get AI Analysis",
      description: "We analyse your skills, experience and match them with real job requirements.",
      icon: IconSparkles,
    },
    {
      step: 3,
      title: "Receive Your Roadmap",
      description: "Get a personalised learning plan with curated resources and applied job opportunities.",
      icon: IconMap,
    },
  ];

  return (
    <section className="ca-how-it-works-section" aria-label="How It Works">
      <div className="section-header">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subline">
          A simple 3-step process to get your personalised career plan.
        </p>
      </div>

      <div className="steps-cards-sequence">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="step-card-wrapper">
              <div className="step-process-card">
                <div className="step-top-row">
                  <div className="step-number-badge">{item.step}</div>
                  <div className="step-icon-box">
                    <Icon className="w-5 h-5 text-blue" />
                  </div>
                </div>

                <h3 className="step-card-title">{item.title}</h3>
                <p className="step-card-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection;

