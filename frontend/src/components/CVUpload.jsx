import { useState } from 'react';
import './CVUpload.css';
import SkillDisplay from './SkillDisplay';
import JobMatches from './JobMatches';

const CVUpload = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [skills, setSkills] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('skills');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(selectedFile.type)) {
                setMessage('Error: Only PDF and DOCX files are allowed');
                return;
            }
            setFile(selectedFile);
            setMessage('');
            setExtractedText('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Error: Please select a file first');
            return;
        }

        setLoading(true);
        setMessage('');
        setExtractedText('');

        const formData = new FormData();
        formData.append('cv', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload-cv', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setExtractedText(data.extractedText || '');
                setSkills(data.skills || []);
                setJobs(data.matchingJobs || []);
            } else {
                setMessage(data.message || 'Error uploading file');
            }
        } catch (error) {
            setMessage('Error: Failed to connect to server');
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cv-upload-container">
            <h2>Upload Your Resume</h2>
            <div className="upload-section">
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="file-input"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={loading || !file}
                    className="upload-button"
                >
                    {loading ? 'Uploading...' : 'Upload CV'}
                </button>
            </div>
            
            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            {extractedText && (
                <div className="extracted-text-section">
                    <h3>Extracted Resume Text:</h3>
                    <div className="extracted-text">
                        {extractedText}
                    </div>
                </div>
            )}
            
            {(skills.length > 0 || jobs.length > 0) && (
                <div className="results-tabs">
                    <div className="tab-buttons">
                        <button 
                            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('skills')}
                        >
                            Skills ({skills.length})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            Matching Jobs ({jobs.length})
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'skills' && skills.length > 0 && (
                            <SkillDisplay skills={skills} />
                        )}
                        {activeTab === 'jobs' && (
                            <JobMatches jobs={jobs} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVUpload;

