import { CSSProperties } from 'react';

interface ReplayControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  currentTime: string;
  totalTime: string;
  progress: number;
  onTogglePlayPause: () => void;
  onRestart: () => void;
  onSkipToEnd: () => void;
  onCycleSpeed: () => void;
  maneuvers?: Array<{
    timestamp: string;
    maneuver_type: string;
    progress: number;
  }>;
}

export default function ReplayControls({
  isPlaying,
  playbackSpeed,
  currentTime,
  totalTime,
  progress,
  onTogglePlayPause,
  onRestart,
  onSkipToEnd,
  onCycleSpeed,
  maneuvers = []
}: ReplayControlsProps) {
  return (
    <>
      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />

          {/* Maneuver markers on timeline */}
          {maneuvers.map((maneuver, idx) => (
            <div
              key={idx}
              style={{
                ...styles.maneuverMarker,
                left: `${maneuver.progress}%`,
                backgroundColor: maneuver.maneuver_type === 'TACK' ? '#FF5722' : '#4CAF50'
              }}
              title={`${maneuver.maneuver_type} at ${new Date(maneuver.timestamp).toLocaleTimeString()}`}
            />
          ))}
        </div>
        <div style={styles.progressTime}>
          {currentTime} / {totalTime}
        </div>
      </div>

      {/* Playback Controls */}
      <div style={styles.controls}>
        <button onClick={onRestart} style={styles.controlButton} title="Restart">
          ⏮️ Restart
        </button>
        <button onClick={onTogglePlayPause} style={{...styles.controlButton, ...styles.playButton}}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={onSkipToEnd} style={styles.controlButton} title="Skip to End">
          ⏭️ End
        </button>
        <button onClick={onCycleSpeed} style={styles.speedButton}>
          {playbackSpeed}x Speed
        </button>
      </div>
    </>
  );
}

const styles: { [key: string]: CSSProperties } = {
  progressContainer: {
    marginTop: '16px'
  },
  progressBar: {
    position: 'relative',
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'visible',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #38bdf8, #0284c7)',
    borderRadius: '4px',
    transition: 'width 0.1s linear'
  },
  maneuverMarker: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid white',
    cursor: 'pointer',
    zIndex: 10
  },
  progressTime: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center' as const
  },
  controls: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '16px'
  },
  controlButton: {
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },
  playButton: {
    background: 'linear-gradient(to right, #38bdf8, #0284c7)',
    fontWeight: 'bold' as const
  },
  speedButton: {
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#38bdf8',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '600' as const,
    fontFamily: 'inherit'
  }
};
