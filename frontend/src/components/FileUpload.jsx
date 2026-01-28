import React, { useState, useRef, useCallback } from 'react';

function FileUpload({ onFileUpload, onManualEntry }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  }, [selectedFile, onFileUpload]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fade-in">
      <div className="glass-card rounded-3xl p-10 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          <span className="text-gradient-neon">Expose hochladen</span>
        </h2>
        <p className="text-text-secondary text-center mb-8">Starten Sie mit der intelligenten Analyse</p>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
            ${isDragging
              ? 'border-neon-blue bg-neon-blue/10 scale-[1.02] shadow-neon-blue'
              : 'border-white/20 hover:border-neon-blue/50 hover:bg-white/5'}
            ${selectedFile ? 'border-neon-green bg-neon-green/10' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neon-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{selectedFile.name}</p>
                <p className="text-sm text-text-secondary mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
              <p className="text-sm text-neon-green">Datei bereit - Klicken zum Ändern</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="w-20 h-20 mx-auto bg-neon-blue/20 rounded-2xl flex items-center justify-center border border-neon-blue/30">
                <svg className="w-10 h-10 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white text-lg">
                  PDF-Expose hier ablegen
                </p>
                <p className="text-sm text-text-secondary mt-2">
                  oder klicken zum Durchsuchen
                </p>
                <p className="text-xs text-text-muted mt-3">
                  Maximal 10 MB - Unterstutzt PDF-Format
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {selectedFile && (
          <button
            onClick={handleUploadClick}
            className="mt-8 w-full py-5 btn-neon font-bold rounded-2xl text-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Exposé analysieren
            </span>
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-6 text-sm text-text-muted font-medium">oder</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* Manual Entry */}
        <button
          onClick={onManualEntry}
          className="w-full py-5 glass-neon font-semibold rounded-2xl text-lg text-white hover:bg-neon-purple/20 transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Daten manuell eingeben
          </span>
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="glass-card rounded-2xl p-6 border border-neon-blue/20 card-3d fade-in fade-in-delay-1">
          <div className="w-14 h-14 bg-neon-blue/20 rounded-xl flex items-center justify-center mb-4 shadow-neon-blue">
            <svg className="w-7 h-7 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-bold text-white mb-2 text-lg">Transparente Regeln</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Klare Bewertungskriterien und nachvollziehbare Scores</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-neon-purple/20 card-3d fade-in fade-in-delay-2">
          <div className="w-14 h-14 bg-neon-purple/20 rounded-xl flex items-center justify-center mb-4 shadow-neon-purple">
            <svg className="w-7 h-7 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-bold text-white mb-2 text-lg">Unabhangig</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Objektive Analyse ohne Interessenskonflikte</p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-neon-green/20 card-3d fade-in fade-in-delay-3">
          <div className="w-14 h-14 bg-neon-green/20 rounded-xl flex items-center justify-center mb-4" style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
            <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-white mb-2 text-lg">KI-Powered</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Intelligente Analyse in Sekundenschnelle</p>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
