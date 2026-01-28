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
    <div className="p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Willkommen zurück, {user?.full_name || user?.username}! 👋
        </h1>
        <p className="text-slate text-lg">
          Hier ist eine Übersicht Ihrer Immobilienanalysen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-light rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-slate text-sm mb-1">Gesamt Analysen</p>
          <p className="text-3xl font-bold text-primary">{stats.totalAnalyses}</p>
        </div>

        <div className="glass-light rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <p className="text-slate text-sm mb-1">Favoriten</p>
          <p className="text-3xl font-bold text-primary">{stats.favorites}</p>
        </div>

        <div className="glass-light rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-slate text-sm mb-1">Ø Score</p>
          <p className="text-3xl font-bold text-primary">
            {stats.totalAnalyses > 0
              ? Math.round(
                  stats.recentAnalyses.reduce((sum, a) => sum + (a.gesamtscore || 0), 0) /
                    stats.recentAnalyses.length
                )
              : 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-light rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Schnellzugriff</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/analyze"
            className="p-6 bg-gradient-gold rounded-xl btn-premium flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">Neue Analyse</h3>
              <p className="text-primary/70 text-sm">Immobilie bewerten</p>
            </div>
          </Link>

          <Link
            to="/library"
            className="p-6 border-2 border-slate/30 rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">Zur Library</h3>
              <p className="text-slate text-sm">Alle Analysen ansehen</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="glass-light rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Neueste Analysen</h2>
          <Link to="/library" className="text-accent hover:underline font-semibold">
            Alle ansehen →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate mt-4">Lade Analysen...</p>
          </div>
        ) : stats.recentAnalyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Noch keine Analysen</h3>
            <p className="text-slate mb-6">Starten Sie Ihre erste Immobilienbewertung</p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary font-bold rounded-xl btn-premium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Erste Analyse erstellen
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                to={`/library/${analysis.id}`}
                className="flex items-center justify-between p-4 bg-slate/5 hover:bg-accent/5 border border-slate/10 hover:border-accent/30 rounded-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  {analysis.is_favorite && (
                    <span className="text-yellow-500 text-xl">⭐</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-primary">
                      {analysis.title || `${analysis.stadt || 'Unbekannt'} - ${analysis.verwendungszweck}`}
                    </h3>
                    <p className="text-sm text-slate">
                      {formatDate(analysis.created_at)} • {formatCurrency(analysis.kaufpreis)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate">Score</p>
                    <p className={`text-lg font-bold ${
                      analysis.gesamtscore >= 70 ? 'text-green-600' :
                      analysis.gesamtscore >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {Math.round(analysis.gesamtscore || 0)}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
