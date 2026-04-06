import { useState } from 'react';
import './CVUpload.css';
import SkillDisplay from './SkillDisplay';

const CVUpload = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            
            {skills.length > 0 && (
                <SkillDisplay skills={skills} />
            )}
        </div>
    );
};

export default CVUpload;

