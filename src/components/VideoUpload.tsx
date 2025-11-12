import { useState } from 'react';

interface VideoUploadProps {
  sessionId: number;
  onUploadComplete?: () => void;
}

const API_URL = 'https://racepilot-backend-production.up.railway.app';

export default function VideoUpload({ sessionId, onUploadComplete }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offsetSeconds, setOffsetSeconds] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please select MP4, MOV, WebM, or AVI.');
        return;
      }

      // Validate file size (500 MB)
      const maxSize = 500 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File too large. Maximum size is 500MB.');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', sessionId.toString());
      formData.append('title', title);
      formData.append('description', description);
      formData.append('offset_seconds', offsetSeconds.toString());
      formData.append('is_public', isPublic.toString());

      const token = localStorage.getItem('auth_token');
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          setSuccess(true);
          setFile(null);
          setTitle('');
          setDescription('');
          setOffsetSeconds(0);
          setIsPublic(false);
          setProgress(0);
          if (onUploadComplete) onUploadComplete();
        } else {
          setError(`Upload failed: ${xhr.responseText}`);
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please try again.');
        setUploading(false);
      });

      xhr.open('POST', `${API_URL}/videos/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Upload Race Video</h3>

      {/* File Select */}
      <div style={styles.fileSelect}>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
          onChange={handleFileSelect}
          style={styles.fileInput}
          id="video-upload"
          disabled={uploading}
        />
        <label htmlFor="video-upload" style={styles.fileLabel}>
          {file ? file.name : 'Choose video file (MP4, MOV, WebM, AVI - max 500MB)'}
        </label>
      </div>

      {file && (
        <>
          {/* Metadata */}
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title (optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Race 3 - Championship Series"
                style={styles.input}
                disabled={uploading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about this video..."
                style={styles.textarea}
                rows={3}
                disabled={uploading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Time Offset (seconds)
                <span style={styles.hint}>Adjust video sync with GPS data</span>
              </label>
              <input
                type="number"
                value={offsetSeconds}
                onChange={(e) => setOffsetSeconds(parseFloat(e.target.value))}
                step={0.1}
                style={styles.input}
                disabled={uploading}
              />
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="is-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={uploading}
              />
              <label htmlFor="is-public" style={styles.checkboxLabel}>
                Make this video public (visible to others)
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              ...styles.uploadButton,
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? `Uploading... ${Math.round(progress)}%` : 'Upload Video'}
          </button>

          {/* Progress Bar */}
          {uploading && (
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          )}
        </>
      )}

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && (
        <div style={styles.success}>
          Video uploaded successfully! It may take a moment to process.
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  fileSelect: {
    marginBottom: '20px',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'block',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#666',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  hint: {
    fontSize: '12px',
    fontWeight: 'normal',
    color: '#999',
    marginLeft: '8px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#333',
  },
  uploadButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  progressBar: {
    marginTop: '16px',
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    transition: 'width 0.3s ease',
  },
  error: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    borderRadius: '6px',
    fontSize: '14px',
  },
  success: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    borderRadius: '6px',
    fontSize: '14px',
  },
};
