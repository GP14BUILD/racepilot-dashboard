import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { getSessions, getSessionPoints, getRaceCourses } from '../api';
import type { Session, TrackPoint, RaceCourse } from '../types';
import RaceMarksOverlay from '../components/RaceMarksOverlay';
import ReplayControls from '../components/ReplayControls';
import L from 'leaflet';

// Map controller component to update view when tracks change
function MapViewController({ points }: { points: TrackPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lon] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    }
  }, [points, map]);

  return null;
}

// Color palette for different sessions
const SESSION_COLORS = [
  '#2196F3', // Blue
  '#F44336', // Red
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FFEB3B', // Yellow
  '#E91E63', // Pink
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

interface SessionWithPoints {
  session: Session;
  points: TrackPoint[];
  color: string;
  visible: boolean;
}

export default function FleetComparisonPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionData, setSessionData] = useState<Map<number, SessionWithPoints>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raceCourses, setRaceCourses] = useState<RaceCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<RaceCourse | null>(null);
  const [showCourse, setShowCourse] = useState(true);

  // Replay mode state
  const [replayMode, setReplayMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0); // milliseconds from start
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    loadSessions();
    loadRaceCourses();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const allSessions = await getSessions();
      setSessions(allSessions);

      // Auto-select first 5 sessions
      const initialSelection = allSessions.slice(0, 5);
      await loadSessionPoints(initialSelection);
    } catch (err) {
      setError('Failed to load sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionPoints = async (sessionsToLoad: Session[]) => {
    const newSessionData = new Map<number, SessionWithPoints>();

    for (let i = 0; i < sessionsToLoad.length; i++) {
      const session = sessionsToLoad[i];
      try {
        const points = await getSessionPoints(session.id);
        newSessionData.set(session.id, {
          session,
          points,
          color: SESSION_COLORS[i % SESSION_COLORS.length],
          visible: true,
        });
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // Session has no points, add it with empty array
          newSessionData.set(session.id, {
            session,
            points: [],
            color: SESSION_COLORS[i % SESSION_COLORS.length],
            visible: true,
          });
          console.log(`Session ${session.id} has no track points yet`);
        } else {
          console.error(`Failed to load points for session ${session.id}:`, err);
        }
      }
    }

    setSessionData(newSessionData);
  };

  const loadRaceCourses = async () => {
    try {
      const courses = await getRaceCourses();
      setRaceCourses(courses);
      if (courses.length > 0) {
        setSelectedCourse(courses[0]);
      }
    } catch (err) {
      console.error('Failed to load race courses:', err);
    }
  };

  const toggleSession = async (session: Session) => {
    const newSessionData = new Map(sessionData);

    if (newSessionData.has(session.id)) {
      // Toggle visibility
      const data = newSessionData.get(session.id)!;
      data.visible = !data.visible;
      setSessionData(newSessionData);
    } else {
      // Load and add session
      try {
        const points = await getSessionPoints(session.id);
        const usedColors = Array.from(sessionData.values()).map(d => d.color);
        const availableColor = SESSION_COLORS.find(c => !usedColors.includes(c)) || SESSION_COLORS[0];

        newSessionData.set(session.id, {
          session,
          points,
          color: availableColor,
          visible: true,
        });
        setSessionData(newSessionData);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // Session has no points, add it with empty array
          const usedColors = Array.from(sessionData.values()).map(d => d.color);
          const availableColor = SESSION_COLORS.find(c => !usedColors.includes(c)) || SESSION_COLORS[0];

          newSessionData.set(session.id, {
            session,
            points: [],
            color: availableColor,
            visible: true,
          });
          setSessionData(newSessionData);
          console.log(`Session ${session.id} has no track points yet`);
        } else {
          console.error(`Failed to load points for session ${session.id}:`, err);
        }
      }
    }
  };

  // Replay animation loop
  useEffect(() => {
    if (isPlaying && replayMode) {
      const visibleSessionsWithPoints = Array.from(sessionData.values())
        .filter(d => d.visible && d.points.length > 0);

      if (visibleSessionsWithPoints.length === 0) {
        setIsPlaying(false);
        return;
      }

      // Find longest session duration (all boats start together at virtual time 0)
      const totalDuration = Math.max(
        ...visibleSessionsWithPoints.map(d => {
          const start = new Date(d.points[0].ts).getTime();
          const end = new Date(d.points[d.points.length - 1].ts).getTime();
          return end - start;
        })
      );

      const animate = () => {
        const now = Date.now();
        const deltaTime = now - lastUpdateRef.current;

        // Advance time based on playback speed
        const timeAdvance = deltaTime * playbackSpeed;

        setCurrentTime(prevTime => {
          const newTime = prevTime + timeAdvance;

          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }

          return newTime;
        });

        lastUpdateRef.current = now;
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
  }, [isPlaying, replayMode, sessionData, playbackSpeed]);

  // Replay control functions
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    const visibleSessionsWithPoints = Array.from(sessionData.values())
      .filter(d => d.visible && d.points.length > 0);

    if (visibleSessionsWithPoints.length > 0) {
      // Find longest session duration
      const maxDuration = Math.max(
        ...visibleSessionsWithPoints.map(d => {
          const start = new Date(d.points[0].ts).getTime();
          const end = new Date(d.points[d.points.length - 1].ts).getTime();
          return end - start;
        })
      );
      setCurrentTime(maxDuration);
    }
    setIsPlaying(false);
  };

  const cycleSpeed = () => {
    const speeds = [1, 2, 5, 10, 20];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  // Calculate distance between two GPS points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate total distance traveled up to a given point index
  const calculateDistanceTraveled = (points: TrackPoint[], upToIndex: number): number => {
    let totalDistance = 0;
    for (let i = 1; i <= upToIndex && i < points.length; i++) {
      totalDistance += calculateDistance(
        points[i - 1].lat, points[i - 1].lon,
        points[i].lat, points[i].lon
      );
    }
    return totalDistance;
  };

  // Get boat position at current replay time (using relative time from session start)
  const getBoatPositionAtTime = (points: TrackPoint[]): { point: TrackPoint; index: number; distance: number } | null => {
    if (points.length === 0) return null;

    // Calculate elapsed time since the start of this session
    const sessionStartTime = new Date(points[0].ts).getTime();
    const sessionEndTime = new Date(points[points.length - 1].ts).getTime();
    const sessionDuration = sessionEndTime - sessionStartTime;

    // If replay time exceeds this session's duration, return last point
    if (currentTime >= sessionDuration) {
      const lastIndex = points.length - 1;
      return {
        point: points[lastIndex],
        index: lastIndex,
        distance: calculateDistanceTraveled(points, lastIndex)
      };
    }

    // Find point closest to current replay time (relative to session start)
    const targetTime = sessionStartTime + currentTime;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < points.length; i++) {
      const pointTime = new Date(points[i].ts).getTime();
      const diff = Math.abs(pointTime - targetTime);

      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    return {
      point: points[closestIndex],
      index: closestIndex,
      distance: calculateDistanceTraveled(points, closestIndex)
    };
  };

  // Create boat icon
  const createBoatIcon = (color: string, label: string) => {
    return L.divIcon({
      className: 'custom-boat-icon',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 24px;">⛵</div>
          <div style="
            background-color: ${color};
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">${label}</div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Sessions</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <Link to="/" className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  // Calculate map bounds from all visible tracks
  const visibleSessions = Array.from(sessionData.values()).filter(d => d.visible);
  const allPoints = visibleSessions.flatMap(d => d.points);

  const center: [number, number] = allPoints.length > 0
    ? [
        allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length,
        allPoints.reduce((sum, p) => sum + p.lon, 0) / allPoints.length,
      ]
    : [51.505, -0.09]; // Default center

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {replayMode ? '🎬 Fleet Replay' : 'Fleet Comparison'}
            </h1>
            <p className="text-slate-400">
              {replayMode ? 'Watch multiple boats racing together' : 'Compare multiple sailing sessions'}
            </p>
          </div>
          <div className="flex gap-3">
            {visibleSessions.filter(d => d.points.length > 0).length >= 2 && (
              <button
                onClick={() => {
                  setReplayMode(!replayMode);
                  if (!replayMode) {
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                {replayMode ? '← Back to Map' : '▶️ Play Replay'}
              </button>
            )}
            <Link
              to="/"
              className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
            >
              ← Back to Sessions
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ocean-400">{sessions.length}</div>
            <div className="text-sm text-slate-400">Total Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{visibleSessions.length}</div>
            <div className="text-sm text-slate-400">Visible Tracks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{allPoints.length}</div>
            <div className="text-sm text-slate-400">Total Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Session Selection Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Course Selection */}
          {raceCourses.length > 0 && (
            <div className="glass-dark p-4 rounded-xl">
              <h3 className="font-bold mb-3 flex items-center justify-between">
                <span>Race Course</span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCourse}
                    onChange={(e) => setShowCourse(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Show</span>
                </label>
              </h3>
              <select
                value={selectedCourse?.id || ''}
                onChange={(e) => {
                  const course = raceCourses.find(c => c.id === Number(e.target.value));
                  setSelectedCourse(course || null);
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              >
                {raceCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Session List */}
          <div className="glass-dark p-4 rounded-xl">
            <h3 className="font-bold mb-3">Sessions</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sessions.map(session => {
                const data = sessionData.get(session.id);
                const isLoaded = !!data;
                const isVisible = data?.visible || false;

                return (
                  <label
                    key={session.id}
                    className="flex items-center p-2 rounded hover:bg-slate-700/50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleSession(session)}
                      className="mr-3"
                    />
                    {isLoaded && (
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: data.color }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">Session {session.id}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(session.start_ts).toLocaleDateString()} {new Date(session.start_ts).toLocaleTimeString()}
                      </div>
                    </div>
                    {isLoaded && (
                      <div className="text-xs text-slate-500 ml-2">
                        {data.points.length} pts
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Color Legend */}
          {visibleSessions.length > 0 && (
            <div className="glass-dark p-4 rounded-xl">
              <h3 className="font-bold mb-3">Legend</h3>
              <div className="space-y-2">
                {visibleSessions.map(({ session, color, points }) => (
                  <div key={session.id} className="flex items-center text-sm">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <span className="flex-1">Session {session.id}</span>
                    <span className="text-xs text-slate-500 ml-2">{points.length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="glass-dark p-4 rounded-xl">
            <div className="h-[600px] rounded-lg overflow-hidden">
              {allPoints.length > 0 ? (
                <MapContainer
                  center={center}
                  zoom={14}
                  maxZoom={19}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Auto-fit map to show all visible tracks */}
                  <MapViewController points={allPoints} />

                  {/* Race Course Marks */}
                  {showCourse && selectedCourse && (
                    <RaceMarksOverlay course={selectedCourse} />
                  )}

                  {/* Session Tracks - Static or Replay Mode */}
                  {visibleSessions.map(({ session, points, color }) => {
                    if (points.length === 0) return null;

                    const positions: [number, number][] = points.map(p => [p.lat, p.lon]);
                    const startPoint = points[0];
                    const endPoint = points[points.length - 1];

                    // Replay mode: show animated boat and trail
                    if (replayMode) {
                      const boatData = getBoatPositionAtTime(points);

                      if (!boatData) return null;

                      const currentBoatPosition = boatData.point;

                      // Calculate trail (points up to current position)
                      const currentPointTime = new Date(currentBoatPosition.ts).getTime();
                      const trailPoints = points.filter(p => new Date(p.ts).getTime() <= currentPointTime);
                      const trailPositions: [number, number][] = trailPoints.map(p => [p.lat, p.lon]);

                      return (
                        <div key={session.id}>
                          {/* Trail line (faded) */}
                          {trailPositions.length > 1 && (
                            <Polyline
                              positions={trailPositions}
                              pathOptions={{ color, weight: 2, opacity: 0.4, dashArray: '5, 5' }}
                            />
                          )}

                          {/* Animated boat marker */}
                          <Marker
                            position={[currentBoatPosition.lat, currentBoatPosition.lon]}
                            icon={createBoatIcon(color, `Session ${session.id}`)}
                          >
                            <Popup>
                              <div className="text-sm">
                                <div className="font-bold">Session {session.id}</div>
                                <div>Speed: {currentBoatPosition.sog.toFixed(1)} kts</div>
                                <div>Heading: {currentBoatPosition.cog.toFixed(0)}°</div>
                                <div>Time: {new Date(currentBoatPosition.ts).toLocaleTimeString()}</div>
                              </div>
                            </Popup>
                          </Marker>
                        </div>
                      );
                    }

                    // Static mode: show full track
                    return (
                      <div key={session.id}>
                        {/* Track line */}
                        <Polyline
                          positions={positions}
                          pathOptions={{ color, weight: 3, opacity: 0.7 }}
                        />

                        {/* Start marker */}
                        <Marker position={[startPoint.lat, startPoint.lon]}>
                          <Popup>
                            <div className="text-sm">
                              <div className="font-bold">Session {session.id}</div>
                              <div>Start: {new Date(startPoint.ts).toLocaleTimeString()}</div>
                            </div>
                          </Popup>
                        </Marker>

                        {/* End marker */}
                        {session.end_ts && (
                          <Marker position={[endPoint.lat, endPoint.lon]}>
                            <Popup>
                              <div className="text-sm">
                                <div className="font-bold">Session {session.id}</div>
                                <div>End: {new Date(endPoint.ts).toLocaleTimeString()}</div>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </div>
                    );
                  })}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p>Select sessions to compare</p>
                  </div>
                </div>
              )}
            </div>

            {/* Replay Controls */}
            {replayMode && allPoints.length > 0 && (() => {
              const visibleSessionsWithPoints = visibleSessions.filter(d => d.points.length > 0);
              if (visibleSessionsWithPoints.length === 0) return null;

              // Find longest session duration (all sessions start at virtual time 0)
              const totalDuration = Math.max(
                ...visibleSessionsWithPoints.map(d => {
                  const start = new Date(d.points[0].ts).getTime();
                  const end = new Date(d.points[d.points.length - 1].ts).getTime();
                  return end - start;
                })
              );
              const progress = (currentTime / totalDuration) * 100;

              // Format time as MM:SS
              const formatTime = (ms: number) => {
                const totalSeconds = Math.floor(ms / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
              };

              const currentTimeStr = formatTime(currentTime);
              const totalTimeStr = formatTime(totalDuration);

              return (
                <ReplayControls
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  currentTime={currentTimeStr}
                  totalTime={totalTimeStr}
                  progress={progress}
                  onTogglePlayPause={togglePlayPause}
                  onRestart={restart}
                  onSkipToEnd={skipToEnd}
                  onCycleSpeed={cycleSpeed}
                />
              );
            })()}

            {/* Metrics Panel - Show current boat data in replay mode */}
            {replayMode && (() => {
              const visibleSessionsWithPoints = visibleSessions.filter(d => d.points.length > 0);
              if (visibleSessionsWithPoints.length === 0) return null;

              const boatData = visibleSessionsWithPoints.map(({ session, points, color }) => {
                const posData = getBoatPositionAtTime(points);
                if (!posData) return null;
                return {
                  session,
                  color,
                  currentPosition: posData.point,
                  distance: posData.distance
                };
              }).filter(d => d !== null);

              if (boatData.length === 0) return null;

              // Sort by distance (leader first)
              const rankedBoats = [...boatData].sort((a, b) => b!.distance - a!.distance);
              const leaderDistance = rankedBoats[0]!.distance;

              return (
                <>
                  {/* Leaderboard */}
                  <div className="mt-4 glass-dark p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Live Standings</h3>
                    <div className="space-y-2">
                      {rankedBoats.map((boat, index) => {
                        const gap = boat!.distance - leaderDistance;
                        const gapText = index === 0 ? 'Leader' : `${Math.abs(gap).toFixed(0)}m behind`;
                        return (
                          <div key={boat!.session.id} className="flex items-center gap-3 p-2 rounded bg-slate-800/50">
                            <div className="text-lg font-bold text-slate-400 w-8">{index + 1}</div>
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: boat!.color }}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">Session {boat!.session.id}</div>
                              <div className="text-xs text-slate-500">{(boat!.distance / 1000).toFixed(2)} km</div>
                            </div>
                            <div className={`text-xs font-mono ${index === 0 ? 'text-green-400' : 'text-slate-400'}`}>
                              {gapText}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Boat Data */}
                  <div className="mt-4 glass-dark p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Current Boat Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {rankedBoats.map(boat => (
                        <div key={boat!.session.id} className="flex items-start gap-3 p-3 rounded bg-slate-800/50">
                          <div
                            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: boat!.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-1">Session {boat!.session.id}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                              <div>
                                <span className="text-slate-500">Speed:</span>{' '}
                                <span className="text-white font-mono">{boat!.currentPosition.sog.toFixed(1)}</span> kts
                              </div>
                              <div>
                                <span className="text-slate-500">Heading:</span>{' '}
                                <span className="text-white font-mono">{boat!.currentPosition.cog.toFixed(0)}</span>°
                              </div>
                              {boat!.currentPosition.aws && (
                                <>
                                  <div>
                                    <span className="text-slate-500">Wind:</span>{' '}
                                    <span className="text-white font-mono">{boat!.currentPosition.aws.toFixed(1)}</span> kts
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Angle:</span>{' '}
                                    <span className="text-white font-mono">{boat!.currentPosition.awa?.toFixed(0)}</span>°
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
