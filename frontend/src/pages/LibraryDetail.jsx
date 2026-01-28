import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnalysisResult from '../components/AnalysisResult';
import ProjectionCharts from '../components/ProjectionCharts';
import ScenarioSimulator from '../components/ScenarioSimulator';
import FairPriceCalculator from '../components/FairPriceCalculator';
import AIChat from '../components/AIChat';
import ConfirmDialog from '../components/ConfirmDialog';

function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', notes: '' });
  const [activeTool, setActiveTool] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
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
    } finally {
      setShowDeleteDialog(false);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="p-8 bg-mesh-animated min-h-screen relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        </div>
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 relative z-10">
          <div className="w-16 h-16 spinner-neon rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary text-lg">Lade Analyse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-mesh-animated min-h-screen relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="glow-orb w-96 h-96 bg-red-500/10 -top-48 -right-48" />
        </div>
        <div className="glass-card rounded-2xl p-12 text-center border border-red-500/30 relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 btn-neon font-bold rounded-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zuruck zur Library
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
      </div>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative z-10 fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/library"
              className="w-12 h-12 glass-neon rounded-xl flex items-center justify-center transition-all hover:border-neon-blue/50"
            >
              <svg className="w-6 h-6 text-text-secondary hover:text-neon-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="text-2xl font-bold text-white bg-transparent border-b-2 border-neon-blue focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-gradient-neon">{analysis.title || `${analysis.stadt || 'Unbekannt'} - Analyse`}</span>
                </h1>
              )}
              <p className="text-text-secondary text-sm mt-1">
                Erstellt am {formatDate(analysis.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                analysis.is_favorite
                  ? 'bg-accent/20 border-accent/50 text-accent'
                  : 'glass-neon text-text-muted hover:text-accent hover:border-accent/50'
              }`}
            >
              <svg
                className={`w-6 h-6 ${analysis.is_favorite ? 'fill-current' : ''}`}
                fill={analysis.is_favorite ? 'currentColor' : 'none'}
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
                  className="px-4 py-2 bg-neon-green/20 border border-neon-green/50 text-neon-green font-semibold rounded-xl hover:bg-neon-green/30 transition-all"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 glass-neon text-text-secondary rounded-xl hover:text-white transition-all"
                >
                  Abbrechen
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-12 h-12 glass-neon rounded-xl flex items-center justify-center transition-all hover:border-neon-blue/50"
              >
                <svg className="w-5 h-5 text-text-secondary hover:text-neon-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="w-12 h-12 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Notes Section */}
        {isEditing ? (
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">Notizen</label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              placeholder="Notizen zur Analyse..."
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder:text-text-muted"
            />
          </div>
        ) : analysis.notes && (
          <div className="mt-4 p-4 bg-neon-blue/10 rounded-xl border border-neon-blue/30">
            <p className="text-sm font-medium text-neon-blue mb-1">Notizen:</p>
            <p className="text-text-secondary">{analysis.notes}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Verwendungszweck</p>
            <p className="font-bold text-neon-blue capitalize">
              {analysis.verwendungszweck === 'kapitalanlage' ? 'Kapitalanlage' : 'Eigennutzung'}
            </p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Kaufpreis</p>
            <p className="font-bold text-neon-green">
              {formatCurrency(analysis.kaufpreis)}
            </p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Eigenkapital</p>
            <p className="font-bold text-neon-purple">
              {formatCurrency(analysis.eigenkapital)}
            </p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-text-muted mb-1">Finanzierung</p>
            <p className="font-bold text-accent">
              {analysis.zinssatz}% / {analysis.tilgung}%
            </p>
          </div>
        </div>
      </div>

      {/* Profi-Tools Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 relative z-10 fade-in fade-in-delay-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center border border-neon-blue/30 text-lg">
              🛠️
            </span>
            Profi-Tools für diese Analyse
          </h3>
          {activeTool && (
            <button
              onClick={() => setActiveTool(null)}
              className="text-text-secondary hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              Schließen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tool Selector */}
        {!activeTool && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTool('projection')}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all group text-left"
            >
              <span className="text-2xl mb-2 block">📈</span>
              <h4 className="font-bold text-white group-hover:text-neon-green transition-colors">30-Jahre-Projektion</h4>
              <p className="text-xs text-text-muted mt-1">Cashflow & Vermögen über Zeit</p>
            </button>
            <button
              onClick={() => setActiveTool('scenario')}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all group text-left"
            >
              <span className="text-2xl mb-2 block">🔮</span>
              <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors">Szenarien-Simulator</h4>
              <p className="text-xs text-text-muted mt-1">"Was wäre wenn" Analysen</p>
            </button>
            <button
              onClick={() => setActiveTool('fairprice')}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/30 hover:bg-accent/5 transition-all group text-left"
            >
              <span className="text-2xl mb-2 block">⚖️</span>
              <h4 className="font-bold text-white group-hover:text-accent transition-colors">Fairer Preis</h4>
              <p className="text-xs text-text-muted mt-1">Marktwert & Verhandlungsziel</p>
            </button>
            <button
              onClick={() => setActiveTool('chat')}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/30 hover:bg-neon-blue/5 transition-all group text-left"
            >
              <span className="text-2xl mb-2 block">🤖</span>
              <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">AI Berater</h4>
              <p className="text-xs text-text-muted mt-1">Fragen zu dieser Immobilie</p>
            </button>
          </div>
        )}

        {/* Active Tool Content */}
        {activeTool === 'projection' && (
          <div className="border-t border-white/10 pt-6 mt-4">
            <ProjectionCharts analysisData={{
              kaufpreis: analysis.kaufpreis,
              kaltmiete: analysis.kaltmiete,
              hausgeld: analysis.hausgeld,
              wohnflaeche: analysis.wohnflaeche,
              vergleichspreisProQm: analysis.analysis_result?.kennzahlen?.preis_pro_qm || 3500
            }} />
          </div>
        )}

        {activeTool === 'scenario' && (
          <div className="border-t border-white/10 pt-6 mt-4">
            <ScenarioSimulator analysisData={{
              kaufpreis: analysis.kaufpreis,
              kaltmiete: analysis.kaltmiete,
              hausgeld: analysis.hausgeld
            }} />
          </div>
        )}

        {activeTool === 'fairprice' && (
          <div className="border-t border-white/10 pt-6 mt-4">
            <FairPriceCalculator analysisData={{
              kaufpreis: analysis.kaufpreis,
              kaltmiete: analysis.kaltmiete,
              hausgeld: analysis.hausgeld,
              wohnflaeche: analysis.wohnflaeche,
              vergleichspreisProQm: analysis.analysis_result?.kennzahlen?.preis_pro_qm || 3500
            }} />
          </div>
        )}

        {activeTool === 'chat' && (
          <div className="border-t border-white/10 pt-6 mt-4 h-96">
            <AIChat analysisContext={{
              kaufpreis: analysis.kaufpreis,
              kaltmiete: analysis.kaltmiete,
              stadt: analysis.stadt,
              eigenkapital: analysis.eigenkapital,
              gesamtscore: analysis.gesamtscore
            }} />
          </div>
        )}
      </div>

      {/* Full Analysis Result with all Charts */}
      {analysis.analysis_result && (
        <div className="relative z-10">
          <AnalysisResult
            result={analysis.analysis_result}
            propertyData={analysis.property_data}
            onNewAnalysis={() => navigate('/analyze')}
            onEditData={() => navigate('/analyze', { state: { prefill: analysis.property_data } })}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Analyse löschen"
        message="Möchten Sie diese Analyse wirklich unwiderruflich löschen?"
        confirmText="Löschen"
        variant="danger"
      />
    </div>
  );
}

export default LibraryDetail;
