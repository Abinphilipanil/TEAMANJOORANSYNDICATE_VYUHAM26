import React from 'react';
import { IconFileText, IconTrash } from './Icons';
import { sampleJobDescriptions } from '../../data/sampleJobDescriptions';

interface JobDescriptionInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  error?: string;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onClear,
  error,
}) => {
  const charCount = value ? value.length : 0;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handleSelectSample = (sampleText: string) => {
    onChange(sampleText);
  };

  return (
    <div className="cm-job-desc-panel">
      <div className="cm-panel-header">
        <div className="cm-step-tag">Step 2</div>
        <div className="cm-panel-title-row">
          <h2 className="cm-panel-title">Target Job Description</h2>
          <div className="cm-sample-buttons-wrap">
            <span className="cm-sample-label">Quick Fill:</span>
            {sampleJobDescriptions.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="cm-btn-sample"
                onClick={() => handleSelectSample(sample.text)}
                title={`Load sample: ${sample.title}`}
              >
                {sample.id === 'fullstack' ? 'Full-Stack Role' : 'DevOps Role'}
              </button>
            ))}
          </div>
        </div>
        <p className="cm-panel-desc">
          Paste the complete job posting including requirements, tech stack, and responsibilities.
        </p>
      </div>

      <div className={`cm-textarea-container ${error ? 'cm-textarea-error' : ''}`}>
        <textarea
          className="cm-textarea"
          rows={9}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Example Job Description:\n\nWe are looking for a Senior Full-Stack Engineer with 3+ years of experience in React, Node.js, and PostgreSQL.\n\nKey Responsibilities:\n- Build scalable frontend interfaces in React and TypeScript.\n- Architect RESTful microservices and manage PostgreSQL data structures.\n- Deploy and containerize applications with Docker and Kubernetes.\n- Build CI/CD automation pipelines using GitHub Actions.\n\nRequirements:\n- Strong proficiency in JavaScript/TypeScript, React, Node.js.\n- Hands-on experience with Docker, Kubernetes, and Cloud (AWS/GCP).\n- Experience with automated unit testing and agile workflows.`}
          aria-label="Job description input"
        />

        <div className="cm-textarea-footer">
          <div className="cm-count-indicators">
            <span className="cm-count-item">
              <strong>{charCount.toLocaleString()}</strong> characters
            </span>
            <span className="cm-count-divider">&bull;</span>
            <span className="cm-count-item">
              <strong>{wordCount.toLocaleString()}</strong> words
            </span>
            {charCount > 0 && charCount < 100 && (
              <span className="cm-count-hint text-amber">
                (Tip: Longer job descriptions yield more accurate skill extraction)
              </span>
            )}
          </div>

          {value && (
            <button
              type="button"
              className="cm-btn-clear-text"
              onClick={onClear}
              title="Clear input"
            >
              <IconTrash className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="cm-error-alert" role="alert">
          <IconFileText className="w-4 h-4 text-red flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionInput;

