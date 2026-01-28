import React from 'react';

function LoadingState({ message }) {
  return (
    <div className="glass-card rounded-3xl p-16 text-center fade-in border border-white/10">
      <div className="w-32 h-32 mx-auto mb-8 relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full"></div>
        {/* Spinning ring with neon glow */}
        <div className="absolute inset-0 border-4 border-transparent border-t-neon-blue border-r-neon-purple rounded-full animate-spin" style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}></div>
        {/* Inner glow */}
        <div className="absolute inset-4 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full blur-xl"></div>
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-neon-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-white mb-3">
        <span className="text-gradient-neon">{message || 'KI analysiert...'}</span>
      </h3>

      <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
        AmlakI verarbeitet die Immobiliendaten und erstellt Ihre individuelle Bewertung.
      </p>

      {/* Progress steps */}
      <div className="mt-12 max-w-lg mx-auto">
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="flex flex-col items-center gap-2">
            <span className="w-4 h-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-pulse shadow-neon-blue"></span>
            <span className="font-medium text-neon-blue">Daten prufen</span>
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="w-4 h-4 bg-white/20 rounded-full"></span>
            <span className="font-medium text-text-muted">Marktvergleich</span>
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="w-4 h-4 bg-white/20 rounded-full"></span>
            <span className="font-medium text-text-muted">Bewertung</span>
          </span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-pulse"
            style={{ width: '33%', boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}
          ></div>
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

export default LoadingState;
