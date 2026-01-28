import React, { useState, useCallback } from 'react';
import FileUpload from '../components/FileUpload';
import PropertyForm from '../components/PropertyForm';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'http://localhost:8000';

function Analyze() {
  const [step, setStep] = useState('upload'); // upload, form, analyzing, result
  const [propertyData, setPropertyData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { token } = useAuth();

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
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {step === 'upload' && (
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Neue Analyse
            </h1>
            <p className="text-lg text-slate max-w-2xl mx-auto">
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
      </div>
    </div>
  );
}

export default Analyze;
