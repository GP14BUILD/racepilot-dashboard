import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSession, getSessionPoints, getRaceCourses } from '../api';
import { calculateStats } from '../utils';
import type { Session, TrackPoint, RaceCourse } from '../types';
import RaceMarksOverlay from '../components/RaceMarksOverlay';
import WindVisualization from '../components/WindVisualization';
import LaylinesOverlay from '../components/LaylinesOverlay';
import L from 'leaflet';
import { format } from 'date-fns';

// Fix Leaflet default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raceCourses, setRaceCourses] = useState<RaceCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<RaceCourse | null>(null);

  // Layer visibility toggles
  const [showRaceMarks, setShowRaceMarks] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showLaylines, setShowLaylines] = useState(false);

  useEffect(() => {
    loadSession();
    loadRaceCourses();
  }, [id]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const sessionData = await getSession(Number(id));
      const pointsData = await getSessionPoints(Number(id));
      setSession(sessionData);
      setPoints(pointsData);
    } catch (err) {
      setError('Failed to load session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRaceCourses = async () => {
    try {
      const courses = await getRaceCourses();
      setRaceCourses(courses);
      // Auto-select first course if available
      if (courses.length > 0) {
        setSelectedCourse(courses[0]);
      }
    } catch (err) {
      console.error('Failed to load race courses:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Session Not Found</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <Link to="/" className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition inline-block">
          Back to Sessions
        </Link>
      </div>
    );
  }

  const stats = points.length > 0 ? calculateStats(points, session.start_ts, session.end_ts) : null;

  // Prepare map data
  const trackCoordinates: [number, number][] = points.map(p => [p.lat, p.lon]);
  const center: [number, number] = points.length > 0
    ? [points[0].lat, points[0].lon]
    : [0, 0];

  // Prepare chart data
  const speedData = points.map((p, idx) => ({
    index: idx,
    speed: Math.round(p.sog * 10) / 10,
    time: format(new Date(p.ts), 'HH:mm:ss'),
  }));

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition"
      >
        <span>←</span>
        <span>Back to Sessions</span>
      </Link>

      {/* Header */}
      <div className="glass-dark p-6 rounded-xl mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
            <p className="text-slate-400">Session #{session.id}</p>
          </div>
          <div className="text-5xl">⛵</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">Started</p>
            <p className="font-mono">{format(new Date(session.start_ts), 'MMM d, HH:mm')}</p>
          </div>
          {session.end_ts && (
            <div>
              <p className="text-slate-400 text-sm mb-1">Ended</p>
              <p className="font-mono">{format(new Date(session.end_ts), 'MMM d, HH:mm')}</p>
            </div>
          )}
          {stats && (
            <>
              <div>
                <p className="text-slate-400 text-sm mb-1">Duration</p>
                <p className="font-mono text-ocean-400">{stats.duration}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Data Points</p>
                <p className="font-mono text-ocean-400">{stats.pointCount}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {points.length === 0 ? (
        <div className="glass-dark p-12 rounded-xl text-center">
          <p className="text-slate-400">No GPS data recorded for this session</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-dark p-6 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">Distance</p>
                <p className="text-3xl font-bold text-ocean-400">{stats.distance} km</p>
                <p className="text-sm text-slate-500 mt-1">{(stats.distance * 0.539957).toFixed(2)} nm</p>
              </div>
              <div className="glass-dark p-6 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">Average Speed</p>
                <p className="text-3xl font-bold text-ocean-400">{stats.avgSpeed} kts</p>
              </div>
              <div className="glass-dark p-6 rounded-xl">
                <p className="text-slate-400 text-sm mb-2">Max Speed</p>
                <p className="text-3xl font-bold text-ocean-400">{stats.maxSpeed} kts</p>
              </div>
            </div>
          )}

          {/* Tactical Controls */}
          <div className="glass-dark p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-3">📊 Tactical Overlays</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowRaceMarks(!showRaceMarks)}
                className={`px-4 py-2 rounded-lg transition ${
                  showRaceMarks
                    ? 'bg-ocean-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showRaceMarks ? '✓' : ''} Race Marks
              </button>
              <button
                onClick={() => setShowWind(!showWind)}
                className={`px-4 py-2 rounded-lg transition ${
                  showWind
                    ? 'bg-ocean-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showWind ? '✓' : ''} Wind Visualization
              </button>
              <button
                onClick={() => setShowLaylines(!showLaylines)}
                className={`px-4 py-2 rounded-lg transition ${
                  showLaylines
                    ? 'bg-ocean-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showLaylines ? '✓' : ''} Laylines
              </button>
              {raceCourses.length > 1 && (
                <select
                  value={selectedCourse?.id || ''}
                  onChange={(e) => {
                    const course = raceCourses.find(c => c.id === Number(e.target.value));
                    setSelectedCourse(course || null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white"
                >
                  <option value="">Select Course</option>
                  {raceCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="glass-dark p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4">GPS Track</h2>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Polyline positions={trackCoordinates} color="#0ea5e9" weight={3} />

                {/* Start and End Markers */}
                {points.length > 0 && (
                  <>
                    <Marker position={[points[0].lat, points[0].lon]}>
                      <Popup>Start</Popup>
                    </Marker>
                    <Marker position={[points[points.length - 1].lat, points[points.length - 1].lon]}>
                      <Popup>End</Popup>
                    </Marker>
                  </>
                )}

                {/* Race Marks Overlay */}
                {showRaceMarks && selectedCourse && (
                  <RaceMarksOverlay marks={selectedCourse.marks} />
                )}

                {/* Wind Visualization */}
                {showWind && points.length > 0 && points.some(p => p.tws && p.twa) && (
                  <WindVisualization
                    centerLat={center[0]}
                    centerLon={center[1]}
                    windSpeed={points.find(p => p.tws)?.tws || 10}
                    windDirection={
                      points.find(p => p.twa && p.cog)
                        ? (points.find(p => p.twa && p.cog)!.cog + points.find(p => p.twa && p.cog)!.twa!) % 360
                        : 0
                    }
                  />
                )}

                {/* Laylines Overlay */}
                {showLaylines && selectedCourse && selectedCourse.marks.length > 0 && points.length > 0 && (
                  <LaylinesOverlay
                    currentLat={points[points.length - 1].lat}
                    currentLon={points[points.length - 1].lon}
                    markLat={selectedCourse.marks.find(m => m.mark_type === 'windward')?.lat || selectedCourse.marks[0].lat}
                    markLon={selectedCourse.marks.find(m => m.mark_type === 'windward')?.lon || selectedCourse.marks[0].lon}
                    windDirection={
                      points.find(p => p.twa && p.cog)
                        ? (points.find(p => p.twa && p.cog)!.cog + points.find(p => p.twa && p.cog)!.twa!) % 360
                        : 0
                    }
                    tackingAngle={42}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          {/* Speed Chart */}
          <div className="glass-dark p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Speed Over Time</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedData}>
                  <XAxis
                    dataKey="index"
                    stroke="#94a3b8"
                    tickFormatter={(value) => speedData[value]?.time || ''}
                  />
                  <YAxis stroke="#94a3b8" label={{ value: 'Speed (knots)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="speed" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
