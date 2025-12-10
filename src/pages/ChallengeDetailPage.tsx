import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Challenge {
  id: number;
  creator_id: number;
  creator_name: string;
  session_id: number;
  title: string;
  description?: string;
  difficulty: string;
  is_public: boolean;
  expires_at?: string;
  boat_class?: string;
  created_at: string;
  attempt_count: number;
  best_time?: number;
  can_attempt: boolean;
}

interface Attempt {
  id: number;
  challenge_id: number;
  user_id: number;
  user_name: string;
  session_id: number;
  time_difference: number;
  result: string;
  submitted_at: string;
  xp_earned: number;
}

interface Session {
  id: number;
  title: string;
  start_ts: string;
  end_ts?: string;
}

const API_URL = 'https://racepilot-backend-production.up.railway.app';

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadChallenge(parseInt(id));
      loadLeaderboard(parseInt(id));
      loadMySessions();
    }
  }, [id]);

  const loadChallenge = async (challengeId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/challenges/${challengeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load challenge');

      const data = await response.json();
      setChallenge(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (challengeId: number) => {
    try {
      const response = await fetch(`${API_URL}/challenges/${challengeId}/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load leaderboard');

      const data = await response.json();
      setAttempts(data);
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  const loadMySessions = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load sessions');

      const data = await response.json();
      setSessions(data.filter((s: Session) => s.end_ts)); // Only completed sessions
    } catch (err: any) {
      console.error('Failed to load sessions:', err);
    }
  };

  const submitAttempt = async () => {
    if (!selectedSessionId || !id) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const response = await fetch(`${API_URL}/challenges/${id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: selectedSessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit attempt');
      }

      const result = await response.json();
      setSubmitSuccess(true);
      setSelectedSessionId(null);

      // Reload leaderboard and challenge
      await loadLeaderboard(parseInt(id));
      await loadChallenge(parseInt(id));

      // Show success message
      alert(`Attempt submitted! Result: ${result.result.toUpperCase()}\nTime difference: ${result.time_difference.toFixed(1)}s\nXP earned: ${result.xp_earned}`);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'hard':
        return { bg: '#FFEBEE', color: '#C62828' };
      default:
        return { bg: '#FFF3E0', color: '#F57C00' };
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '⭐⭐';
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'won':
        return { emoji: '🏆', text: 'Won', color: '#4CAF50' };
      case 'lost':
        return { emoji: '😞', text: 'Lost', color: '#F44336' };
      default:
        return { emoji: '🤝', text: 'Tie', color: '#FF9800' };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading challenge...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error || 'Challenge not found'}</div>
        <Link to="/challenges" style={styles.backButton}>← Back to Challenges</Link>
      </div>
    );
  }

  const difficultyColors = getDifficultyColor(challenge.difficulty);
  const difficultyIcon = getDifficultyIcon(challenge.difficulty);
  const isExpired = challenge.expires_at && new Date(challenge.expires_at) < new Date();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/challenges" style={styles.backButton}>← Back to Challenges</Link>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>{challenge.title}</h1>
          <div style={styles.metaInfo}>
            <span
              style={{
                ...styles.difficultyBadge,
                backgroundColor: difficultyColors.bg,
                color: difficultyColors.color,
              }}
            >
              {difficultyIcon} {challenge.difficulty}
            </span>
            <span style={styles.creator}>by {challenge.creator_name}</span>
            {challenge.is_public && <span style={styles.badge}>🌍 Public</span>}
            {isExpired && <span style={{...styles.badge, backgroundColor: '#FFEBEE', color: '#C62828'}}>⏰ Expired</span>}
          </div>
        </div>
      </div>

      {/* Description */}
      {challenge.description && (
        <div style={styles.descriptionCard}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.description}>{challenge.description}</p>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Attempts</div>
          <div style={styles.statValue}>{challenge.attempt_count}</div>
        </div>
        {challenge.best_time !== null && (
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Best Time</div>
            <div style={styles.statValue}>
              {challenge.best_time > 0 ? '+' : ''}{challenge.best_time?.toFixed(1)}s
            </div>
          </div>
        )}
        {challenge.boat_class && (
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Boat Class</div>
            <div style={styles.statValue}>{challenge.boat_class}</div>
          </div>
        )}
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Created</div>
          <div style={styles.statValue}>{new Date(challenge.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Ghost Replay Button */}
      <div style={styles.actionSection}>
        <Link
          to={`/replay/${challenge.session_id}?ghost=${challenge.session_id}`}
          style={styles.ghostButton}
        >
          👻 View Ghost Replay
        </Link>
      </div>

      {/* Submit Attempt Section */}
      {challenge.can_attempt && !isExpired && (
        <div style={styles.submitSection}>
          <h3 style={styles.sectionTitle}>Submit Your Attempt</h3>
          <p style={styles.instructions}>
            Select a completed session to race against this ghost boat. Make sure to record a session first!
          </p>

          {sessions.length === 0 ? (
            <div style={styles.noSessions}>
              <p>You don't have any completed sessions yet.</p>
              <p>Record a session first, then come back to submit your attempt!</p>
            </div>
          ) : (
            <>
              <select
                value={selectedSessionId || ''}
                onChange={(e) => setSelectedSessionId(parseInt(e.target.value))}
                style={styles.sessionSelect}
              >
                <option value="">Select a session...</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} - {new Date(session.start_ts).toLocaleDateString()}
                  </option>
                ))}
              </select>

              <button
                onClick={submitAttempt}
                disabled={!selectedSessionId || submitting}
                style={{
                  ...styles.submitButton,
                  opacity: !selectedSessionId || submitting ? 0.5 : 1,
                  cursor: !selectedSessionId || submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Submitting...' : '🏁 Submit Attempt'}
              </button>

              {submitError && (
                <div style={styles.submitError}>{submitError}</div>
              )}
              {submitSuccess && (
                <div style={styles.submitSuccess}>Attempt submitted successfully!</div>
              )}
            </>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div style={styles.leaderboardSection}>
        <h3 style={styles.sectionTitle}>Leaderboard</h3>
        {attempts.length === 0 ? (
          <div style={styles.emptyLeaderboard}>
            No attempts yet. Be the first to race this challenge!
          </div>
        ) : (
          <div style={styles.leaderboard}>
            {attempts.map((attempt, index) => {
              const resultBadge = getResultBadge(attempt.result);
              return (
                <div key={attempt.id} style={styles.leaderboardRow}>
                  <div style={styles.rank}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div style={styles.playerInfo}>
                    <div style={styles.playerName}>{attempt.user_name}</div>
                    <div style={styles.attemptDate}>
                      {new Date(attempt.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={styles.resultBadge}>
                    <span style={{ color: resultBadge.color }}>
                      {resultBadge.emoji} {resultBadge.text}
                    </span>
                  </div>
                  <div style={styles.timeDiff}>
                    <span style={{
                      color: attempt.time_difference < 0 ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold',
                    }}>
                      {attempt.time_difference > 0 ? '+' : ''}{attempt.time_difference.toFixed(1)}s
                    </span>
                  </div>
                  <div style={styles.xpEarned}>
                    <span style={styles.xpBadge}>+{attempt.xp_earned} XP</span>
                  </div>
                  <Link
                    to={`/replay/${attempt.session_id}?ghost=${challenge.session_id}`}
                    style={styles.viewReplayLink}
                  >
                    📺 Replay
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
  },
  backButton: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  titleSection: {
    marginTop: '16px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  metaInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  creator: {
    fontSize: '16px',
    color: '#666',
  },
  badge: {
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '10px',
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
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
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionSection: {
    marginBottom: '24px',
  },
  ghostButton: {
    display: 'block',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  submitSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  instructions: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  noSessions: {
    padding: '20px',
    backgroundColor: '#FFF3E0',
    borderRadius: '8px',
    color: '#F57C00',
    textAlign: 'center',
  },
  sessionSelect: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    marginBottom: '16px',
  },
  submitButton: {
    width: '100%',
    padding: '14px 28px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitError: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    borderRadius: '6px',
  },
  submitSuccess: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    borderRadius: '6px',
  },
  leaderboardSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  emptyLeaderboard: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  leaderboardRow: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr auto auto auto auto',
    gap: '16px',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  rank: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  playerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  attemptDate: {
    fontSize: '12px',
    color: '#999',
  },
  resultBadge: {
    fontSize: '14px',
    fontWeight: '600',
  },
  timeDiff: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'right',
  },
  xpEarned: {
    minWidth: '80px',
    textAlign: 'right',
  },
  xpBadge: {
    padding: '4px 10px',
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  viewReplayLink: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    padding: '16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    marginBottom: '16px',
  },
};
