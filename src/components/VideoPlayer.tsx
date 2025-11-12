import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;  // GPS time in seconds
  offsetSeconds: number;  // Video offset from GPS start
  onTimeUpdate?: (time: number) => void;
  playbackSpeed?: number;
}

export default function VideoPlayer({
  videoUrl,
  isPlaying,
  currentTime,
  offsetSeconds,
  onTimeUpdate,
  playbackSpeed = 1
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        src={videoUrl}
        style={styles.video}
        controls={false}  // Controlled by parent GPS replay
        onTimeUpdate={(e) => {
          if (onTimeUpdate) {
            const video = e.target as HTMLVideoElement;
            onTimeUpdate(video.currentTime - offsetSeconds);
          }
        }}
      />
      <div style={styles.overlay}>
        <div style={styles.syncIndicator}>
          📹 Video synced with GPS
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
};
