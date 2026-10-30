import React from 'react';
import { IconSparkles, IconAlertCircle, IconRefreshCw } from './Icons';

interface AnalysisActionProps {
  onAnalyze: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
  validationSummary?: string;
  hasResults?: boolean;
  onReset?: () => void;
}

export const AnalysisAction: React.FC<AnalysisActionProps> = ({
  onAnalyze,
  isLoading,
  isDisabled,
  validationSummary,
  hasResults,
  onReset,
}) => {
  return (
    <div className="cm-action-section">
      <div className="cm-action-container">
        {validationSummary && (
          <div className="cm-validation-box" role="status">
            <IconAlertCircle className="w-4 h-4 text-amber flex-shrink-0" />
            <span>{validationSummary}</span>
          </div>
        )}

        <div className="cm-action-buttons-row">
          <button
            type="button"
            className={`cm-btn-analyze ${isDisabled ? 'cm-btn-disabled' : ''} ${isLoading ? 'cm-btn-loading' : ''}`}
            onClick={onAnalyze}
            disabled={isDisabled || isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="cm-spinner" />
                <span>Extracting & Comparing Skills...</span>
              </>
            ) : (
              <>
                <IconSparkles className="w-5 h-5" />
                <span>{hasResults ? 'Re-Analyze Resume' : 'Analyze My Resume'}</span>
              </>
            )}
          </button>

          {hasResults && !isLoading && onReset && (
            <button
              type="button"
              className="cm-btn-reset"
              onClick={onReset}
              title="Start a new analysis"
            >
              <IconRefreshCw className="w-4 h-4" />
              <span>Reset & New Analysis</span>
            </button>
          )}
        </div>

        {isLoading && (
          <div className="cm-loading-steps">
            <div className="cm-step-indicator active">
              <span className="cm-step-dot" /> 1. Reading PDF text structures (PyMuPDF service)
            </div>
            <div className="cm-step-indicator active">
              <span className="cm-step-dot" /> 2. Parsing technical competencies & experience
            </div>
            <div className="cm-step-indicator active">
              <span className="cm-step-dot" /> 3. Computing semantic match & identifying skill gaps
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisAction;

