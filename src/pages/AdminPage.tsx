import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  club_id: number | null;
  club_name: string | null;
  role: string;
  sail_number: string | null;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://api.race-pilot.app/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Make sure you have admin permissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Access control - only admin and club_admin can access
  if (!user || (user.role !== 'admin' && user.role !== 'club_admin')) {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 mb-4">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Users</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.sail_number && u.sail_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'all' || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'club_admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'coach':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'club_admin':
        return 'Club Admin';
      case 'coach':
        return 'Coach';
      default:
        return 'Sailor';
    }
  };

  const copyClubCode = () => {
    // For CLUB Sailing Club, the code is "CLUB"
    const clubCode = "CLUB";
    navigator.clipboard.writeText(clubCode);
    alert(`Club code "${clubCode}" copied to clipboard!`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-ocean-600 bg-clip-text text-transparent">
            User Management
          </span>
        </h1>
        <p className="text-slate-400">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          {user.club_name && ` in ${user.club_name}`}
        </p>
      </div>

      {/* Club Info & Invite Section */}
      <div className="glass-dark p-6 rounded-xl mb-6 border border-ocean-500/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span>🏆</span>
              <span>{user.club_name}</span>
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Invite users to join your club by sharing the club code below
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-500 uppercase">Club Code</span>
                <div className="text-2xl font-bold text-ocean-400 font-mono">CLUB</div>
              </div>
              <button
                onClick={copyClubCode}
                className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition flex items-center gap-2"
              >
                <span>📋</span>
                <span>Copy Code</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Share this code with new users so they can register at{' '}
              <a href="https://race-pilot.app/register" className="text-ocean-400 hover:underline">
                race-pilot.app/register
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-dark p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or sail number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="all">All Roles</option>
              <option value="sailor">Sailors</option>
              <option value="coach">Coaches</option>
              <option value="club_admin">Club Admins</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Sail Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Registered</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-sm text-slate-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {u.sail_number || <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                    {format(new Date(u.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                    {u.last_login
                      ? format(new Date(u.last_login), 'MMM d, yyyy HH:mm')
                      : <span className="text-slate-500">Never</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    {u.is_active ? (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-slate-400">No users found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="glass-dark p-6 rounded-xl">
          <div className="text-3xl font-bold text-ocean-400">{users.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total Users</div>
        </div>
        <div className="glass-dark p-6 rounded-xl">
          <div className="text-3xl font-bold text-green-400">
            {users.filter(u => u.is_active).length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Active Users</div>
        </div>
        <div className="glass-dark p-6 rounded-xl">
          <div className="text-3xl font-bold text-purple-400">
            {users.filter(u => u.role === 'admin' || u.role === 'club_admin').length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Admins</div>
        </div>
        <div className="glass-dark p-6 rounded-xl">
          <div className="text-3xl font-bold text-blue-400">
            {users.filter(u => u.role === 'coach').length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Coaches</div>
        </div>
      </div>
    </div>
  );
}
