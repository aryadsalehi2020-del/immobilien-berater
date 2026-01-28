import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Library() {
  const { token } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, favorites
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Library</h1>
          <p className="text-slate text-lg">
            {analyses.length} gespeicherte Analyse{analyses.length !== 1 ? 'n' : ''}
          </p>
        </div>
        <Link
          to="/analyze"
          className="px-6 py-3 bg-gradient-gold text-primary font-bold rounded-xl btn-premium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Neue Analyse
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-light rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Suche nach Titel oder Stadt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-gold text-primary'
                  : 'border-2 border-slate/30 text-slate hover:border-accent hover:text-accent'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === 'favorites'
                  ? 'bg-gradient-gold text-primary'
                  : 'border-2 border-slate/30 text-slate hover:border-accent hover:text-accent'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Favoriten
            </button>
          </div>
        </div>
      </div>

      {/* Analyses Grid */}
      {loading ? (
        <div className="glass-light rounded-2xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate">Lade Analysen...</p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="glass-light rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            {searchTerm || filter === 'favorites' ? 'Keine Ergebnisse' : 'Noch keine Analysen'}
          </h3>
          <p className="text-slate mb-6">
            {searchTerm
              ? 'Versuchen Sie einen anderen Suchbegriff'
              : filter === 'favorites'
              ? 'Markieren Sie Analysen als Favoriten'
              : 'Starten Sie Ihre erste Immobilienbewertung'}
          </p>
          {!searchTerm && filter === 'all' && (
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary font-bold rounded-xl btn-premium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Erste Analyse erstellen
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="glass-light rounded-2xl p-6 card-hover relative"
            >
              {/* Favorite Badge */}
              <button
                onClick={() => toggleFavorite(analysis.id, analysis.is_favorite)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
              >
                <svg
                  className={`w-6 h-6 ${analysis.is_favorite ? 'text-yellow-500 fill-current' : 'text-slate'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>

              {/* Score Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-gold rounded-lg shadow-lg">
                <span className="text-primary font-bold text-sm">
                  {Math.round(analysis.gesamtscore || 0)}
                </span>
              </div>

              {/* Content */}
              <div className="mt-12 mb-4">
                <h3 className="font-bold text-primary text-lg mb-2 line-clamp-2">
                  {analysis.title || `${analysis.stadt || 'Unbekannt'}`}
                </h3>
                <div className="space-y-2 text-sm text-slate">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {analysis.stadt}, {analysis.stadtteil || ''}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatCurrency(analysis.kaufpreis)}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex-1 py-3 bg-accent/10 text-accent hover:bg-accent/20 font-semibold rounded-xl transition-all text-center text-sm"
                >
                  Details
                </Link>
                <button
                  onClick={() => deleteAnalysis(analysis.id)}
                  className="px-4 py-3 border-2 border-red-200/30 text-red-400 hover:bg-red-50/10 rounded-xl transition-all"
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
