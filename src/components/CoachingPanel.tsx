import { useEffect, useState } from 'react';
import { getSessionCoaching, analyzeAndRecommend, dismissRecommendation } from '../api';
import type { CoachingRecommendation } from '../types';
import { format } from 'date-fns';

interface CoachingPanelProps {
  sessionId: number;
  onRecommendationsLoaded?: (recommendations: CoachingRecommendation[]) => void;
}

export default function CoachingPanel({ sessionId, onRecommendationsLoaded }: CoachingPanelProps) {
  const [recommendations, setRecommendations] = useState<CoachingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRec, setSelectedRec] = useState<CoachingRecommendation | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [sessionId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessionCoaching(sessionId);
      setRecommendations(data.recommendations || []);
      if (onRecommendationsLoaded) {
        onRecommendationsLoaded(data.recommendations || []);
      }
    } catch (err: any) {
      console.error('Failed to load coaching:', err);
      if (err?.response?.status === 404) {
        setRecommendations([]);
      } else {
        setError('Failed to load coaching recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      await analyzeAndRecommend(sessionId);
      // Reload recommendations after analysis
      await loadRecommendations();
    } catch (err: any) {
      console.error('Failed to analyze:', err);
      setError('Failed to analyze session');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDismiss = async (recId: number) => {
    try {
      await dismissRecommendation(recId);
      // Update local state
      setRecommendations(recommendations.map(r =>
        r.id === recId ? { ...r, dismissed: true } : r
      ));
    } catch (err: any) {
      console.error('Failed to dismiss:', err);
    }
  };

  if (loading) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">💡 AI Coaching</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">💡 AI Coaching</h2>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-400 bg-red-900/30 border-red-700/50';
      case 'high':
        return 'text-orange-400 bg-orange-900/30 border-orange-700/50';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50';
      case 'low':
        return 'text-blue-400 bg-blue-900/30 border-blue-700/50';
      default:
        return 'text-slate-400 bg-slate-800/30 border-slate-700/50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sail_higher':
        return '⬆️';
      case 'sail_lower':
        return '⬇️';
      case 'tack_now':
        return '🔄';
      case 'wind_shift_detected':
        return '💨';
      case 'speed_mode':
        return '⚡';
      case 'maneuver_review':
        return '📊';
      case 'vmg_mode':
        return '🎯';
      default:
        return '💡';
    }
  };

  // Filter out dismissed recommendations
  const activeRecommendations = recommendations.filter(r => !r.dismissed);

  const criticalCount = activeRecommendations.filter(r => r.priority === 'critical').length;
  const highCount = activeRecommendations.filter(r => r.priority === 'high').length;
  const mediumCount = activeRecommendations.filter(r => r.priority === 'medium').length;
  const lowCount = activeRecommendations.filter(r => r.priority === 'low').length;

  return (
    <div className="glass-dark p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">💡 AI Coaching</h2>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Now'}
        </button>
      </div>

      {activeRecommendations.length === 0 ? (
        <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">✓ No active recommendations</p>
          <p className="text-sm text-slate-400 mt-1">
            Click "Analyze Now" to get AI-powered coaching insights based on your current performance.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Total Active</p>
              <p className="text-2xl font-bold text-ocean-400">{activeRecommendations.length}</p>
            </div>
            {criticalCount > 0 && (
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/30">
                <p className="text-slate-400 text-sm mb-1">Critical</p>
                <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
              </div>
            )}
            {highCount > 0 && (
              <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700/30">
                <p className="text-slate-400 text-sm mb-1">High</p>
                <p className="text-2xl font-bold text-orange-400">{highCount}</p>
              </div>
            )}
            {mediumCount > 0 && (
              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
                <p className="text-slate-400 text-sm mb-1">Medium</p>
                <p className="text-2xl font-bold text-yellow-400">{mediumCount}</p>
              </div>
            )}
            {lowCount > 0 && (
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                <p className="text-slate-400 text-sm mb-1">Low</p>
                <p className="text-2xl font-bold text-blue-400">{lowCount}</p>
              </div>
            )}
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {activeRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedRec?.id === rec.id
                      ? 'ring-2 ring-ocean-500'
                      : 'hover:bg-slate-800/50'
                  } ${getPriorityColor(rec.priority)}`}
                  onClick={() => setSelectedRec(selectedRec?.id === rec.id ? null : rec)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{rec.text}</p>
                        <p className="text-sm text-slate-400 font-mono mt-1">
                          {format(new Date(rec.ts), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <span className="text-2xl">{getPriorityIcon(rec.priority)}</span>
                        <p className="text-xs text-slate-500 mt-1">
                          {rec.confidence}% confident
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(rec.id);
                        }}
                        className="ml-2 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {selectedRec?.id === rec.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-sm font-semibold mb-2">Analysis:</p>
                      <p className="text-sm text-slate-300 mb-3">{rec.reasoning}</p>

                      {rec.context && Object.keys(rec.context).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="text-xs text-slate-500 mb-2">Technical Details:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(rec.context).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <span className="text-slate-500">{key.replace(/_/g, ' ')}:</span>{' '}
                                <span className="text-slate-300 font-mono">
                                  {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
