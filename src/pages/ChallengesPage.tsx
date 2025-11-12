import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const API_URL = 'https://racepilot-backend-production.up.railway.app';

export default function ChallengesPage() {
  const { user, token } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    loadChallenges();
  }, [filter]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('difficulty', filter);
      }

      const response = await fetch(`${API_URL}/challenges/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load challenges');
      }

      const data = await response.json();
      setChallenges(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
        <button onClick={loadChallenges} style={styles.button}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ghost Boat Racing</h1>
          <p style={styles.subtitle}>Challenge friends and compete against GPS tracks</p>
        </div>
        <Link to="/create-challenge" style={styles.createButton}>
          + Create Challenge
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={{
            ...styles.filterButton,
            ...(filter === 'all' ? styles.filterButtonActive : {})
          }}
        >
          All Challenges
        </button>
        <button
          onClick={() => setFilter('easy')}
          style={{
            ...styles.filterButton,
            ...(filter === 'easy' ? styles.filterButtonActive : {})
          }}
        >
          ⭐ Easy
        </button>
        <button
          onClick={() => setFilter('medium')}
          style={{
            ...styles.filterButton,
            ...(filter === 'medium' ? styles.filterButtonActive : {})
          }}
        >
          ⭐⭐ Medium
        </button>
        <button
          onClick={() => setFilter('hard')}
          style={{
            ...styles.filterButton,
            ...(filter === 'hard' ? styles.filterButtonActive : {})
          }}
        >
          ⭐⭐⭐ Hard
        </button>
      </div>

      {/* Challenges Grid */}
      {challenges.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🏁</div>
          <h3 style={styles.emptyTitle}>No challenges yet</h3>
          <p style={styles.emptyText}>Create your first challenge and invite friends to race!</p>
          <Link to="/create-challenge" style={styles.createButton}>
            Create Challenge
          </Link>
        </div>
      ) : (
        <div style={styles.challengesGrid}>
          {challenges.map((challenge) => {
            const difficultyColors = getDifficultyColor(challenge.difficulty);
            const difficultyIcon = getDifficultyIcon(challenge.difficulty);
            const isExpired = challenge.expires_at && new Date(challenge.expires_at) < new Date();

            return (
              <div key={challenge.id} style={styles.challengeCard}>
                {/* Header */}
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.challengeTitle}>{challenge.title}</h3>
                    <p style={styles.creatorName}>by {challenge.creator_name}</p>
                  </div>
                  <span
                    style={{
                      ...styles.difficultyBadge,
                      backgroundColor: difficultyColors.bg,
                      color: difficultyColors.color,
                    }}
                  >
                    {difficultyIcon} {challenge.difficulty}
                  </span>
                </div>

                {/* Description */}
                {challenge.description && (
                  <p style={styles.description}>{challenge.description}</p>
                )}

                {/* Stats */}
                <div style={styles.stats}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Attempts</span>
                    <span style={styles.statValue}>{challenge.attempt_count}</span>
                  </div>
                  {challenge.best_time !== null && (
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Best Time</span>
                      <span style={styles.statValue}>
                        {challenge.best_time > 0 ? '+' : ''}{challenge.best_time?.toFixed(1)}s
                      </span>
                    </div>
                  )}
                  {challenge.boat_class && (
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>Class</span>
                      <span style={styles.statValue}>{challenge.boat_class}</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div style={styles.badges}>
                  {challenge.is_public && (
                    <span style={styles.badge}>🌍 Public</span>
                  )}
                  {isExpired && (
                    <span style={{...styles.badge, backgroundColor: '#FFEBEE', color: '#C62828'}}>
                      ⏰ Expired
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={styles.cardActions}>
                  <Link
                    to={`/challenges/${challenge.id}`}
                    style={styles.viewButton}
                  >
                    View Details
                  </Link>
                  {challenge.can_attempt && !isExpired && (
                    <Link
                      to={`/challenges/${challenge.id}/race`}
                      style={styles.raceButton}
                    >
                      🏁 Race Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    marginTop: '8px',
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-block',
    border: 'none',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    color: 'white',
  },
  challengesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  challengeCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  challengeTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  creatorName: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  difficultyBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  description: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  badges: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '10px',
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontWeight: '500',
  },
  cardActions: {
    display: 'flex',
    gap: '12px',
  },
  viewButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none',
  },
  raceButton: {
    flex: 1,
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
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
  button: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};
