import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import PropertyForm from './components/PropertyForm';
import AnalysisResult from './components/AnalysisResult';
import LoadingState from './components/LoadingState';

const API_BASE = 'http://localhost:8000';

function App() {
  const [step, setStep] = useState('upload'); // upload, form, analyzing, result
  const [propertyData, setPropertyData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');

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

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  }, []);

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
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with AmlakI Logo */}
        <header className="text-center mb-16">
          {/* Logo */}
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="relative">
              {/* Building Icon with AI accent */}
              <div className="flex items-end gap-1 mb-2">
                <div className="w-12 h-16 bg-gradient-gold rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-shine animate-shine"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-primary-light rounded-sm"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-primary-light rounded-sm"></div>
                  <div className="absolute top-2 left-2 w-2 h-2 bg-primary-light rounded-sm"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary-light rounded-sm"></div>
                </div>
                <div className="w-8 h-12 bg-accent-light rounded-t-lg"></div>
                <div className="w-10 h-20 bg-gradient-gold rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-shine animate-shine" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight">
            <span className="text-accent text-6xl md:text-8xl">A</span>
            <span className="text-white">mlak</span>
            <span className="text-accent text-6xl md:text-8xl">I</span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-accent mb-4 tracking-wide">
            Immobilien Intelligence
          </p>

          <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full mb-6"></div>

          <p className="text-base md:text-lg text-slate max-w-2xl mx-auto leading-relaxed">
            KI-gestützte Immobilienanalyse mit transparenten Bewertungskriterien.
            <br className="hidden md:block" />
            Premium-Analyse für intelligente Investitionsentscheidungen.
          </p>
        </header>

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
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="glass rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent text-xs font-bold">AI</span>
              </div>
              <span className="text-slate text-sm font-medium">Powered by AmlakI</span>
            </div>
            <p className="text-xs text-slate/70 leading-relaxed">
              Diese Analyse dient zur Orientierung und ersetzt keine professionelle Immobilienbewertung oder Finanzberatung.
              <br />
              Alle Berechnungen basieren auf den bereitgestellten Daten und KI-gestützten Markteinschätzungen.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
