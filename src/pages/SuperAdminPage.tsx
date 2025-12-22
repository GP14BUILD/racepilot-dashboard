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

interface Club {
  id: number;
  name: string;
  code: string;
  subscription_tier: string;
  is_active: boolean;
  user_count: number;
  created_at: string;
}

export default function SuperAdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterClub, setFilterClub] = useState<string>('all');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      // Load users
      const usersResponse = await fetch('https://api.race-pilot.app/auth/admin/super/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!usersResponse.ok) {
        throw new Error('Failed to load users');
      }

      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Load clubs
      const clubsResponse = await fetch('https://api.race-pilot.app/auth/admin/super/clubs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!clubsResponse.ok) {
        throw new Error('Failed to load clubs');
      }

      const clubsData = await clubsResponse.json();
      setClubs(clubsData);
    } catch (err) {
      setError('Failed to load data. Make sure you have super admin permissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`https://api.race-pilot.app/auth/admin/super/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Reload users to reflect the change
      await loadData();
      alert('User role updated successfully!');
    } catch (err) {
      alert('Failed to update user role. Please try again.');
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Access control - only super admin (role='admin') can access
  if (!user || user.role !== 'admin') {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400 mb-4">You don't have permission to view this page. Super admin access required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading super admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-dark p-8 rounded-xl text-center max-w-md mx-auto">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter users based on search term, role filter, and club filter
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.sail_number && u.sail_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.club_name && u.club_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesClub = filterClub === 'all' || (u.club_id && u.club_id.toString() === filterClub);

    return matchesSearch && matchesRole && matchesClub;
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
        return 'Super Admin';
      case 'club_admin':
        return 'Club Admin';
      case 'coach':
        return 'Coach';
      default:
        return 'Sailor';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-ocean-600 bg-clip-text text-transparent">
            Super Admin Dashboard
          </span>
        </h1>
        <p className="text-slate-400">
          Master control panel for all clubs and users
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="glass-dark p-6 rounded-xl border border-purple-500/30">
          <div className="text-3xl font-bold text-purple-400">{users.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total Users</div>
        </div>
        <div className="glass-dark p-6 rounded-xl border border-blue-500/30">
          <div className="text-3xl font-bold text-blue-400">{clubs.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total Clubs</div>
        </div>
        <div className="glass-dark p-6 rounded-xl border border-green-500/30">
          <div className="text-3xl font-bold text-green-400">
            {users.filter(u => u.is_active).length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Active Users</div>
        </div>
        <div className="glass-dark p-6 rounded-xl border border-ocean-500/30">
          <div className="text-3xl font-bold text-ocean-400">
            {users.filter(u => u.role === 'admin' || u.role === 'club_admin').length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Admins</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-dark p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, club..."
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
              <option value="admin">Super Admins</option>
            </select>
          </div>

          {/* Club Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Club</label>
            <select
              value={filterClub}
              onChange={(e) => setFilterClub(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="all">All Clubs</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id.toString()}>
                  {club.name} ({club.user_count} users)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-dark rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Club</th>
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
                  <td className="px-6 py-4 text-slate-300">
                    {u.club_name || <span className="text-slate-500">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => {
                        if (window.confirm(`Change ${u.name}'s role to ${e.target.value}?`)) {
                          updateUserRole(u.id, e.target.value);
                        }
                      }}
                      disabled={updatingUserId === u.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getRoleBadgeColor(u.role)} ${updatingUserId === u.id ? 'opacity-50' : ''}`}
                    >
                      <option value="sailor">Sailor</option>
                      <option value="coach">Coach</option>
                      <option value="club_admin">Club Admin</option>
                      <option value="admin">Super Admin</option>
                    </select>
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

      {/* Clubs Overview */}
      <div className="glass-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-800/50 border-b border-white/10">
          <h2 className="text-xl font-bold">All Clubs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/30 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Club Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Subscription</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Users</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-semibold">{club.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-ocean-500/20 text-ocean-300 border border-ocean-500/30 rounded-lg font-mono text-sm">
                      {club.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      club.subscription_tier === 'pro'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}>
                      {club.subscription_tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{club.user_count}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                    {format(new Date(club.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    {club.is_active ? (
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
        </div>
      </div>
    </div>
  );
}
