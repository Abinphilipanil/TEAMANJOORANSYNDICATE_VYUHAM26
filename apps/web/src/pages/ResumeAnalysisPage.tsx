import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ResumeUpload from '../components/career-agent/ResumeUpload';
import JobDescriptionInput from '../components/career-agent/JobDescriptionInput';
import AnalysisAction from '../components/career-agent/AnalysisAction';
import { IconCheckCircle, IconArrowRight, IconFilePdf } from '../components/career-agent/Icons';
import { analyzeResumeApi } from '../services/resumeAnalysisService';

export const ResumeAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    analysisResumeFile,
    setAnalysisResumeFile,
    analysisJobDescription,
    setAnalysisJobDescription,
    resumeAnalysisResult,
    setResumeAnalysisResult,
  } = useApp();

  const [analysisStep, setAnalysisStep] = useState<1 | 2>(1);
  const [uploadError, setUploadError] = useState('');
  const [jobDescError, setJobDescError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    setAnalysisResumeFile(file);
    setUploadError('');
  };

  const handleFileRemove = () => {
    setAnalysisResumeFile(null);
    setUploadError('');
  };

  const handleJobDescChange = (val: string) => {
    setAnalysisJobDescription(val);
    if (val.trim()) {
      setJobDescError('');
    }
  };

  const handleJobDescClear = () => {
    setAnalysisJobDescription('');
    setJobDescError('');
  };

  const handleProceedToStep2 = () => {
    if (!analysisResumeFile) {
      setUploadError('Please upload your resume in PDF format to continue.');
      return;
    }
    setUploadError('');
    setAnalysisStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStep1 = () => {
    setAnalysisStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    let hasError = false;

    if (!analysisResumeFile) {
      setUploadError('Please select a resume in PDF format before running analysis.');
      hasError = true;
    }

    if (!analysisJobDescription.trim()) {
      setJobDescError('Please paste a job description or use one of the Quick Fill samples.');
      hasError = true;
    } else if (analysisJobDescription.trim().length < 30) {
      setJobDescError('The job description is too short. Please provide the full role description for accurate skill extraction.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setUploadError('');
    setJobDescError('');

    try {
      const data = await analyzeResumeApi({
        file: analysisResumeFile!,
        jobDescription: analysisJobDescription.trim(),
      });
      setResumeAnalysisResult(data);
      // Navigate to dedicated analysis results page
      navigate('/analysis-results');
    } catch (err: any) {
      setJobDescError(err.message || 'Analysis failed. Please verify inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ca-page-container ca-analysis-page max-w-4xl mx-auto px-4 py-8">
      {/* Step Progress Tracker */}
      <div className="analysis-stepper-header">
        <div className="stepper-title-wrap">
          <span className="stepper-badge">Workflow</span>
          <h1 className="stepper-main-heading">
            {analysisStep === 1 ? 'Step 1: Upload Your Resume' : 'Step 2: Target Job Description'}
          </h1>
          <p className="stepper-subtext">
            {analysisStep === 1
              ? 'Provide your resume in PDF format. We will extract skills, experience, and certifications.'
              : 'Paste the requirements for the job you want to target to compare skill overlap and uncover gaps.'}
          </p>
        </div>

        <div className="stepper-indicators-row" aria-label="Analysis steps">
          <div className={`step-pill ${analysisStep === 1 ? 'active' : 'completed'}`}>
            <span className="step-pill-number">
              {analysisResumeFile ? <IconCheckCircle className="w-4 h-4" /> : '1'}
            </span>
            <span className="step-pill-label">1. Upload Resume</span>
          </div>

          <div className="stepper-arrow-divider">&rarr;</div>

          <div className={`step-pill ${analysisStep === 2 ? 'active' : 'pending'}`}>
            <span className="step-pill-number">2</span>
            <span className="step-pill-label">2. Job Description</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Upload Resume Only */}
      {analysisStep === 1 && (
        <div className="step-content-card">
          <ResumeUpload
            file={analysisResumeFile}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            error={uploadError}
            setError={setUploadError}
          />

          <div className="step-navigation-footer">
            <span className="step-hint-text">
              {analysisResumeFile
                ? 'Resume selected. Click Continue to enter the target job description.'
                : 'Select a PDF file above to enable the next step.'}
            </span>

            <button
              type="button"
              className={`btn-step-continue ${!analysisResumeFile ? 'disabled' : ''}`}
              onClick={handleProceedToStep2}
              disabled={!analysisResumeFile}
            >
              <span>Continue to Step 2</span>
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Job Description and Analysis Trigger */}
      {analysisStep === 2 && (
        <div className="step-content-card">
          {/* Active File Reminder Banner */}
          {analysisResumeFile && (
            <div className="active-file-reminder">
              <div className="reminder-left">
                <div className="reminder-pdf-icon">
                  <IconFilePdf className="w-4 h-4" />
                </div>
                <div>
                  <span className="reminder-label">Attached Resume:</span>
                  <strong className="reminder-filename">{analysisResumeFile.name}</strong>
                  <span className="reminder-size">({Math.round(analysisResumeFile.size / 1024)} KB)</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-change-file"
                onClick={handleBackToStep1}
                title="Change resume file"
              >
                Change Resume
              </button>
            </div>
          )}

          <JobDescriptionInput
            value={analysisJobDescription}
            onChange={handleJobDescChange}
            onClear={handleJobDescClear}
            error={jobDescError}
          />

          <div className="step-navigation-footer step-footer-split">
            <button
              type="button"
              className="btn-step-back"
              onClick={handleBackToStep1}
              disabled={isLoading}
            >
              &larr; Back to Step 1
            </button>

            <div className="step-action-wrap">
              <AnalysisAction
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                isDisabled={!analysisResumeFile || !analysisJobDescription.trim()}
                validationSummary={
                  !analysisJobDescription.trim()
                    ? 'Please paste a job description or select a sample above.'
                    : ''
                }
                hasResults={Boolean(resumeAnalysisResult)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisPage;

