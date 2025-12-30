import { useState, useEffect } from 'react';

interface VideoUploadProps {
  sessionId: number;
  onUploadComplete?: () => void;
}

interface Video {
  id: number;
  session_id: number;
  filename: string;
  file_size: number;
  title?: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://api.race-pilot.app';

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

  // Existing videos
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [sessionVideos, setSessionVideos] = useState<Video[]>([]);
  const [showMyVideos, setShowMyVideos] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Load user's videos and session videos
  useEffect(() => {
    loadSessionVideos();
    if (showMyVideos) {
      loadMyVideos();
    }
  }, [sessionId, showMyVideos]);

  const loadSessionVideos = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/videos/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSessionVideos(data);
      }
    } catch (err) {
      console.error('Failed to load session videos:', err);
    }
  };

  const loadMyVideos = async () => {
    setLoadingVideos(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/videos/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyVideos(data);
      }
    } catch (err) {
      console.error('Failed to load my videos:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const deleteVideo = async (videoId: number) => {
    setDeletingId(videoId);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/videos/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        // Remove from both lists
        setSessionVideos(prev => prev.filter(v => v.id !== videoId));
        setMyVideos(prev => prev.filter(v => v.id !== videoId));
        setDeleteConfirmId(null);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Failed to delete video:', err);
      setError('Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

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
          loadSessionVideos(); // Refresh session videos
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Race Videos</h3>

      {/* Current Session Videos */}
      {sessionVideos.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Videos for this session:</h4>
          <div style={styles.videoList}>
            {sessionVideos.map(video => (
              <div key={video.id} style={styles.videoItem}>
                <div style={styles.videoIcon}>V</div>
                <div style={styles.videoInfo}>
                  <div style={styles.videoName}>
                    {video.title || video.filename}
                  </div>
                  <div style={styles.videoMeta}>
                    {formatFileSize(video.file_size)} • {formatDate(video.created_at)}
                  </div>
                </div>
                {deleteConfirmId === video.id ? (
                  <div style={styles.deleteConfirm}>
                    <span style={styles.deleteConfirmText}>Delete?</span>
                    <button
                      style={styles.confirmYes}
                      onClick={() => deleteVideo(video.id)}
                      disabled={deletingId === video.id}
                    >
                      {deletingId === video.id ? '...' : 'Yes'}
                    </button>
                    <button
                      style={styles.confirmNo}
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.deleteButton}
                    onClick={() => setDeleteConfirmId(video.id)}
                    title="Delete video"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle to show my videos */}
      <button
        onClick={() => setShowMyVideos(!showMyVideos)}
        style={styles.toggleButton}
      >
        {showMyVideos ? '− Hide' : '+ Show'} My Video Library ({myVideos.length} videos)
      </button>

      {/* My Videos Library */}
      {showMyVideos && (
        <div style={styles.section}>
          {loadingVideos ? (
            <div style={styles.loading}>Loading your videos...</div>
          ) : myVideos.length === 0 ? (
            <div style={styles.emptyState}>No videos uploaded yet</div>
          ) : (
            <div style={styles.videoList}>
              {myVideos.map(video => (
                <div key={video.id} style={styles.videoItem}>
                  <div style={{
                    ...styles.videoIcon,
                    backgroundColor: video.session_id === sessionId ? '#667eea' : '#6b7280'
                  }}>
                    V
                  </div>
                  <div style={styles.videoInfo}>
                    <div style={styles.videoName}>
                      {video.title || video.filename}
                    </div>
                    <div style={styles.videoMeta}>
                      Session {video.session_id} • {formatFileSize(video.file_size)} • {formatDate(video.created_at)}
                    </div>
                  </div>
                  {deleteConfirmId === video.id ? (
                    <div style={styles.deleteConfirm}>
                      <span style={styles.deleteConfirmText}>Delete?</span>
                      <button
                        style={styles.confirmYes}
                        onClick={() => deleteVideo(video.id)}
                        disabled={deletingId === video.id}
                      >
                        {deletingId === video.id ? '...' : 'Yes'}
                      </button>
                      <button
                        style={styles.confirmNo}
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      style={styles.deleteButton}
                      onClick={() => setDeleteConfirmId(video.id)}
                      title="Delete video"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload New Video */}
      <div style={styles.uploadSection}>
        <h4 style={styles.sectionTitle}>Upload New Video</h4>

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
  section: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  videoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  videoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: '#6b7280',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  videoInfo: {
    flex: 1,
    minWidth: 0,
  },
  videoName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  videoMeta: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  toggleButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '24px',
    color: '#6b7280',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  uploadSection: {
    marginTop: '16px',
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
  deleteButton: {
    padding: '6px 10px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0,
  },
  deleteConfirm: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  deleteConfirmText: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
  },
  confirmYes: {
    padding: '4px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmNo: {
    padding: '4px 12px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
