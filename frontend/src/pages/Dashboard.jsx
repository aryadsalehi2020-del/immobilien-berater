import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    favorites: 0,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/library', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const analyses = await response.json();
        setStats({
          totalAnalyses: analyses.length,
          favorites: analyses.filter(a => a.is_favorite).length,
          recentAnalyses: analyses.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 space-y-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
      </div>

      {/* Welcome Header */}
      <div className="relative z-10 fade-in">
        <h1 className="text-4xl font-bold text-white mb-2">
          Willkommen zurück, <span className="text-gradient-neon">{user?.full_name || user?.username}</span>!
        </h1>
        <p className="text-text-secondary text-lg">
          Hier ist eine Übersicht Ihrer Immobilienanalysen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        <Link
          to="/library"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-blue/20 fade-in fade-in-delay-1 cursor-pointer hover:border-neon-blue/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neon-blue/20 rounded-xl flex items-center justify-center shadow-neon-blue">
              <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-neon-blue text-xs font-mono uppercase tracking-wider">Total</span>
          </div>
          <p className="text-text-secondary text-sm mb-1">Gesamt Analysen</p>
          <p className="text-4xl font-bold text-white text-glow-blue">{stats.totalAnalyses}</p>
          <p className="text-xs text-neon-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Klicken für Library →</p>
        </Link>

        <Link
          to="/library?filter=favorites"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-purple/20 fade-in fade-in-delay-2 cursor-pointer hover:border-neon-purple/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neon-purple/20 rounded-xl flex items-center justify-center shadow-neon-purple">
              <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-neon-purple text-xs font-mono uppercase tracking-wider">Saved</span>
          </div>
          <p className="text-text-secondary text-sm mb-1">Favoriten</p>
          <p className="text-4xl font-bold text-white text-glow-purple">{stats.favorites}</p>
        </Link>

        <Link
          to="/analyze"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-green/20 fade-in fade-in-delay-3 cursor-pointer hover:border-neon-green/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neon-green/20 rounded-xl flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
              <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-neon-green text-xs font-mono uppercase tracking-wider">New</span>
          </div>
          <p className="text-text-secondary text-sm mb-1">Neue Analyse</p>
          <p className="text-4xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>
            Starten
          </p>
        </Link>
      </div>

      {/* Recent Analyses */}
      <div className="glass-card rounded-2xl p-8 border border-white/10 relative z-10 fade-in fade-in-delay-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Neueste Analysen</h2>
          <Link to="/library" className="text-neon-blue hover:text-neon-purple font-semibold transition-colors flex items-center gap-1">
            Alle ansehen
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 spinner-neon rounded-full mx-auto"></div>
            <p className="text-text-secondary mt-4">Lade Analysen...</p>
          </div>
        ) : stats.recentAnalyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 pulse-neon">
              <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Noch keine Analysen</h3>
            <p className="text-text-secondary mb-6">Starten Sie Ihre erste Immobilienbewertung</p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 btn-neon font-bold rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Erste Analyse erstellen
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentAnalyses.map((analysis, index) => (
              <Link
                key={analysis.id}
                to={`/library/${analysis.id}`}
                className="flex items-center justify-between p-4 glass-neon rounded-xl transition-all duration-300 group"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-4">
                  {analysis.is_favorite && (
                    <span className="text-accent text-xl">⭐</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors">
                      {analysis.title || `${analysis.stadt || 'Unbekannt'} - ${analysis.verwendungszweck}`}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {formatDate(analysis.created_at)} • {formatCurrency(analysis.kaufpreis)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-text-muted uppercase tracking-wider">Score</p>
                    <p className={`text-xl font-bold ${
                      analysis.gesamtscore >= 70 ? 'text-neon-green' :
                      analysis.gesamtscore >= 50 ? 'text-accent' :
                      'text-red-400'
                    }`} style={{
                      textShadow: analysis.gesamtscore >= 70
                        ? '0 0 10px rgba(34, 197, 94, 0.5)'
                        : analysis.gesamtscore >= 50
                          ? '0 0 10px rgba(251, 191, 36, 0.5)'
                          : '0 0 10px rgba(239, 68, 68, 0.5)'
                    }}>
                      {Math.round(analysis.gesamtscore || 0)}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-text-secondary group-hover:text-neon-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
