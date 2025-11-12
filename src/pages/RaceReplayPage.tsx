import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface TrackPoint {
  ts: string;
  lat: number;
  lon: number;
  sog: number;
  cog: number;
  hdg: number;
  awa?: number;
  aws?: number;
}

interface Maneuver {
  id: number;
  session_id: number;
  timestamp: string;
  maneuver_type: string;
  lat: number;
  lon: number;
  entry_speed: number;
  exit_speed: number;
  time_duration: number;
  angle_change: number;
}

interface Session {
  id: number;
  title: string;
  start_ts: string;
  end_ts?: string;
  user_id: number;
}

const API_URL = 'https://racepilot-backend-production.up.railway.app';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom boat icons
const createBoatIcon = (color: string, isGhost: boolean = false) => {
  return L.divIcon({
    className: 'custom-boat-icon',
    html: `<div style="font-size: 24px; ${isGhost ? 'opacity: 0.7;' : ''}">${isGhost ? '👻' : '⛵'}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function RaceReplayPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const ghostSessionId = searchParams.get('ghost');

  const [session, setSession] = useState<Session | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [maneuvers, setManeuvers] = useState<Maneuver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ghost boat state
  const [ghostSession, setGhostSession] = useState<Session | null>(null);
  const [ghostTrackPoints, setGhostTrackPoints] = useState<TrackPoint[]>([]);
  const [ghostManeuvers, setGhostManeuvers] = useState<Maneuver[]>([]);

  // Replay state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x, 10x
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (id) {
      loadSession(parseInt(id));
      loadTrackPoints(parseInt(id));
      loadManeuvers(parseInt(id));
    }
    if (ghostSessionId) {
      loadGhostSession(parseInt(ghostSessionId));
      loadGhostTrackPoints(parseInt(ghostSessionId));
      loadGhostManeuvers(parseInt(ghostSessionId));
    }
  }, [id, ghostSessionId]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && trackPoints.length > 0) {
      const animate = () => {
        const now = Date.now();
        const deltaTime = now - lastUpdateRef.current;

        // Calculate how many points to advance based on speed and time
        // At 1x speed with 1 Hz GPS, advance 1 point per second
        // At 10x speed, advance 10 points per second
        const pointsPerSecond = playbackSpeed * 1; // Assuming 1 Hz GPS data
        const pointsToAdvance = (deltaTime / 1000) * pointsPerSecond;

        if (pointsToAdvance >= 1) {
          setCurrentIndex(prev => {
            const next = Math.min(prev + Math.floor(pointsToAdvance), trackPoints.length - 1);
            if (next >= trackPoints.length - 1) {
              setIsPlaying(false);
            }
            return next;
          });
          lastUpdateRef.current = now;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      lastUpdateRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, trackPoints.length, playbackSpeed]);

  const loadSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load session');

      const data = await response.json();
      setSession(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadTrackPoints = async (sessionId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/sessions/${sessionId}/points`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load track points');

      const data = await response.json();
      setTrackPoints(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadManeuvers = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/ai/maneuvers/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setManeuvers(data);
      }
    } catch (err) {
      console.error('Failed to load maneuvers:', err);
    }
  };

  // Ghost session loading functions
  const loadGhostSession = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load ghost session');

      const data = await response.json();
      setGhostSession(data);
    } catch (err: any) {
      console.error('Failed to load ghost session:', err);
    }
  };

  const loadGhostTrackPoints = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/sessions/${sessionId}/points`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load ghost track points');

      const data = await response.json();
      setGhostTrackPoints(data);
    } catch (err: any) {
      console.error('Failed to load ghost track points:', err);
    }
  };

  const loadGhostManeuvers = async (sessionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/ai/maneuvers/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGhostManeuvers(data);
      }
    } catch (err) {
      console.error('Failed to load ghost maneuvers:', err);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentIndex(trackPoints.length - 1);
    setIsPlaying(false);
  };

  const cycleSpeed = () => {
    const speeds = [1, 2, 5, 10, 20];
    const currentSpeedIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  if (loading) {
    return <div style={styles.container}>Loading replay...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (trackPoints.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>No GPS data available for this session</div>
      </div>
    );
  }

  const currentPoint = trackPoints[currentIndex];
  const visibleTrack = trackPoints.slice(0, currentIndex + 1);
  const center: [number, number] = [currentPoint.lat, currentPoint.lon];

  // Find maneuvers near current point
  const currentTime = new Date(currentPoint.ts).getTime();
  const nearbyManeuvers = maneuvers.filter(m => {
    const maneuverTime = new Date(m.timestamp).getTime();
    return Math.abs(maneuverTime - currentTime) < 5000; // Within 5 seconds
  });

  const progress = (currentIndex / (trackPoints.length - 1)) * 100;

  // Ghost boat calculations
  let ghostCurrentPoint: TrackPoint | null = null;
  let ghostVisibleTrack: TrackPoint[] = [];
  let timeDifference = 0;
  let distanceDifference = 0;

  if (ghostTrackPoints.length > 0 && trackPoints.length > 0) {
    // Calculate elapsed time for main boat
    const mainStartTime = new Date(trackPoints[0].ts).getTime();
    const mainCurrentTime = new Date(currentPoint.ts).getTime();
    const mainElapsedSeconds = (mainCurrentTime - mainStartTime) / 1000;

    // Find corresponding point in ghost track based on elapsed time
    const ghostStartTime = new Date(ghostTrackPoints[0].ts).getTime();
    const targetGhostTime = ghostStartTime + (mainElapsedSeconds * 1000);

    let ghostIndex = ghostTrackPoints.findIndex(p =>
      new Date(p.ts).getTime() >= targetGhostTime
    );

    if (ghostIndex === -1) {
      ghostIndex = ghostTrackPoints.length - 1;
    } else if (ghostIndex === 0) {
      ghostIndex = 0;
    }

    ghostCurrentPoint = ghostTrackPoints[ghostIndex];
    ghostVisibleTrack = ghostTrackPoints.slice(0, ghostIndex + 1);

    // Calculate time difference (negative means you're ahead)
    const ghostElapsedSeconds = (new Date(ghostCurrentPoint.ts).getTime() - ghostStartTime) / 1000;
    timeDifference = mainElapsedSeconds - ghostElapsedSeconds;

    // Calculate distance difference (simple haversine)
    if (ghostCurrentPoint) {
      const R = 6371e3; // Earth radius in meters
      const φ1 = currentPoint.lat * Math.PI / 180;
      const φ2 = ghostCurrentPoint.lat * Math.PI / 180;
      const Δφ = (ghostCurrentPoint.lat - currentPoint.lat) * Math.PI / 180;
      const Δλ = (ghostCurrentPoint.lon - currentPoint.lon) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      distanceDifference = R * c;
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {ghostSessionId ? '👻 Ghost Boat Racing' : 'Race Replay'}
        </h1>
        {session && <h2 style={styles.subtitle}>{session.title}</h2>}
        {ghostSession && (
          <h3 style={styles.ghostSubtitle}>vs {ghostSession.title}</h3>
        )}
      </div>

      {/* Ghost Mode Status Banner */}
      {ghostSessionId && (
        <div style={styles.ghostBanner}>
          <div style={styles.ghostBannerContent}>
            <span style={styles.ghostIcon}>👻</span>
            <div>
              <div style={styles.ghostBannerTitle}>
                {timeDifference > 0 ? '🔴 Behind' : timeDifference < 0 ? '🟢 Ahead' : '🟡 Tied'}
              </div>
              <div style={styles.ghostBannerStats}>
                Time: {Math.abs(timeDifference).toFixed(1)}s | Distance: {Math.abs(distanceDifference).toFixed(0)}m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div style={styles.mapContainer}>
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Ghost track line (completed portion) */}
          {ghostVisibleTrack.length > 0 && (
            <Polyline
              positions={ghostVisibleTrack.map(p => [p.lat, p.lon])}
              color="#9C27B0"
              weight={3}
              opacity={0.5}
              dashArray="10, 10"
            />
          )}

          {/* Main track line (completed portion) */}
          <Polyline
            positions={visibleTrack.map(p => [p.lat, p.lon])}
            color="#2196F3"
            weight={3}
            opacity={0.7}
          />

          {/* Ghost boat marker */}
          {ghostCurrentPoint && (
            <Marker
              position={[ghostCurrentPoint.lat, ghostCurrentPoint.lon]}
              icon={createBoatIcon('#9C27B0', true)}
            >
              <Popup>
                <div>
                  <strong>👻 Ghost Boat</strong><br/>
                  Speed: {ghostCurrentPoint.sog.toFixed(1)} knots<br/>
                  Heading: {ghostCurrentPoint.cog.toFixed(0)}°<br/>
                  {ghostCurrentPoint.aws && `Wind: ${ghostCurrentPoint.aws.toFixed(1)} knots @ ${ghostCurrentPoint.awa?.toFixed(0)}°`}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Current position marker */}
          <Marker position={center} icon={createBoatIcon('#2196F3', false)}>
            <Popup>
              <div>
                <strong>⛵ Your Boat</strong><br/>
                Speed: {currentPoint.sog.toFixed(1)} knots<br/>
                Heading: {currentPoint.cog.toFixed(0)}°<br/>
                {currentPoint.aws && `Wind: ${currentPoint.aws.toFixed(1)} knots @ ${currentPoint.awa?.toFixed(0)}°`}
              </div>
            </Popup>
          </Marker>

          {/* Maneuver markers */}
          {maneuvers.slice(0, currentIndex).map((maneuver, idx) => (
            <Marker
              key={idx}
              position={[maneuver.lat, maneuver.lon]}
              icon={L.divIcon({
                className: 'maneuver-marker',
                html: maneuver.maneuver_type === 'TACK' ? '⤴️' : '⤵️',
                iconSize: [30, 30],
              })}
            >
              <Popup>
                <div>
                  <strong>{maneuver.maneuver_type}</strong><br/>
                  Duration: {maneuver.time_duration.toFixed(1)}s<br/>
                  Angle: {maneuver.angle_change.toFixed(0)}°<br/>
                  Entry: {maneuver.entry_speed.toFixed(1)} kts<br/>
                  Exit: {maneuver.exit_speed.toFixed(1)} kts
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Metrics Panel */}
      <div style={styles.metricsPanel}>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Speed</div>
          <div style={styles.metricValue}>{currentPoint.sog.toFixed(1)} <span style={styles.metricUnit}>kts</span></div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricLabel}>Heading</div>
          <div style={styles.metricValue}>{currentPoint.cog.toFixed(0)}<span style={styles.metricUnit}>°</span></div>
        </div>
        {currentPoint.aws && (
          <>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Wind Speed</div>
              <div style={styles.metricValue}>{currentPoint.aws.toFixed(1)} <span style={styles.metricUnit}>kts</span></div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Wind Angle</div>
              <div style={styles.metricValue}>{currentPoint.awa?.toFixed(0)}<span style={styles.metricUnit}>°</span></div>
            </div>
          </>
        )}
        {nearbyManeuvers.length > 0 && (
          <div style={{...styles.metric, gridColumn: '1 / -1'}}>
            <div style={styles.maneuverAlert}>
              {nearbyManeuvers[0].maneuver_type} in progress
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />

          {/* Maneuver markers on timeline */}
          {maneuvers.map((maneuver, idx) => {
            const maneuverIndex = trackPoints.findIndex(p =>
              new Date(p.ts).getTime() >= new Date(maneuver.timestamp).getTime()
            );
            if (maneuverIndex === -1) return null;

            const maneuverProgress = (maneuverIndex / (trackPoints.length - 1)) * 100;
            return (
              <div
                key={idx}
                style={{
                  ...styles.maneuverMarker,
                  left: `${maneuverProgress}%`,
                  backgroundColor: maneuver.maneuver_type === 'TACK' ? '#FF5722' : '#4CAF50'
                }}
                title={`${maneuver.maneuver_type} at ${new Date(maneuver.timestamp).toLocaleTimeString()}`}
              />
            );
          })}
        </div>
        <div style={styles.progressTime}>
          {new Date(currentPoint.ts).toLocaleTimeString()} / {new Date(trackPoints[trackPoints.length - 1].ts).toLocaleTimeString()}
        </div>
      </div>

      {/* Playback Controls */}
      <div style={styles.controls}>
        <button onClick={restart} style={styles.controlButton} title="Restart">
          ⏮️ Restart
        </button>
        <button onClick={togglePlayPause} style={{...styles.controlButton, ...styles.playButton}}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={skipToEnd} style={styles.controlButton} title="Skip to End">
          ⏭️ End
        </button>
        <button onClick={cycleSpeed} style={styles.speedButton}>
          {playbackSpeed}x Speed
        </button>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Duration</div>
          <div style={styles.statValue}>
            {Math.floor((new Date(trackPoints[trackPoints.length - 1].ts).getTime() - new Date(trackPoints[0].ts).getTime()) / 60000)} min
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Max Speed</div>
          <div style={styles.statValue}>
            {Math.max(...trackPoints.map(p => p.sog)).toFixed(1)} kts
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg Speed</div>
          <div style={styles.statValue}>
            {(trackPoints.reduce((sum, p) => sum + p.sog, 0) / trackPoints.length).toFixed(1)} kts
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Maneuvers</div>
          <div style={styles.statValue}>{maneuvers.length}</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    fontWeight: 'normal',
  },
  mapContainer: {
    height: '500px',
    marginBottom: '20px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  metricsPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  metric: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  metricUnit: {
    fontSize: '16px',
    color: '#999',
    fontWeight: 'normal',
  },
  maneuverAlert: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressBar: {
    position: 'relative',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'visible',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: '4px',
    transition: 'width 0.1s linear',
  },
  maneuverMarker: {
    position: 'absolute',
    top: '-4px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
    border: '2px solid white',
    cursor: 'pointer',
  },
  progressTime: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '30px',
  },
  controlButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '2px solid #667eea',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  playButton: {
    backgroundColor: '#667eea',
    color: 'white',
  },
  speedButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  error: {
    padding: '16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
  },
  ghostSubtitle: {
    fontSize: '16px',
    color: '#9C27B0',
    fontWeight: 'normal',
    marginTop: '4px',
  },
  ghostBanner: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '2px solid #9C27B0',
  },
  ghostBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  ghostIcon: {
    fontSize: '48px',
  },
  ghostBannerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  },
  ghostBannerStats: {
    fontSize: '16px',
    color: '#666',
  },
};
