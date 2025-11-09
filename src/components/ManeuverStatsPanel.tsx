import { useEffect, useState } from 'react';
import { getSessionManeuvers, getManeuverStats } from '../api';
import type { Maneuver, ManeuverStats } from '../types';
import { format } from 'date-fns';

interface ManeuverStatsPanelProps {
  sessionId: number;
  onManeuversLoaded?: (maneuvers: Maneuver[]) => void;
}

export default function ManeuverStatsPanel({ sessionId, onManeuversLoaded }: ManeuverStatsPanelProps) {
  const [maneuvers, setManeuvers] = useState<Maneuver[]>([]);
  const [stats, setStats] = useState<ManeuverStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailed, setShowDetailed] = useState(false);

  useEffect(() => {
    loadManeuvers();
  }, [sessionId]);

  const loadManeuvers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [maneuversData, statsData] = await Promise.all([
        getSessionManeuvers(sessionId),
        getManeuverStats(sessionId),
      ]);
      setManeuvers(maneuversData);
      setStats(statsData);
      if (onManeuversLoaded) {
        onManeuversLoaded(maneuversData);
      }
    } catch (err: any) {
      console.error('Failed to load maneuvers:', err);
      if (err?.response?.status === 404) {
        // No maneuvers detected yet
        setManeuvers([]);
        setStats(null);
      } else {
        setError('Failed to load maneuver data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">🔄 Tack Analysis</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">🔄 Tack Analysis</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats || stats.total_maneuvers === 0) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">🔄 Tack Analysis</h2>
        <p className="text-slate-400">No maneuvers detected yet. Tacks will be automatically detected during sailing.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="glass-dark p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🔄 Tack Analysis</h2>
        <button
          onClick={() => setShowDetailed(!showDetailed)}
          className="text-sm text-ocean-400 hover:text-ocean-300 transition"
        >
          {showDetailed ? 'Hide Details' : 'Show All Tacks'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Total Maneuvers</p>
          <p className="text-2xl font-bold text-ocean-400">{stats.total_maneuvers}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Tacks</p>
          <p className="text-2xl font-bold text-blue-400">{stats.tacks}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Gybes</p>
          <p className="text-2xl font-bold text-purple-400">{stats.gybes}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Avg Tack Score</p>
          <p className={`text-2xl font-bold ${getScoreColor(stats.avg_tack_score || 0)}`}>
            {stats.avg_tack_score?.toFixed(0) || 'N/A'}
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Avg Tack Time</p>
          <p className="text-lg font-mono text-white">
            {stats.avg_tack_time ? `${stats.avg_tack_time.toFixed(1)}s` : 'N/A'}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Avg Speed Loss</p>
          <p className="text-lg font-mono text-white">
            {stats.avg_speed_loss ? `${stats.avg_speed_loss.toFixed(2)} kts` : 'N/A'}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Best Tack Score</p>
          <p className={`text-lg font-mono ${getScoreColor(stats.best_tack?.score || 0)}`}>
            {stats.best_tack?.score || 'N/A'}
          </p>
        </div>
      </div>

      {/* Detailed List */}
      {showDetailed && maneuvers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-3">All Maneuvers</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {maneuvers.map((maneuver, idx) => (
              <div key={maneuver.id} className="bg-slate-800/30 p-3 rounded-lg hover:bg-slate-800/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500 font-mono text-sm">#{idx + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      maneuver.maneuver_type === 'tack'
                        ? 'bg-blue-900/50 text-blue-300'
                        : maneuver.maneuver_type === 'gybe'
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {maneuver.maneuver_type.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm font-mono">
                      {format(new Date(maneuver.start_ts), 'HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Score</p>
                      <p className={`font-bold ${getScoreColor(maneuver.score_0_100)}`}>
                        {maneuver.score_0_100}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="font-mono text-sm">{maneuver.time_through_sec.toFixed(1)}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Speed Loss</p>
                      <p className="font-mono text-sm">{maneuver.speed_loss_kn.toFixed(2)} kts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Angle</p>
                      <p className="font-mono text-sm">{maneuver.angle_change_deg.toFixed(0)}°</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
