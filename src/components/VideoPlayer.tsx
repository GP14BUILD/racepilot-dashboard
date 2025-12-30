import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;  // GPS time in seconds
  offsetSeconds: number;  // Video offset from GPS start
  onTimeUpdate?: (time: number) => void;
  onError?: (error: string) => void;
  playbackSpeed?: number;
}

export default function VideoPlayer({
  videoUrl,
  isPlaying,
  currentTime,
  offsetSeconds,
  onTimeUpdate,
  onError,
  playbackSpeed = 1
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync playback state
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(err => console.error('Play failed:', err));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Sync current time with GPS
  useEffect(() => {
    if (!videoRef.current) return;

    const videoTime = currentTime + offsetSeconds;
    const currentVideoTime = videoRef.current.currentTime;

    // Only seek if difference is more than 0.5 seconds to avoid jitter
    if (Math.abs(currentVideoTime - videoTime) > 0.5) {
      videoRef.current.currentTime = videoTime;
    }
  }, [currentTime, offsetSeconds]);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    let errorMessage = 'Failed to load video';

    if (video.error) {
      switch (video.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Video playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Video format not supported';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video source not supported';
          break;
      }
    }

    setError(errorMessage);
    setIsLoading(false);
    if (onError) onError(errorMessage);
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>!</div>
          <div style={styles.errorText}>{error}</div>
          <button
            style={styles.retryButton}
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading video...</div>
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        style={styles.video}
        controls={false}  // Controlled by parent GPS replay
        onLoadedData={() => setIsLoading(false)}
        onError={handleError}
        onTimeUpdate={(e) => {
          if (onTimeUpdate) {
            const video = e.target as HTMLVideoElement;
            onTimeUpdate(video.currentTime - offsetSeconds);
          }
        }}
      />
      <div style={styles.overlay}>
        <div style={styles.syncIndicator}>
          Video synced with GPS
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    pointerEvents: 'none',
  },
  syncIndicator: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 10,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '12px',
    color: '#fff',
    fontSize: '14px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '24px',
  },
  errorIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  errorText: {
    color: '#fff',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  retryButton: {
    padding: '8px 24px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
