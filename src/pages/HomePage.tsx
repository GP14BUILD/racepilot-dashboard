import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSessions } from '../api';
import type { Session } from '../types';
import { format } from 'date-fns';

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load sessions. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
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
        <button
          onClick={loadSessions}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="glass-dark p-12 rounded-xl text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">⛵</div>
        <h2 className="text-2xl font-bold mb-2">No Sessions Yet</h2>
        <p className="text-slate-400 mb-6">
          Start recording sessions with the RacePilot mobile app!
        </p>
        <div className="glass p-4 rounded-lg text-left text-sm text-slate-300">
          <p className="font-semibold mb-2">Quick Start:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open RacePilot mobile app</li>
            <li>Tap "START SESSION"</li>
            <li>Go sailing!</li>
            <li>View your sessions here</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-ocean-400 to-ocean-600 bg-clip-text text-transparent">
            Your Sessions
          </span>
        </h1>
        <p className="text-slate-400">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} recorded
        </p>
      </div>

      {/* Fleet Comparison Call-to-Action */}
      {sessions.length > 1 && (
        <Link
          to="/fleet-comparison"
          className="block glass-dark p-6 rounded-xl hover:bg-white/15 transition mb-8 border-2 border-ocean-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-ocean-500 rounded-lg flex items-center justify-center text-3xl">
                🗺️
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Fleet Comparison</h2>
                <p className="text-slate-400">
                  Compare multiple sessions side-by-side on a single map
                </p>
              </div>
            </div>
            <div className="text-4xl text-ocean-400">→</div>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/session/${session.id}`}
              className="block glass-dark p-6 rounded-xl hover:bg-white/15 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center text-2xl">
                    ⛵
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-ocean-400 transition">
                      {session.title}
                    </h3>
                    <p className="text-sm text-slate-400">Session #{session.id}</p>
                  </div>
                </div>
                <div className="text-ocean-400">→</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Started:</span>
                  <span className="font-mono">
                    {format(new Date(session.start_ts), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                {session.end_ts && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ended:</span>
                    <span className="font-mono">
                      {format(new Date(session.end_ts), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs text-slate-500">Click to view details →</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
