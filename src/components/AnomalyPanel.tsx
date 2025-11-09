import { useEffect, useState } from 'react';
import { getSessionAnomalies } from '../api';
import type { PerformanceAnomaly } from '../types';
import { format } from 'date-fns';

interface AnomalyPanelProps {
  sessionId: number;
  onAnomaliesLoaded?: (anomalies: PerformanceAnomaly[]) => void;
}

export default function AnomalyPanel({ sessionId, onAnomaliesLoaded }: AnomalyPanelProps) {
  const [anomalies, setAnomalies] = useState<PerformanceAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<PerformanceAnomaly | null>(null);

  useEffect(() => {
    loadAnomalies();
  }, [sessionId]);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessionAnomalies(sessionId);
      setAnomalies(data.anomalies || []);
      if (onAnomaliesLoaded) {
        onAnomaliesLoaded(data.anomalies || []);
      }
    } catch (err: any) {
      console.error('Failed to load anomalies:', err);
      if (err?.response?.status === 404) {
        setAnomalies([]);
      } else {
        setError('Failed to load performance anomalies');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">⚠️ Performance Anomalies</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">⚠️ Performance Anomalies</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'text-red-400 bg-red-900/30';
      case 'moderate':
        return 'text-orange-400 bg-orange-900/30';
      case 'minor':
        return 'text-yellow-400 bg-yellow-900/30';
      default:
        return 'text-slate-400 bg-slate-800/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
        return '🔴';
      case 'moderate':
        return '🟠';
      case 'minor':
        return '🟡';
      default:
        return '⚪';
    }
  };

  if (anomalies.length === 0) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">⚠️ Performance Anomalies</h2>
        <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">✓ No anomalies detected</p>
          <p className="text-sm text-slate-400 mt-1">Your performance is consistent with your baseline in all conditions.</p>
        </div>
      </div>
    );
  }

  const severeCounts = anomalies.filter(a => a.severity === 'severe').length;
  const moderateCounts = anomalies.filter(a => a.severity === 'moderate').length;
  const minorCounts = anomalies.filter(a => a.severity === 'minor').length;

  return (
    <div className="glass-dark p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">⚠️ Performance Anomalies</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">Total Anomalies</p>
          <p className="text-2xl font-bold text-ocean-400">{anomalies.length}</p>
        </div>
        <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/30">
          <p className="text-slate-400 text-sm mb-1">Severe</p>
          <p className="text-2xl font-bold text-red-400">{severeCounts}</p>
        </div>
        <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700/30">
          <p className="text-slate-400 text-sm mb-1">Moderate</p>
          <p className="text-2xl font-bold text-orange-400">{moderateCounts}</p>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
          <p className="text-slate-400 text-sm mb-1">Minor</p>
          <p className="text-2xl font-bold text-yellow-400">{minorCounts}</p>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Detected Issues</h3>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {anomalies.map((anomaly, idx) => (
            <div
              key={anomaly.id}
              className={`p-4 rounded-lg cursor-pointer transition ${
                selectedAnomaly?.id === anomaly.id
                  ? 'ring-2 ring-ocean-500'
                  : 'hover:bg-slate-800/50'
              } ${getSeverityColor(anomaly.severity)}`}
              onClick={() => setSelectedAnomaly(selectedAnomaly?.id === anomaly.id ? null : anomaly)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getSeverityIcon(anomaly.severity)}</span>
                  <div>
                    <p className="font-semibold text-white">
                      {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)} Performance Issue
                    </p>
                    <p className="text-sm text-slate-400 font-mono">
                      {format(new Date(anomaly.ts), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Speed</p>
                  <p className="font-mono font-bold">
                    {anomaly.actual_sog.toFixed(2)} kts
                    <span className="text-sm text-red-400 ml-1">
                      ({anomaly.deviation_kts.toFixed(2)})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Expected: {anomaly.expected_sog.toFixed(2)} kts
                  </p>
                </div>
              </div>

              {selectedAnomaly?.id === anomaly.id && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-sm font-semibold mb-2">Possible Causes:</p>
                  <ul className="space-y-1">
                    {anomaly.possible_causes.map((cause, i) => (
                      <li key={i} className="text-sm flex items-start space-x-2">
                        <span className="text-ocean-400 mt-0.5">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                  {anomaly.wind_speed && anomaly.wind_angle && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500">
                        Wind: {anomaly.wind_speed.toFixed(1)} kts @ {Math.abs(anomaly.wind_angle).toFixed(0)}°
                      </p>
                      <p className="text-xs text-slate-500">
                        Statistical Significance: {Math.abs(anomaly.z_score).toFixed(2)}σ
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
