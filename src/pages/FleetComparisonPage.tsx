import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { getSessions, getSessionPoints, getRaceCourses } from '../api';
import type { Session, TrackPoint, RaceCourse } from '../types';
import RaceMarksOverlay from '../components/RaceMarksOverlay';
import L from 'leaflet';

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
            <h1 className="text-3xl font-bold mb-2">Fleet Comparison</h1>
            <p className="text-slate-400">Compare multiple sailing sessions</p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
          >
            ← Back to Sessions
          </Link>
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
                      <div className="text-sm font-medium truncate">{session.title}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(session.start_ts).toLocaleDateString()}
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
                    <span className="flex-1 truncate">{session.title}</span>
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
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Race Course Marks */}
                  {showCourse && selectedCourse && (
                    <RaceMarksOverlay course={selectedCourse} />
                  )}

                  {/* Session Tracks */}
                  {visibleSessions.map(({ session, points, color }) => {
                    if (points.length === 0) return null;

                    const positions: [number, number][] = points.map(p => [p.lat, p.lon]);
                    const startPoint = points[0];
                    const endPoint = points[points.length - 1];

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
                              <div className="font-bold">{session.title}</div>
                              <div>Start: {new Date(startPoint.ts).toLocaleTimeString()}</div>
                            </div>
                          </Popup>
                        </Marker>

                        {/* End marker */}
                        {session.end_ts && (
                          <Marker position={[endPoint.lat, endPoint.lon]}>
                            <Popup>
                              <div className="text-sm">
                                <div className="font-bold">{session.title}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
