import React, { useRef, useState } from 'react';
import { IconUploadCloud, IconFilePdf, IconTrash, IconCheckCircle, IconAlertCircle } from './Icons';

interface ResumeUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  error?: string;
  setError?: (err: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  file,
  onFileSelect,
  onFileRemove,
  error,
  setError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    if (bytes < k) return `${bytes} B`;
    if (bytes < k * 1024) return `${Math.round(bytes / k)} KB`;
    return `${(bytes / (k * 1024)).toFixed(1)} MB`;
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (!selectedFile) return;

    // Check file type: must be PDF
    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      if (setError) {
        setError('Invalid file type. Please upload a valid PDF document (.pdf).');
      }
      return;
    }

    // Check file size (max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      if (setError) {
        setError('File size exceeds the 10MB limit. Please upload a smaller PDF.');
      }
      return;
    }

    if (setError) setError('');
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleTriggerClick = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileRemove();
    if (setError) setError('');
  };

  const handleSampleFill = () => {
    const sampleBlob = new Blob(
      [
        'Alex Rivera\nCloud & Full-Stack Solutions Engineer\nExperience: React.js, Node.js, REST APIs, SQL, Docker, Git'
      ],
      { type: 'application/pdf' }
    );
    const sampleFile = new File([sampleBlob], 'Alex_Rivera_Resume.pdf', {
      type: 'application/pdf',
    });
    validateAndSetFile(sampleFile);
  };

  return (
    <div className="cm-upload-panel">
      <div className="cm-panel-header">
        <div className="cm-step-tag">Step 1</div>
        <div className="cm-panel-title-row">
          <h2 className="cm-panel-title">Resume PDF Document</h2>
          {!file && (
            <button
              type="button"
              className="cm-btn-sample-resume"
              onClick={handleSampleFill}
              title="Load a sample resume for quick evaluation"
            >
              Use Sample Candidate Resume
            </button>
          )}
        </div>
        <p className="cm-panel-desc">
          Upload your resume in PDF format. We will extract technical skills, tools, and experience.
        </p>
      </div>

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="cm-hidden-file-input"
        style={{ display: 'none' }}
        onChange={handleChange}
        aria-label="Upload resume in PDF format"
      />

      {!file ? (
        <div
          className={`cm-dropzone ${isDragOver ? 'cm-dropzone-dragover' : ''} ${error ? 'cm-dropzone-error' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerClick();
            }
          }}
          aria-label="Drag and drop your resume here or click to browse"
        >
          <div className="cm-dropzone-icon-box">
            <IconUploadCloud className="w-6 h-6" />
          </div>

          <div className="cm-dropzone-main-text">
            Drag and drop your resume here
          </div>

          <div className="cm-dropzone-sub-action">
            <span className="cm-click-cta">or click to browse</span>
          </div>

          <div className="cm-dropzone-sub-text">
            PDF only &middot; Maximum size 10 MB
          </div>
        </div>
      ) : (
        <div className="cm-selected-file-card">
          <div className="cm-file-card-left">
            <div className="cm-pdf-icon-wrapper" aria-hidden="true">
              <IconFilePdf className="w-6 h-6" />
            </div>
            <div className="cm-file-meta">
              <span className="cm-file-name" title={file.name}>
                {file.name}
              </span>
              <span className="cm-file-size">
                PDF document &middot; {formatFileSize(file.size)}
              </span>
            </div>
          </div>

          <div className="cm-file-card-right">
            <span className="cm-status-ready">
              <IconCheckCircle className="w-4 h-4" />
              <span>Ready for Analysis</span>
            </span>

            <button
              type="button"
              className="cm-btn-remove"
              onClick={handleRemove}
              title="Remove resume"
              aria-label="Remove selected resume"
            >
              <IconTrash className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="cm-error-alert" role="alert">
          <IconAlertCircle className="w-4 h-4 text-red flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
