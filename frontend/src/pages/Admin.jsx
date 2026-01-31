import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import { Navigate } from 'react-router-dom';

function Admin() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null); // {userId, value}


  // Prüfe ob User Admin ist
  if (!user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!usersRes.ok || !statsRes.ok) {
        throw new Error('Fehler beim Laden der Admin-Daten');
      }

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Fehler beim Ändern des Status');
      }

      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_superuser: !currentStatus })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Fehler beim Ändern des Admin-Status');
      }

      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId, username) => {
    if (!confirm(`User "${username}" wirklich löschen? Alle Analysen werden ebenfalls gelöscht!`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Fehler beim Löschen');
      }

      await fetchData();
      setSelectedUser(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const updateLimit = async (userId, newLimit) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ usage_limit_usd: parseFloat(newLimit) })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Fehler beim Ändern des Limits');
      }

      await fetchData();
      setEditingLimit(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `vor ${diffMins} Min`;
    if (diffHours < 24) return `vor ${diffHours} Std`;
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Lade Admin-Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass-card rounded-2xl p-8 border border-red-500/30 text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-neon-blue/20 text-neon-blue rounded-xl hover:bg-neon-blue/30"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-red-500/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-red-400">Admin</span> Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            User-Verwaltung und Statistiken
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in fade-in-delay-1">
            <div className="glass-card rounded-xl p-5 border border-neon-blue/20">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Gesamt User</p>
              <p className="text-3xl font-bold text-neon-blue">{stats.total_users}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-neon-green/20">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Aktive User</p>
              <p className="text-3xl font-bold text-neon-green">{stats.active_users}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-red-500/20">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Blockiert</p>
              <p className="text-3xl font-bold text-red-400">{stats.blocked_users}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-neon-purple/20">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Analysen</p>
              <p className="text-3xl font-bold text-neon-purple">{stats.total_analyses}</p>
            </div>
          </div>
        )}

        {/* Activity Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in fade-in-delay-2">
            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-text-muted text-xs mb-1">Neue User heute</p>
              <p className="text-xl font-bold text-white">{stats.users_today}</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-text-muted text-xs mb-1">Neue User diese Woche</p>
              <p className="text-xl font-bold text-white">{stats.users_this_week}</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-text-muted text-xs mb-1">Analysen heute</p>
              <p className="text-xl font-bold text-white">{stats.analyses_today}</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/10">
              <p className="text-text-muted text-xs mb-1">Analysen diese Woche</p>
              <p className="text-xl font-bold text-white">{stats.analyses_this_week}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden fade-in fade-in-delay-3">
          <div className="p-4 md:p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-blue/30">
                👥
              </span>
              Alle User ({users.length})
            </h2>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden p-4 space-y-4">
            {users.map((u) => (
              <div
                key={u.id}
                className={`glass-card rounded-xl p-4 border ${
                  !u.is_active ? 'border-red-500/30 bg-red-500/5' :
                  u.is_superuser ? 'border-neon-purple/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-white flex items-center gap-2">
                      {u.username}
                      {u.is_superuser && <span className="text-xs px-2 py-0.5 bg-neon-purple/20 text-neon-purple rounded-full">Admin</span>}
                      {!u.is_active && <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">Blockiert</span>}
                    </p>
                    <p className="text-text-muted text-sm">{u.email}</p>
                  </div>
                  <span className="text-neon-blue font-bold">{u.analyses_count}</span>
                </div>
                <div className="text-xs text-text-muted mb-3">
                  <p>Registriert: {formatDate(u.created_at)}</p>
                  <p>Letzte Aktivität: {formatRelativeTime(u.last_activity)}</p>
                  <p className={u.total_cost_usd >= u.usage_limit_usd ? 'text-red-400' : 'text-neon-green'}>
                    Verbrauch: ${u.total_cost_usd?.toFixed(3) || '0.000'} / ${u.usage_limit_usd?.toFixed(2) || '5.00'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleUserStatus(u.id, u.is_active)}
                    disabled={actionLoading || u.id === user.id}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      u.is_active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
                    } disabled:opacity-50`}
                  >
                    {u.is_active ? 'Blockieren' : 'Aktivieren'}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id, u.username)}
                    disabled={actionLoading || u.id === user.id}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 disabled:opacity-50"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider">E-Mail</th>
                  <th className="text-center p-4 text-text-muted text-xs uppercase tracking-wider">Analysen</th>
                  <th className="text-center p-4 text-text-muted text-xs uppercase tracking-wider">Verbrauch</th>
                  <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider">Registriert</th>
                  <th className="text-center p-4 text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-4 text-text-muted text-xs uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-white/5 transition-colors ${
                      !u.is_active ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          u.is_superuser ? 'bg-gradient-to-br from-neon-purple to-red-500' : 'bg-gradient-to-br from-neon-blue to-neon-purple'
                        }`}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.username}</p>
                          {u.full_name && <p className="text-text-muted text-xs">{u.full_name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{u.email}</td>
                    <td className="p-4 text-center">
                      <span className="text-neon-blue font-bold">{u.analyses_count}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`text-sm font-mono ${u.total_cost_usd >= u.usage_limit_usd ? 'text-red-400' : 'text-neon-green'}`}>
                        ${u.total_cost_usd?.toFixed(3) || '0.000'}
                      </div>
                      {editingLimit?.userId === u.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-text-muted">$</span>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={editingLimit.value}
                            onChange={(e) => setEditingLimit({ userId: u.id, value: e.target.value })}
                            className="w-16 px-1 py-0.5 bg-surface border border-neon-blue/50 rounded text-xs text-white text-center"
                            autoFocus
                          />
                          <button
                            onClick={() => updateLimit(u.id, editingLimit.value)}
                            disabled={actionLoading}
                            className="px-1.5 py-0.5 bg-neon-green/20 text-neon-green rounded text-xs hover:bg-neon-green/30"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingLimit(null)}
                            className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingLimit({ userId: u.id, value: u.usage_limit_usd || 5 })}
                          className="text-xs text-text-muted hover:text-neon-blue transition-colors"
                        >
                          Limit: ${u.usage_limit_usd?.toFixed(2) || '5.00'} ✏️
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-text-muted text-sm">{formatDate(u.created_at)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {u.is_superuser && (
                          <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                            Admin
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.is_active
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {u.is_active ? 'Aktiv' : 'Blockiert'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleUserStatus(u.id, u.is_active)}
                          disabled={actionLoading || u.id === user.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            u.is_active
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={u.id === user.id ? 'Du kannst dich nicht selbst blockieren' : ''}
                        >
                          {u.is_active ? 'Blockieren' : 'Aktivieren'}
                        </button>
                        <button
                          onClick={() => toggleAdminStatus(u.id, u.is_superuser)}
                          disabled={actionLoading || u.id === user.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            u.is_superuser
                              ? 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30'
                              : 'bg-white/10 text-text-secondary hover:bg-white/20'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {u.is_superuser ? 'Admin entfernen' : 'Zu Admin machen'}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id, u.username)}
                          disabled={actionLoading || u.id === user.id}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={u.id === user.id ? 'Du kannst dich nicht selbst löschen' : ''}
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
