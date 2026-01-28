import React from 'react';

function LoadingState({ message }) {
  return (
    <div className="glass-light rounded-3xl shadow-2xl p-16 text-center fade-in">
      <div className="w-32 h-32 mx-auto mb-8 relative">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-slate/20 rounded-full"></div>
        {/* Spinning ring with gradient */}
        <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full spinner animate-glow"></div>
        {/* Inner glow */}
        <div className="absolute inset-3 bg-accent/10 rounded-full blur-xl"></div>
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-accent animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-primary mb-3">
        {message || 'KI analysiert...'}
      </h3>

      <p className="text-slate text-lg max-w-md mx-auto leading-relaxed">
        AmlakI verarbeitet die Immobiliendaten und erstellt Ihre individuelle Bewertung.
      </p>

      {/* Progress steps */}
      <div className="mt-12 max-w-lg mx-auto">
        <div className="flex items-center justify-between text-sm text-slate/70 mb-4">
          <span className="flex flex-col items-center gap-2">
            <span className="w-3 h-3 bg-gradient-gold rounded-full animate-pulse shadow-lg"></span>
            <span className="font-medium">Daten prüfen</span>
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="w-3 h-3 bg-slate/30 rounded-full"></span>
            <span className="font-medium">Marktvergleich</span>
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="w-3 h-3 bg-slate/30 rounded-full"></span>
            <span className="font-medium">Bewertung</span>
          </span>
        </div>
        <div className="h-2 bg-slate/10 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-gold rounded-full animate-pulse shadow-lg" style={{ width: '33%' }}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
