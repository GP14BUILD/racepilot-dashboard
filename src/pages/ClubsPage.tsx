import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Club {
  id: number;
  name: string;
  code: string;
  description?: string;
  location?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  member_count: number;
}

interface ClubMember {
  id: number;
  email: string;
  name: string;
  role: string;
  sail_number?: string;
  created_at: string;
  last_login?: string;
}

const API_URL = 'https://racepilot-backend-production.up.railway.app';

export default function ClubsPage() {
  const { user, token } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Club form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    website: '',
    is_active: true,
  });

  const isSuperAdmin = user?.role === 'admin';
  const isClubAdmin = user?.role === 'club_admin' || user?.role === 'admin';

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    if (selectedClub) {
      loadClubMembers(selectedClub.id);
    }
  }, [selectedClub]);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clubs/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load clubs');
      }

      const data = await response.json();
      setClubs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClubMembers = async (clubId: number) => {
    try {
      const response = await fetch(`${API_URL}/clubs/${clubId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (err: any) {
      console.error('Failed to load members:', err);
      setMembers([]);
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/clubs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create club');
      }

      // Reset form and reload clubs
      setFormData({
        name: '',
        code: '',
        description: '',
        location: '',
        website: '',
        is_active: true,
      });
      setShowCreateForm(false);
      loadClubs();
      alert('Club created successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateMemberRole = async (memberId: number, newRole: string) => {
    if (!selectedClub) return;

    try {
      const response = await fetch(`${API_URL}/clubs/${selectedClub.id}/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update role');
      }

      // Reload members
      loadClubMembers(selectedClub.id);
      alert('Member role updated successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
        <button onClick={loadClubs} style={styles.button}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Club Management</h1>
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={styles.createButton}
          >
            {showCreateForm ? 'Cancel' : '+ Create Club'}
          </button>
        )}
      </div>

      {showCreateForm && isSuperAdmin && (
        <div style={styles.form}>
          <h2 style={styles.formTitle}>Create New Club</h2>
          <form onSubmit={handleCreateClub}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Club Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                placeholder="Royal Sydney Yacht Squadron"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Club Code * (3-6 characters)</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                style={styles.input}
                placeholder="RSYS"
                maxLength={6}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                style={styles.input}
                placeholder="Sydney, Australia"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{...styles.input, minHeight: '80px'}}
                placeholder="Brief description of the club"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                style={styles.input}
                placeholder="https://example.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <span style={{marginLeft: '8px'}}>Active (accepting new members)</span>
              </label>
            </div>

            <button type="submit" style={styles.submitButton}>
              Create Club
            </button>
          </form>
        </div>
      )}

      <div style={styles.clubsGrid}>
        {clubs.map((club) => (
          <div
            key={club.id}
            style={{
              ...styles.clubCard,
              ...(selectedClub?.id === club.id ? styles.clubCardSelected : {})
            }}
            onClick={() => setSelectedClub(club)}
          >
            <div style={styles.clubHeader}>
              <h3 style={styles.clubName}>{club.name}</h3>
              <span style={styles.clubCode}>{club.code}</span>
            </div>
            {club.location && <p style={styles.clubLocation}>📍 {club.location}</p>}
            {club.description && <p style={styles.clubDescription}>{club.description}</p>}
            <div style={styles.clubFooter}>
              <span style={styles.memberCount}>👥 {club.member_count} members</span>
              <span style={club.is_active ? styles.statusActive : styles.statusInactive}>
                {club.is_active ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedClub && (
        <div style={styles.membersSection}>
          <h2 style={styles.sectionTitle}>
            Members of {selectedClub.name}
          </h2>
          {members.length === 0 ? (
            <p style={styles.noMembers}>No members yet</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Sail #</th>
                  <th style={styles.th}>Last Login</th>
                  {isClubAdmin && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} style={styles.tableRow}>
                    <td style={styles.td}>{member.name}</td>
                    <td style={styles.td}>{member.email}</td>
                    <td style={styles.td}>
                      <span style={getRoleBadgeStyle(member.role)}>
                        {member.role}
                      </span>
                    </td>
                    <td style={styles.td}>{member.sail_number || '-'}</td>
                    <td style={styles.td}>
                      {member.last_login
                        ? new Date(member.last_login).toLocaleDateString()
                        : 'Never'}
                    </td>
                    {isClubAdmin && (
                      <td style={styles.td}>
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                          style={styles.roleSelect}
                          disabled={!isClubAdmin || member.role === 'admin'}
                        >
                          <option value="sailor">Sailor</option>
                          <option value="coach">Coach</option>
                          <option value="club_admin">Club Admin</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function getRoleBadgeStyle(role: string) {
  const baseStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  };

  switch (role) {
    case 'admin':
      return { ...baseStyle, backgroundColor: '#E3F2FD', color: '#1976D2' };
    case 'club_admin':
      return { ...baseStyle, backgroundColor: '#F3E5F5', color: '#7B1FA2' };
    case 'coach':
      return { ...baseStyle, backgroundColor: '#FFF3E0', color: '#F57C00' };
    default:
      return { ...baseStyle, backgroundColor: '#E8F5E9', color: '#388E3C' };
  }
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
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#555',
  },
  submitButton: {
    padding: '12px 32px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
  },
  clubsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  clubCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  clubCardSelected: {
    border: '2px solid #667eea',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
  },
  clubHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  clubName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  clubCode: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  clubLocation: {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0',
  },
  clubDescription: {
    fontSize: '13px',
    color: '#777',
    margin: '8px 0',
    lineHeight: '1.5',
  },
  clubFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #eee',
  },
  memberCount: {
    fontSize: '14px',
    color: '#555',
  },
  statusActive: {
    color: '#4CAF50',
    fontSize: '14px',
    fontWeight: '600',
  },
  statusInactive: {
    color: '#999',
    fontSize: '14px',
  },
  membersSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  noMembers: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333',
  },
  roleSelect: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
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
  error: {
    padding: '16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    marginBottom: '16px',
  },
};
