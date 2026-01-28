import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnalysisResult from '../components/AnalysisResult';

function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', notes: '' });

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        setEditForm({ title: data.title || '', notes: data.notes || '' });
      } else if (response.status === 404) {
        setError('Analyse nicht gefunden');
      } else {
        setError('Fehler beim Laden der Analyse');
      }
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
      setError('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: !analysis.is_favorite })
      });

      if (response.ok) {
        setAnalysis({ ...analysis, is_favorite: !analysis.is_favorite });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = await response.json();
        setAnalysis(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const deleteAnalysis = async () => {
    if (!confirm('Möchten Sie diese Analyse wirklich löschen?')) return;

    try {
      const response = await fetch(`http://localhost:8000/library/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        navigate('/library');
      }
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="glass-light rounded-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate text-lg">Lade Analyse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="glass-light rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{error}</h3>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-gold text-primary font-bold rounded-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="glass-light rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/library"
              className="w-12 h-12 bg-slate/10 hover:bg-slate/20 rounded-xl flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Titel eingeben..."
                  className="text-2xl font-bold text-primary bg-transparent border-b-2 border-accent focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-primary">
                  {analysis.title || `${analysis.stadt || 'Unbekannt'} - Analyse`}
                </h1>
              )}
              <p className="text-slate text-sm mt-1">
                Erstellt am {formatDate(analysis.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                analysis.is_favorite
                  ? 'bg-yellow-100 text-yellow-500'
                  : 'bg-slate/10 hover:bg-slate/20 text-slate'
              }`}
            >
              <svg
                className={`w-6 h-6 ${analysis.is_favorite ? 'fill-current' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            {/* Edit/Save Button */}
            {isEditing ? (
              <>
                <button
                  onClick={saveChanges}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border-2 border-slate/30 text-slate rounded-xl hover:border-slate transition-all"
                >
                  Abbrechen
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-12 h-12 bg-slate/10 hover:bg-slate/20 rounded-xl flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={deleteAnalysis}
              className="w-12 h-12 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Notes Section */}
        {isEditing ? (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate mb-2">Notizen</label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              placeholder="Notizen zur Analyse..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
            />
          </div>
        ) : analysis.notes && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-1">Notizen:</p>
            <p className="text-blue-600">{analysis.notes}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate/10">
          <div className="text-center">
            <p className="text-xs text-slate/60 mb-1">Verwendungszweck</p>
            <p className="font-bold text-primary capitalize">
              {analysis.verwendungszweck === 'kapitalanlage' ? 'Kapitalanlage' : 'Eigennutzung'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate/60 mb-1">Kaufpreis</p>
            <p className="font-bold text-primary">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(analysis.kaufpreis || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate/60 mb-1">Eigenkapital</p>
            <p className="font-bold text-primary">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(analysis.eigenkapital || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate/60 mb-1">Finanzierung</p>
            <p className="font-bold text-primary">
              {analysis.zinssatz}% Zins / {analysis.tilgung}% Tilgung
            </p>
          </div>
        </div>
      </div>

      {/* Full Analysis Result with all Charts */}
      {analysis.analysis_result && (
        <AnalysisResult
          result={analysis.analysis_result}
          propertyData={analysis.property_data}
          onNewAnalysis={() => navigate('/analyze')}
          onEditData={() => navigate('/analyze', { state: { prefill: analysis.property_data } })}
        />
      )}
    </div>
  );
}

export default LibraryDetail;
