import React, { useState } from 'react';
import { LucideFilePenLine, Download, Share2, Copy } from 'lucide-react';

const CoverLetter = ({ uploadedFilename, jdFilename, onGenerate, loading, generatedCover, onDownload }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = () => {
    onGenerate({
      resumeFile: uploadedFilename,
      jobFile: jdFilename,
      customPrompt: customPrompt.trim()
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCover);
    // Show copied toast (handled by parent)
  };

  return (
    <div className="cover-letter-container">
      <div className="section-header">
        <h2 className="section-title">
          <LucideFilePenLine className="inline-icon" />
          AI Cover Letter Generator
        </h2>
        <p className="section-subtitle">Generate personalized cover letters in seconds</p>
      </div>

      {!uploadedFilename || !jdFilename ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Upload CV and Job Description first</h3>
          <p>Generate perfect cover letters tailored to each job</p>
        </div>
      ) : (
        <>
          <div className="cover-actions">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary generate-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                '✨ Generate Cover Letter'
              )}
            </button>
          </div>

          {generatedCover && (
            <div className="cover-result">
              <div className="cover-header">
                <h3>✨ Your Generated Cover Letter</h3>
                <div className="cover-actions">
                  <button onClick={onDownload} className="btn btn-success btn-sm" title="Download PDF">
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Copy to clipboard">
                    <Copy size={18} />
                    Copy Text
                  </button>
                  <button className="btn btn-secondary btn-sm" title="Share">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
              <div className="cover-content">
                {generatedCover}
              </div>
            </div>
          )}

          <div className="custom-prompt-section">
            <label className="form-label">Optional: Custom Instructions</label>
            <textarea
              placeholder="e.g. Make it more formal, emphasize leadership experience, 300 words max..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="form-textarea"
              rows="3"
            />
            <p className="help-text">Fine-tune your cover letter with specific instructions</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CoverLetter;

