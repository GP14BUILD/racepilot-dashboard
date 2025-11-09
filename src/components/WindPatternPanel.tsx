import { useEffect, useState } from 'react';
import { getWindShifts, getWindPattern, detectWindShifts, analyzeWindPattern } from '../api';
import type { WindShift, WindPattern } from '../types';
import { format } from 'date-fns';

interface WindPatternPanelProps {
  sessionId: number;
  onShiftsLoaded?: (shifts: WindShift[]) => void;
}

export default function WindPatternPanel({ sessionId, onShiftsLoaded }: WindPatternPanelProps) {
  const [shifts, setShifts] = useState<WindShift[]>([]);
  const [pattern, setPattern] = useState<WindPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<WindShift | null>(null);

  useEffect(() => {
    loadWindData();
  }, [sessionId]);

  const loadWindData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load existing data
      const [shiftsData, patternData] = await Promise.allSettled([
        getWindShifts(sessionId),
        getWindPattern(sessionId)
      ]);

      if (shiftsData.status === 'fulfilled') {
        setShifts(shiftsData.value.shifts || []);
        if (onShiftsLoaded) {
          onShiftsLoaded(shiftsData.value.shifts || []);
        }
      }

      if (patternData.status === 'fulfilled') {
        setPattern(patternData.value);
      }
    } catch (err: any) {
      console.error('Failed to load wind data:', err);
      setError('Failed to load wind pattern data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      // First detect shifts
      await detectWindShifts(sessionId);

      // Then analyze pattern
      await analyzeWindPattern(sessionId);

      // Reload data
      await loadWindData();
    } catch (err: any) {
      console.error('Failed to analyze wind:', err);
      setError('Failed to analyze wind patterns');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">💨 Wind Pattern Analysis</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const getPatternColor = (patternType: string) => {
    switch (patternType) {
      case 'stable':
        return 'text-green-400 bg-green-900/30 border-green-700/50';
      case 'oscillating':
        return 'text-blue-400 bg-blue-900/30 border-blue-700/50';
      case 'persistent_right':
      case 'persistent_left':
        return 'text-purple-400 bg-purple-900/30 border-purple-700/50';
      case 'unstable':
        return 'text-red-400 bg-red-900/30 border-red-700/50';
      default:
        return 'text-slate-400 bg-slate-800/30 border-slate-700/50';
    }
  };

  const getPatternIcon = (patternType: string) => {
    switch (patternType) {
      case 'stable':
        return '✅';
      case 'oscillating':
        return '🔄';
      case 'persistent_right':
        return '➡️';
      case 'persistent_left':
        return '⬅️';
      case 'unstable':
        return '⚠️';
      default:
        return '💨';
    }
  };

  const getPatternDescription = (patternType: string) => {
    switch (patternType) {
      case 'stable':
        return 'Wind direction is very consistent';
      case 'oscillating':
        return 'Wind is shifting back and forth in a pattern';
      case 'persistent_right':
        return 'Wind is steadily shifting to the right (clockwise)';
      case 'persistent_left':
        return 'Wind is steadily shifting to the left (counter-clockwise)';
      case 'unstable':
        return 'Wind direction is unpredictable';
      default:
        return 'Pattern analysis pending';
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'persistent':
        return 'text-purple-400';
      case 'oscillating':
        return 'text-blue-400';
      case 'transient':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="glass-dark p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">💨 Wind Pattern Analysis</h2>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Wind'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {pattern ? (
        <>
          {/* Pattern Summary */}
          <div className={`p-6 rounded-lg border mb-6 ${getPatternColor(pattern.dominant_pattern || '')}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{getPatternIcon(pattern.dominant_pattern || '')}</span>
                <div>
                  <h3 className="text-2xl font-bold capitalize">
                    {pattern.dominant_pattern?.replace('_', ' ') || 'Unknown'}
                  </h3>
                  <p className="text-sm opacity-80">
                    {getPatternDescription(pattern.dominant_pattern || '')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{Math.round(pattern.wind_stability_score)}</p>
                <p className="text-sm opacity-80">Stability Score</p>
              </div>
            </div>

            {/* Pattern Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-current/20">
              <div>
                <p className="text-sm opacity-80 mb-1">Pattern Strength</p>
                <p className="text-xl font-bold">{Math.round((pattern.pattern_strength || 0) * 100)}%</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Total Shifts</p>
                <p className="text-xl font-bold">{pattern.total_shifts_detected || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Avg Magnitude</p>
                <p className="text-xl font-bold">{(pattern.avg_shift_magnitude || 0).toFixed(1)}°</p>
              </div>
              {pattern.is_oscillating && pattern.avg_oscillation_period && (
                <div>
                  <p className="text-sm opacity-80 mb-1">Oscillation Period</p>
                  <p className="text-xl font-bold">{pattern.avg_oscillation_period.toFixed(1)} min</p>
                </div>
              )}
            </div>

            {/* Prediction */}
            {pattern.next_shift_prediction && pattern.prediction_confidence && (
              <div className="mt-4 pt-4 border-t border-current/20">
                <p className="text-sm opacity-80 mb-2">Predicted Next Shift:</p>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {pattern.next_shift_prediction === 'left' ? '⬅️' :
                     pattern.next_shift_prediction === 'right' ? '➡️' : '➖'}
                  </span>
                  <div>
                    <p className="font-bold capitalize">{pattern.next_shift_prediction}</p>
                    <p className="text-sm opacity-80">
                      {Math.round(pattern.prediction_confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detected Shifts */}
          {shifts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Detected Wind Shifts ({shifts.length})</h3>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className={`p-4 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer transition hover:bg-slate-800 ${
                      selectedShift?.id === shift.id ? 'ring-2 ring-ocean-500' : ''
                    }`}
                    onClick={() => setSelectedShift(selectedShift?.id === shift.id ? null : shift)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {shift.direction === 'right' ? '↻' : '↺'}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {shift.magnitude.toFixed(1)}° {shift.direction === 'right' ? 'Right' : 'Left'} Shift
                          </p>
                          <p className="text-sm text-slate-400 font-mono">
                            {format(new Date(shift.start_ts), 'HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold capitalize ${getShiftTypeColor(shift.type)}`}>
                          {shift.type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {Math.round(shift.confidence * 100)}% confident
                        </p>
                      </div>
                    </div>

                    {selectedShift?.id === shift.id && (
                      <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Wind Direction Before</p>
                          <p className="font-mono font-bold">{shift.twd_before.toFixed(0)}°</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Wind Direction After</p>
                          <p className="font-mono font-bold">{shift.twd_after.toFixed(0)}°</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Wind Speed Before</p>
                          <p className="font-mono font-bold">{shift.avg_tws_before.toFixed(1)} kts</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Wind Speed After</p>
                          <p className="font-mono font-bold">{shift.avg_tws_after.toFixed(1)} kts</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg text-center">
          <p className="text-slate-400 mb-4">No wind pattern analysis available yet.</p>
          <p className="text-sm text-slate-500">
            Click "Analyze Wind" to detect shifts and classify wind patterns.
          </p>
        </div>
      )}
    </div>
  );
}
