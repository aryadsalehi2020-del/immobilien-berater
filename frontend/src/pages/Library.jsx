import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate, getScoreColor } from '../constants';
import { API_BASE } from '../config';

function Library() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, score, price
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });

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
      const response = await fetch(`${API_BASE}/library`, {
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
      const response = await fetch(`${API_BASE}/library/${id}`, {
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
    try {
      const response = await fetch(`${API_BASE}/library/${id}`, {
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

  // Handle filter change and update URL
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'favorites') {
      setSearchParams({ filter: 'favorites' });
    } else {
      setSearchParams({});
    }
  };

  // Sort function
  const sortAnalyses = (a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at) - new Date(b.created_at);
        break;
      case 'score':
        comparison = (a.gesamtscore || 0) - (b.gesamtscore || 0);
        break;
      case 'price':
        comparison = (a.kaufpreis || 0) - (b.kaufpreis || 0);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  };

  const filteredAnalyses = analyses
    .filter(a => {
      if (filter === 'favorites' && !a.is_favorite) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = a.title?.toLowerCase().includes(term);
        const matchStadt = a.stadt?.toLowerCase().includes(term);
        const matchStadtteil = a.stadtteil?.toLowerCase().includes(term);
        if (!matchTitle && !matchStadt && !matchStadtteil) return false;
      }
      return true;
    })
    .sort(sortAnalyses);

  const sortOptions = [
    { value: 'date', label: 'Datum', icon: '📅' },
    { value: 'score', label: 'Score', icon: '🎯' },
    { value: 'price', label: 'Preis', icon: '💰' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 bg-mesh-animated min-h-screen relative">
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
            {filter === 'favorites' && ` • ${filteredAnalyses.length} Favoriten`}
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

      {/* Filters & Sort */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative z-10 fade-in fade-in-delay-1">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Suche nach Titel, Stadt oder Stadtteil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder-text-muted"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                  : 'border border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => handleFilterChange('favorites')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">Sortieren:</span>
            <div className="flex bg-surface rounded-xl border border-white/10 overflow-hidden">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (sortBy === option.value) {
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    } else {
                      setSortBy(option.value);
                      setSortOrder('desc');
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-1 ${
                    sortBy === option.value
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                  {sortBy === option.value && (
                    <svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
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
          <div className="w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {searchTerm ? (
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : filter === 'favorites' ? (
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {searchTerm ? 'Keine Ergebnisse gefunden' : filter === 'favorites' ? 'Keine Favoriten' : 'Noch keine Analysen'}
          </h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            {searchTerm
              ? `Keine Analysen gefunden für "${searchTerm}". Versuchen Sie einen anderen Suchbegriff.`
              : filter === 'favorites'
              ? 'Markieren Sie Analysen als Favoriten, indem Sie auf den Stern klicken.'
              : 'Starten Sie Ihre erste Immobilienbewertung und entdecken Sie das volle Potenzial.'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue rounded-xl transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Suche zurücksetzen
            </button>
          ) : filter === 'favorites' ? (
            <button
              onClick={() => handleFilterChange('all')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue rounded-xl transition-all font-medium"
            >
              Alle Analysen anzeigen
            </button>
          ) : (
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 btn-neon font-bold rounded-xl text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Erste Analyse erstellen
              </span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
          {filteredAnalyses.map((analysis, index) => {
            const scoreInfo = getScoreColor(analysis.gesamtscore || 0);
            return (
              <div
                key={analysis.id}
                className="glass-card rounded-2xl overflow-hidden card-3d border border-white/10 relative fade-in group"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Header with Score */}
                <div className="p-5 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    {/* Score Badge */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-${scoreInfo.color}/20 border border-${scoreInfo.color}/50`}
                         style={{ backgroundColor: `${scoreInfo.hex}20`, borderColor: `${scoreInfo.hex}50` }}>
                      <span className="text-2xl font-black" style={{ color: scoreInfo.hex, textShadow: `0 0 10px ${scoreInfo.hex}50` }}>
                        {Math.round(analysis.gesamtscore || 0)}
                      </span>
                      <div className="text-xs">
                        <div className="font-bold" style={{ color: scoreInfo.hex }}>{scoreInfo.label}</div>
                        <div className="text-text-muted">Score</div>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(analysis.id, analysis.is_favorite);
                      }}
                      className="w-10 h-10 bg-white/5 hover:bg-neon-purple/20 rounded-xl flex items-center justify-center transition-all border border-white/10 hover:border-neon-purple/50"
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
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-lg mb-3 line-clamp-2 group-hover:text-neon-blue transition-colors">
                    {analysis.title || `${analysis.stadt || 'Unbekannt'}`}
                  </h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-neon-blue/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-text-muted text-xs">Ort</div>
                        <div className="text-white font-medium truncate max-w-[100px]">
                          {analysis.stadt}{analysis.stadtteil ? `, ${analysis.stadtteil}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-neon-green/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-text-muted text-xs">Kaufpreis</div>
                        <div className="text-white font-medium">{formatCurrency(analysis.kaufpreis)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 border-t border-white/5 mt-4 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(analysis.created_at)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      analysis.verwendungszweck === 'kapitalanlage'
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'bg-neon-blue/20 text-neon-blue'
                    }`}>
                      {analysis.verwendungszweck === 'kapitalanlage' ? '💰 Kapitalanlage' : '🏠 Eigennutzung'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/library/${analysis.id}`}
                      className="flex-1 py-3 glass-neon font-semibold rounded-xl transition-all text-center text-sm text-neon-blue hover:bg-neon-blue/20 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Details
                    </Link>
                    <button
                      onClick={() => setDeleteDialog({
                        open: true,
                        id: analysis.id,
                        title: analysis.title || analysis.stadt || 'Diese Analyse'
                      })}
                      className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all"
                      title="Löschen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, title: '' })}
        onConfirm={() => deleteAnalysis(deleteDialog.id)}
        title="Analyse löschen?"
        message={`Möchten Sie "${deleteDialog.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmText="Löschen"
        cancelText="Abbrechen"
        variant="danger"
      />
    </div>
  );
}

export default Library;
