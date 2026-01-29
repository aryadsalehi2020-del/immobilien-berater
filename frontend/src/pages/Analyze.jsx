import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import PropertyForm from '../components/PropertyForm';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, INVESTMENT_GOALS } from '../contexts/UserProfileContext';

const API_BASE = 'http://localhost:8000';

function Analyze() {
  const [step, setStep] = useState('upload'); // upload, form, analyzing, result
  const [propertyData, setPropertyData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [lastFinanzierung, setLastFinanzierung] = useState(null);
  const [lastVerwendungszweck, setLastVerwendungszweck] = useState(null);
  const { token } = useAuth();
  const { profile: investorProfile, isProfileComplete } = useUserProfile();

  const handleFileUpload = useCallback(async (file) => {
    setError(null);
    setStep('analyzing');
    setLoadingMessage('Exposé wird analysiert...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/extract-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler beim Analysieren des Exposés');
      }

      const data = await response.json();
      setPropertyData(data);
      setStep('form');
    } catch (err) {
      setError(err.message);
      setStep('upload');
    }
  }, []);

  const handleManualEntry = useCallback(() => {
    setPropertyData({});
    setStep('form');
  }, []);

  const handleAnalyze = useCallback(async (formData, verwendungszweck, finanzierung) => {
    setError(null);
    setStep('analyzing');
    setLoadingMessage('Immobilie wird bewertet...');

    // Speichere für spätere Neu-Analyse
    setLastVerwendungszweck(verwendungszweck);
    setLastFinanzierung(finanzierung);
    setPropertyData(formData);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_data: formData,
          verwendungszweck,
          eigenkapital: finanzierung.eigenkapital,
          zinssatz: finanzierung.zinssatz,
          tilgung: finanzierung.tilgung,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler bei der Analyse');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('form');
    }
  }, [token]);

  // Neu-Analyse mit anderem Verwendungszweck
  const handleSwitchVerwendungszweck = useCallback(async (newVerwendungszweck) => {
    if (!propertyData || !lastFinanzierung) return;

    setError(null);
    setStep('analyzing');
    setLoadingMessage(newVerwendungszweck === 'kapitalanlage'
      ? 'Bewerte als Kapitalanlage...'
      : 'Bewerte als Eigennutzung...');
    setLastVerwendungszweck(newVerwendungszweck);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_data: propertyData,
          verwendungszweck: newVerwendungszweck,
          eigenkapital: lastFinanzierung.eigenkapital,
          zinssatz: lastFinanzierung.zinssatz,
          tilgung: lastFinanzierung.tilgung,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler bei der Analyse');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setStep('result');
    } catch (err) {
      setError(err.message);
    }
  }, [propertyData, lastFinanzierung, token]);

  // NEU: Neu-Analyse mit geändertem Eigenkapital
  const handleChangeEigenkapital = useCallback(async (neuesEigenkapital) => {
    if (!propertyData || !lastVerwendungszweck) return;

    setError(null);
    setStep('analyzing');
    setLoadingMessage(`Berechne mit ${neuesEigenkapital.toLocaleString('de-DE')}€ Eigenkapital...`);

    // Update lastFinanzierung
    const updatedFinanzierung = {
      ...lastFinanzierung,
      eigenkapital: neuesEigenkapital
    };
    setLastFinanzierung(updatedFinanzierung);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_data: propertyData,
          verwendungszweck: lastVerwendungszweck,
          eigenkapital: neuesEigenkapital,
          zinssatz: lastFinanzierung?.zinssatz || 3.75,
          tilgung: lastFinanzierung?.tilgung || 1.25,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler bei der Analyse');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setStep('result');
    } catch (err) {
      setError(err.message);
    }
  }, [propertyData, lastVerwendungszweck, lastFinanzierung, token]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setPropertyData(null);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleBackToForm = useCallback(() => {
    setStep('form');
    setAnalysisResult(null);
  }, []);

  return (
    <div className="p-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
        <div className="glow-orb w-64 h-64 bg-neon-green/5 top-1/2 right-1/4" style={{ animationDelay: '10s' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        {step === 'upload' && (
          <header className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              <span className="text-gradient-neon">Neue Analyse</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Laden Sie ein Exposé hoch oder geben Sie die Daten manuell ein
            </p>
          </header>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 glass border-2 border-red-500/30 rounded-2xl text-red-300 fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-red-200">Fehler</span>
                <p className="text-sm text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Investor Profile Prompt */}
        {step === 'upload' && !isProfileComplete && (
          <Link
            to="/profile"
            className="mb-8 glass-card rounded-2xl p-6 border-2 border-accent/30 fade-in block hover:border-accent/50 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <p className="text-accent font-semibold mb-1">Personalisierte Bewertung aktivieren</p>
                <p className="text-text-secondary text-sm">
                  Richte dein Investoren-Profil ein für Scores, die auf dein Ziel optimiert sind.
                </p>
              </div>
              <span className="px-4 py-2 bg-accent/20 border border-accent/30 text-accent rounded-xl font-medium group-hover:bg-accent/30 transition-all text-sm flex items-center gap-2">
                Jetzt einrichten
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        )}

        {/* Active Profile Badge */}
        {step === 'upload' && isProfileComplete && (
          <div className="mb-8 glass-card rounded-xl p-4 border border-neon-green/30 fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-green/10 rounded-lg border border-neon-green/30">
                <span>{INVESTMENT_GOALS[investorProfile.goal]?.icon}</span>
                <span className="text-neon-green font-semibold text-sm">{INVESTMENT_GOALS[investorProfile.goal]?.label}</span>
              </div>
              <p className="text-text-secondary text-sm flex-1">
                Scores werden personalisiert
              </p>
              <Link
                to="/profile"
                className="text-neon-blue hover:text-neon-purple text-sm font-medium transition-colors"
              >
                Ändern
              </Link>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          {step === 'upload' && (
            <FileUpload
              onFileUpload={handleFileUpload}
              onManualEntry={handleManualEntry}
            />
          )}

          {step === 'form' && (
            <PropertyForm
              initialData={propertyData}
              onAnalyze={handleAnalyze}
              onBack={handleReset}
            />
          )}

          {step === 'analyzing' && (
            <LoadingState message={loadingMessage} />
          )}

          {step === 'result' && analysisResult && (
            <AnalysisResult
              result={analysisResult}
              propertyData={propertyData}
              onNewAnalysis={handleReset}
              onEditData={handleBackToForm}
              onSwitchVerwendungszweck={handleSwitchVerwendungszweck}
              onChangeEigenkapital={handleChangeEigenkapital}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Analyze;
