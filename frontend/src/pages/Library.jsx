import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Library() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, favorites
  const [searchTerm, setSearchTerm] = useState('');

  // Read filter from URL on mount
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter === 'favorites') {
      setFilter('favorites');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('http://localhost:8000/library', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: !currentStatus })
      });

      if (response.ok) {
        setAnalyses(analyses.map(a =>
          a.id === id ? { ...a, is_favorite: !currentStatus } : a
        ));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!confirm('Möchten Sie diese Analyse wirklich löschen?')) return;

    try {
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAnalyses(analyses.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete analysis:', error);
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

  const filteredAnalyses = analyses
    .filter(a => {
      if (filter === 'favorites' && !a.is_favorite) return false;
      if (searchTerm && !a.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !a.stadt?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });

  // Handle filter change and update URL
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'favorites') {
      setSearchParams({ filter: 'favorites' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="p-8 space-y-6 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-purple/10 -top-48 -left-48" />
        <div className="glow-orb w-80 h-80 bg-neon-blue/10 bottom-0 right-1/4" style={{ animationDelay: '5s' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 fade-in">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-gradient-neon">Library</span>
          </h1>
          <p className="text-text-secondary text-lg">
            {analyses.length} gespeicherte Analyse{analyses.length !== 1 ? 'n' : ''}
          </p>
        </div>
        <Link
          to="/analyze"
          className="btn-neon px-6 py-3 font-bold rounded-xl flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neue Analyse
          </span>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative z-10 fade-in fade-in-delay-1">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Suche nach Titel oder Stadt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder-text-muted"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                  : 'border border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => handleFilterChange('favorites')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === 'favorites'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                  : 'border border-white/20 text-text-secondary hover:border-neon-purple/50 hover:text-neon-purple'
              }`}
            >
              <svg className="w-5 h-5" fill={filter === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Favoriten
            </button>
          </div>
        </div>
      </div>

      {/* Analyses Grid */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 relative z-10">
          <div className="w-12 h-12 spinner-neon rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Lade Analysen...</p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 relative z-10 fade-in fade-in-delay-2">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 pulse-neon">
            <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchTerm || filter === 'favorites' ? 'Keine Ergebnisse' : 'Noch keine Analysen'}
          </h3>
          <p className="text-text-secondary mb-6">
            {searchTerm
              ? 'Versuchen Sie einen anderen Suchbegriff'
              : filter === 'favorites'
              ? 'Markieren Sie Analysen als Favoriten'
              : 'Starten Sie Ihre erste Immobilienbewertung'}
          </p>
          {!searchTerm && filter === 'all' && (
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
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredAnalyses.map((analysis, index) => (
            <div
              key={analysis.id}
              className="glass-card rounded-2xl p-6 card-3d border border-white/10 relative fade-in group"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              {/* Favorite Badge */}
              <button
                onClick={() => toggleFavorite(analysis.id, analysis.is_favorite)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/5 hover:bg-neon-purple/20 rounded-xl flex items-center justify-center transition-all border border-white/10 hover:border-neon-purple/50"
              >
                <svg
                  className={`w-6 h-6 transition-all ${analysis.is_favorite ? 'text-accent fill-current' : 'text-text-muted group-hover:text-neon-purple'}`}
                  fill={analysis.is_favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>

              {/* Score Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-xl ${
                analysis.gesamtscore >= 70
                  ? 'bg-neon-green/20 border border-neon-green/50'
                  : analysis.gesamtscore >= 50
                    ? 'bg-accent/20 border border-accent/50'
                    : 'bg-red-500/20 border border-red-500/50'
              }`}>
                <span className={`font-bold text-sm ${
                  analysis.gesamtscore >= 70
                    ? 'text-neon-green'
                    : analysis.gesamtscore >= 50
                      ? 'text-accent'
                      : 'text-red-400'
                }`} style={{
                  textShadow: analysis.gesamtscore >= 70
                    ? '0 0 10px rgba(34, 197, 94, 0.5)'
                    : analysis.gesamtscore >= 50
                      ? '0 0 10px rgba(251, 191, 36, 0.5)'
                      : '0 0 10px rgba(239, 68, 68, 0.5)'
                }}>
                  {Math.round(analysis.gesamtscore || 0)}
                </span>
              </div>

              {/* Content */}
              <div className="mt-12 mb-4">
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-neon-blue transition-colors">
                  {analysis.title || `${analysis.stadt || 'Unbekannt'}`}
                </h3>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {analysis.stadt}{analysis.stadtteil ? `, ${analysis.stadtteil}` : ''}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-medium">{formatCurrency(analysis.kaufpreis)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(analysis.created_at)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/library/${analysis.id}`}
                  className="flex-1 py-3 glass-neon font-semibold rounded-xl transition-all text-center text-sm text-neon-blue hover:bg-neon-blue/20"
                >
                  Details ansehen
                </Link>
                <button
                  onClick={() => deleteAnalysis(analysis.id)}
                  className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
