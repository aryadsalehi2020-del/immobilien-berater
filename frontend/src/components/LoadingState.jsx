import React, { useState, useEffect } from 'react';

// Coole Immobilien-Fakten für Deutschland
const IMMOBILIEN_FAKTEN = [
  {
    icon: '🏙️',
    title: 'München ist Spitzenreiter',
    fact: 'Die Immobilienpreise in München sind in den letzten 10 Jahren um über 150% gestiegen. Der durchschnittliche Quadratmeterpreis liegt bei über 9.000€.',
    color: 'neon-blue'
  },
  {
    icon: '🏠',
    title: 'Deutsche mieten gerne',
    fact: 'Nur etwa 50% der Deutschen besitzen Wohneigentum - eine der niedrigsten Quoten in Europa. In der Schweiz sind es sogar nur 36%.',
    color: 'neon-purple'
  },
  {
    icon: '📈',
    title: 'Wertsteigerung seit 2010',
    fact: 'Deutsche Immobilien haben seit 2010 durchschnittlich 75% an Wert gewonnen. In Großstädten sogar über 100%.',
    color: 'neon-green'
  },
  {
    icon: '🎂',
    title: 'Späte Käufer',
    fact: 'Das Durchschnittsalter beim ersten Immobilienkauf in Deutschland liegt bei 40 Jahren - deutlich höher als in anderen Ländern.',
    color: 'accent'
  },
  {
    icon: '💰',
    title: 'Billionen-Markt',
    fact: 'Der deutsche Immobilienmarkt ist über 15 Billionen Euro wert und damit einer der größten und stabilsten weltweit.',
    color: 'neon-blue'
  },
  {
    icon: '🏢',
    title: 'Berlin-Boom',
    fact: 'Berlin war vor 15 Jahren eine der günstigsten Hauptstädte Europas. Heute sind die Preise um über 200% gestiegen.',
    color: 'neon-purple'
  },
  {
    icon: '📊',
    title: 'Mietbelastung',
    fact: 'Deutsche Haushalte geben durchschnittlich 27% ihres Einkommens für Miete aus. In München sind es oft über 35%.',
    color: 'neon-green'
  },
  {
    icon: '🏗️',
    title: '42 Millionen Wohnungen',
    fact: 'In Deutschland gibt es etwa 42 Millionen Wohneinheiten. Jährlich werden nur ca. 300.000 neue Wohnungen gebaut.',
    color: 'accent'
  },
  {
    icon: '⚡',
    title: 'Energieeffizienz zahlt sich aus',
    fact: 'Immobilien mit Energieklasse A+ erzielen bis zu 20% höhere Verkaufspreise als vergleichbare Objekte mit schlechter Energiebilanz.',
    color: 'neon-blue'
  },
  {
    icon: '🌆',
    title: 'Frankfurt führt bei Mieten',
    fact: 'Frankfurt am Main hat mit durchschnittlich 16€/m² die höchsten Büromieten Deutschlands - vor München und Berlin.',
    color: 'neon-purple'
  },
  {
    icon: '🏘️',
    title: 'Eigenkapital ist König',
    fact: 'Mit 20% Eigenkapital bekommen Sie in der Regel 0,3-0,5% bessere Zinskonditionen als bei einer 100%-Finanzierung.',
    color: 'neon-green'
  },
  {
    icon: '📉',
    title: 'Zinswende 2022',
    fact: 'Die Bauzinsen sind 2022 von unter 1% auf über 4% gestiegen - der schnellste Anstieg seit den 1990er Jahren.',
    color: 'accent'
  },
  {
    icon: '🏛️',
    title: 'Nebenkosten nicht vergessen',
    fact: 'Die Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler) betragen je nach Bundesland zwischen 10-15% des Kaufpreises.',
    color: 'neon-blue'
  },
  {
    icon: '🔮',
    title: 'Langfristig stabil',
    fact: 'In den letzten 50 Jahren gab es in Deutschland nur eine Phase mit sinkenden Immobilienpreisen (2008-2009).',
    color: 'neon-purple'
  },
  {
    icon: '🏡',
    title: 'Rendite-Realität',
    fact: 'Die durchschnittliche Bruttomietrendite in deutschen Großstädten liegt bei 3-4%. In B- und C-Lagen sind 5-7% möglich.',
    color: 'neon-green'
  }
];

function LoadingState({ message }) {
  const [currentFactIndex, setCurrentFactIndex] = useState(() =>
    Math.floor(Math.random() * IMMOBILIEN_FAKTEN.length)
  );
  const [fadeState, setFadeState] = useState('in');

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeState('out');

      // After fade out, change fact and fade in
      setTimeout(() => {
        setCurrentFactIndex((prev) => (prev + 1) % IMMOBILIEN_FAKTEN.length);
        setFadeState('in');
      }, 300);
    }, 7000); // 7 Sekunden - mehr Zeit zum Lesen

    return () => clearInterval(interval);
  }, []);

  const currentFact = IMMOBILIEN_FAKTEN[currentFactIndex];

  const getColorClasses = (color) => {
    const colors = {
      'neon-blue': 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue',
      'neon-purple': 'border-neon-purple/30 bg-neon-purple/10 text-neon-purple',
      'neon-green': 'border-neon-green/30 bg-neon-green/10 text-neon-green',
      'accent': 'border-accent/30 bg-accent/10 text-accent'
    };
    return colors[color] || colors['neon-blue'];
  };

  return (
    <div className="glass-card rounded-3xl p-12 text-center fade-in border border-white/10">
      <div className="w-28 h-28 mx-auto mb-6 relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full"></div>
        {/* Spinning ring with neon glow */}
        <div className="absolute inset-0 border-4 border-transparent border-t-neon-blue border-r-neon-purple rounded-full animate-spin" style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}></div>
        {/* Inner glow */}
        <div className="absolute inset-4 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full blur-xl"></div>
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-neon-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        <span className="text-gradient-neon">{message || 'KI analysiert...'}</span>
      </h3>

      <p className="text-text-secondary text-base max-w-md mx-auto leading-relaxed mb-8">
        AmlakI verarbeitet die Immobiliendaten und erstellt Ihre individuelle Bewertung.
      </p>

      {/* Progress steps */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="flex flex-col items-center gap-2">
            <span className="w-4 h-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full animate-pulse shadow-neon-blue"></span>
            <span className="font-medium text-neon-blue">Daten prüfen</span>
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

      {/* Cool Fact Card */}
      <div
        className={`max-w-xl mx-auto p-6 rounded-2xl border ${getColorClasses(currentFact.color)} transition-all duration-300 ${
          fadeState === 'out' ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">{currentFact.icon}</span>
          <div className="text-left flex-1">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">Wusstest du?</p>
            <h4 className="font-bold text-white text-lg mb-2">{currentFact.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{currentFact.fact}</p>
          </div>
        </div>
      </div>

      {/* Fact indicator dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {IMMOBILIEN_FAKTEN.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentFactIndex % 5
                ? 'bg-neon-blue w-4'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Animated dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

export default LoadingState;
