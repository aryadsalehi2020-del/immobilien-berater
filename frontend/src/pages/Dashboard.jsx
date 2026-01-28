import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, INVESTMENT_GOALS } from '../contexts/UserProfileContext';
import { formatCurrency, formatDate, getScoreColor } from '../constants';

function Dashboard() {
  const { user, token } = useAuth();
  const { profile: investorProfile, isProfileComplete: isInvestorProfileComplete } = useUserProfile();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    favorites: 0,
    recentAnalyses: [],
    averageScore: 0,
    bestAnalysis: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch('http://localhost:8000/library', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const analyses = await response.json();
        const avgScore = analyses.length > 0
          ? analyses.reduce((sum, a) => sum + (a.gesamtscore || 0), 0) / analyses.length
          : 0;
        const best = analyses.length > 0
          ? analyses.reduce((prev, curr) => (curr.gesamtscore || 0) > (prev.gesamtscore || 0) ? curr : prev)
          : null;

        setStats({
          totalAnalyses: analyses.length,
          favorites: analyses.filter(a => a.is_favorite).length,
          recentAnalyses: analyses.slice(0, 5),
          averageScore: avgScore,
          bestAnalysis: best
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {getGreeting()}, <span className="text-gradient-neon">{user?.full_name || user?.username}</span>!
            </h1>
            <p className="text-text-secondary text-lg">
              Hier ist eine Übersicht Ihrer Immobilienanalysen
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-text-muted">
                Aktualisiert: {lastUpdated.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-3 rounded-xl border border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Aktualisieren"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-5 relative z-10">
        <Link
          to="/library"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-blue/20 fade-in fade-in-delay-1 cursor-pointer hover:border-neon-blue/50 transition-all group"
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
          <p className="text-xs text-neon-blue/60 mt-2 group-hover:text-neon-blue transition-colors">Zur Library →</p>
        </Link>

        <Link
          to="/library?filter=favorites"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-purple/20 fade-in fade-in-delay-2 cursor-pointer hover:border-neon-purple/50 transition-all group"
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
          <p className="text-xs text-neon-purple/60 mt-2 group-hover:text-neon-purple transition-colors">Favoriten anzeigen →</p>
        </Link>

        <div className="glass-card rounded-2xl p-6 border border-accent/20 fade-in fade-in-delay-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-accent text-xs font-mono uppercase tracking-wider">Avg</span>
          </div>
          <p className="text-text-secondary text-sm mb-1">Durchschnitt Score</p>
          <p className="text-4xl font-bold text-white text-glow-gold">
            {stats.averageScore > 0 ? Math.round(stats.averageScore) : '-'}
          </p>
          <p className="text-xs text-text-muted mt-2">
            {stats.averageScore >= 70 ? 'Sehr gut' : stats.averageScore >= 50 ? 'Gut' : stats.averageScore > 0 ? 'Verbesserbar' : 'Noch keine Daten'}
          </p>
        </div>

        <Link
          to="/analyze"
          className="glass-card rounded-2xl p-6 card-3d border border-neon-green/20 fade-in fade-in-delay-4 cursor-pointer hover:border-neon-green/50 transition-all group"
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
          <p className="text-xs text-neon-green/60 mt-2 group-hover:text-neon-green transition-colors">Jetzt analysieren →</p>
        </Link>
      </div>

      {/* Investor Profile Setup Prompt */}
      {!isInvestorProfileComplete && (
        <Link
          to="/profile"
          className="glass-card rounded-2xl p-6 border-2 border-accent/40 relative z-10 fade-in fade-in-delay-2 group hover:border-accent transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-neon-purple/20 rounded-2xl flex items-center justify-center border border-accent/30 text-3xl">
              🎯
            </div>
            <div className="flex-1">
              <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-1">Neu: Personalisierte Bewertung</p>
              <h3 className="text-xl font-bold text-white mb-1">Investoren-Profil einrichten</h3>
              <p className="text-text-secondary text-sm">
                Richte dein Profil ein und erhalte Scores, die auf dein Investitionsziel (Cashflow, Vermögensaufbau, etc.) optimiert sind.
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 btn-neon rounded-xl font-bold text-sm">
              Jetzt einrichten
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Active Investor Profile Badge */}
      {isInvestorProfileComplete && (
        <div className="glass-card rounded-2xl p-4 border border-neon-green/30 relative z-10 fade-in fade-in-delay-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-green/10 rounded-lg border border-neon-green/30">
              <span>{INVESTMENT_GOALS[investorProfile.goal]?.icon}</span>
              <span className="text-neon-green font-semibold text-sm">{INVESTMENT_GOALS[investorProfile.goal]?.label}</span>
            </div>
            <p className="text-text-secondary text-sm flex-1">
              Deine Analysen werden auf <span className="text-neon-green font-medium">{INVESTMENT_GOALS[investorProfile.goal]?.label}</span> optimiert
            </p>
            <Link to="/profile" className="text-neon-blue hover:text-neon-purple text-sm font-medium transition-colors">
              Ändern
            </Link>
          </div>
        </div>
      )}

      {/* Best Analysis Highlight */}
      {stats.bestAnalysis && stats.bestAnalysis.gesamtscore >= 60 && (
        <div className="glass-card rounded-2xl p-6 border border-neon-green/30 relative z-10 fade-in fade-in-delay-3">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-2xl flex items-center justify-center border border-neon-green/30">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Beste Analyse</p>
                <p className="text-xl font-bold text-white">{stats.bestAnalysis.title || stats.bestAnalysis.stadt}</p>
                <p className="text-sm text-text-secondary">
                  {formatCurrency(stats.bestAnalysis.kaufpreis)} • {formatDate(stats.bestAnalysis.created_at)}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-neon-green" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
                    {Math.round(stats.bestAnalysis.gesamtscore)}
                  </p>
                  <p className="text-xs text-text-muted">Score</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-sm text-text-secondary">
                  <p className={`font-semibold ${stats.bestAnalysis.verwendungszweck === 'kapitalanlage' ? 'text-neon-purple' : 'text-neon-blue'}`}>
                    {stats.bestAnalysis.verwendungszweck === 'kapitalanlage' ? '💰 Kapitalanlage' : '🏠 Eigennutzung'}
                  </p>
                </div>
              </div>
              <Link
                to={`/library/${stats.bestAnalysis.id}`}
                className="px-5 py-2.5 glass-neon rounded-xl text-neon-blue font-semibold hover:bg-neon-blue/20 transition-all text-sm flex items-center gap-2"
              >
                Ansehen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Profi-Tools Quick Access */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative z-10 fade-in fade-in-delay-2">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center border border-neon-blue/30 text-lg">
              🛠️
            </span>
            Profi-Tools
          </h2>
          <Link to="/tools" className="text-neon-blue hover:text-neon-purple font-semibold transition-colors flex items-center gap-1 text-sm">
            Alle Tools
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/tools" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/30 hover:bg-neon-blue/5 transition-all group">
            <span className="text-2xl mb-2 block">🤖</span>
            <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">AI Berater</h4>
            <p className="text-xs text-text-muted mt-1">Fragen zu Immobilien & Finanzierung</p>
          </Link>
          <Link to="/tools" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all group">
            <span className="text-2xl mb-2 block">📈</span>
            <h4 className="font-bold text-white group-hover:text-neon-green transition-colors">30-Jahre-Projektion</h4>
            <p className="text-xs text-text-muted mt-1">Cashflow & Vermögen über Zeit</p>
          </Link>
          <Link to="/tools" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all group">
            <span className="text-2xl mb-2 block">🔮</span>
            <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors">Szenarien-Simulator</h4>
            <p className="text-xs text-text-muted mt-1">"Was wäre wenn" Analysen</p>
          </Link>
          <Link to="/tools" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/30 hover:bg-accent/5 transition-all group">
            <span className="text-2xl mb-2 block">⚖️</span>
            <h4 className="font-bold text-white group-hover:text-accent transition-colors">Fairer Preis</h4>
            <p className="text-xs text-text-muted mt-1">Marktwert & Verhandlungsziel</p>
          </Link>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="glass-card rounded-2xl p-8 border border-white/10 relative z-10 fade-in fade-in-delay-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-xl">📊</span>
            Neueste Analysen
          </h2>
          <Link to="/library" className="text-neon-blue hover:text-neon-purple font-semibold transition-colors flex items-center gap-1 text-sm">
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
            <div className="w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
            {stats.recentAnalyses.map((analysis, index) => {
              const scoreInfo = getScoreColor(analysis.gesamtscore || 0);
              return (
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                         style={{ backgroundColor: `${scoreInfo.hex}20`, border: `1px solid ${scoreInfo.hex}40` }}>
                      <span style={{ color: scoreInfo.hex }}>{Math.round(analysis.gesamtscore || 0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors">
                        {analysis.title || `${analysis.stadt || 'Unbekannt'}`}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {formatDate(analysis.created_at)} • {formatCurrency(analysis.kaufpreis)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      analysis.verwendungszweck === 'kapitalanlage'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'bg-neon-blue/20 text-neon-blue'
                    }`}>
                      {analysis.verwendungszweck === 'kapitalanlage' ? '💰' : '🏠'}
                    </span>
                    <svg className="w-5 h-5 text-text-secondary group-hover:text-neon-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 relative z-10 fade-in fade-in-delay-4">
        <Link
          to="/profile"
          className="glass-card rounded-2xl p-6 border border-white/10 hover:border-neon-purple/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center border border-neon-purple/30">
              <svg className="w-7 h-7 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors">Mein Finanzprofil</h3>
              <p className="text-sm text-text-secondary">Profil ausfüllen für personalisierte Förder-Tipps</p>
            </div>
            <svg className="w-5 h-5 text-text-muted group-hover:text-neon-purple group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          to="/settings"
          className="glass-card rounded-2xl p-6 border border-white/10 hover:border-neon-blue/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-neon-blue/20 to-neon-green/20 rounded-xl flex items-center justify-center border border-neon-blue/30">
              <svg className="w-7 h-7 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">Einstellungen</h3>
              <p className="text-sm text-text-secondary">Kontoeinstellungen und Standardwerte anpassen</p>
            </div>
            <svg className="w-5 h-5 text-text-muted group-hover:text-neon-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
