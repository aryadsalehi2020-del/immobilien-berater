import React, { useState, useMemo } from 'react';
import AIChat from '../components/AIChat';
import ProjectionCharts from '../components/ProjectionCharts';
import ScenarioSimulator from '../components/ScenarioSimulator';
import FairPriceCalculator from '../components/FairPriceCalculator';

// Color mapping helper
const getToolColors = (color, isActive) => {
  const colors = {
    'neon-blue': {
      border: isActive ? 'border-neon-blue/50' : 'border-white/10',
      bg: isActive ? 'bg-neon-blue/10' : '',
      iconBg: isActive ? 'bg-neon-blue/20' : 'bg-white/10 group-hover:bg-white/15',
      text: isActive ? 'text-neon-blue' : 'text-white group-hover:text-white',
      dot: 'bg-neon-blue'
    },
    'neon-green': {
      border: isActive ? 'border-neon-green/50' : 'border-white/10',
      bg: isActive ? 'bg-neon-green/10' : '',
      iconBg: isActive ? 'bg-neon-green/20' : 'bg-white/10 group-hover:bg-white/15',
      text: isActive ? 'text-neon-green' : 'text-white group-hover:text-white',
      dot: 'bg-neon-green'
    },
    'neon-purple': {
      border: isActive ? 'border-neon-purple/50' : 'border-white/10',
      bg: isActive ? 'bg-neon-purple/10' : '',
      iconBg: isActive ? 'bg-neon-purple/20' : 'bg-white/10 group-hover:bg-white/15',
      text: isActive ? 'text-neon-purple' : 'text-white group-hover:text-white',
      dot: 'bg-neon-purple'
    },
    'accent': {
      border: isActive ? 'border-accent/50' : 'border-white/10',
      bg: isActive ? 'bg-accent/10' : '',
      iconBg: isActive ? 'bg-accent/20' : 'bg-white/10 group-hover:bg-white/15',
      text: isActive ? 'text-accent' : 'text-white group-hover:text-white',
      dot: 'bg-accent'
    }
  };
  return colors[color] || colors['neon-blue'];
};

function Tools() {
  const [activeTool, setActiveTool] = useState('chat');

  // Demo data for tools
  const demoAnalysis = useMemo(() => ({
    kaufpreis: 320000,
    kaltmiete: 1050,
    hausgeld: 320,
    wohnflaeche: 82,
    vergleichspreisProQm: 3800
  }), []);

  const tools = [
    {
      id: 'chat',
      name: 'AI Berater',
      icon: '🤖',
      description: 'Stellen Sie Fragen zu Immobilien, Finanzierung, Steuern & mehr',
      color: 'neon-blue'
    },
    {
      id: 'projection',
      name: '30-Jahres-Projektion',
      icon: '📈',
      description: 'Cashflow, Vermögensaufbau und Tilgung über Zeit',
      color: 'neon-green'
    },
    {
      id: 'scenario',
      name: 'Szenarien-Simulator',
      icon: '🔮',
      description: '"Was wäre wenn" Analysen für verschiedene Situationen',
      color: 'neon-purple'
    },
    {
      id: 'fairprice',
      name: 'Fairer Preis',
      icon: '⚖️',
      description: 'Berechnen Sie den objektiven Marktwert',
      color: 'accent'
    }
  ];

  return (
    <div className="p-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
        <div className="glow-orb w-64 h-64 bg-neon-green/5 top-1/2 right-1/4" style={{ animationDelay: '10s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-gradient-neon">Profi-Tools</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Mächtige Werkzeuge für fundierte Immobilienentscheidungen
          </p>
        </div>

        {/* Tool Selector Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 fade-in fade-in-delay-1">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;
            const colors = getToolColors(tool.color, isActive);
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`glass-card rounded-2xl p-5 border text-left transition-all group ${colors.border} ${colors.bg} ${!isActive ? 'hover:border-white/20' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors.iconBg}`}>
                    {tool.icon}
                  </span>
                  {isActive && (
                    <span className={`w-2 h-2 rounded-full animate-pulse ${colors.dot}`} />
                  )}
                </div>
                <h3 className={`font-bold mb-1 ${colors.text}`}>
                  {tool.name}
                </h3>
                <p className="text-sm text-text-muted">{tool.description}</p>
              </button>
            );
          })}
        </div>

        {/* Active Tool Content */}
        <div className="fade-in fade-in-delay-2">
          {activeTool === 'chat' && (
            <div className="glass-card rounded-2xl border border-neon-blue/20 overflow-hidden" style={{ height: '600px' }}>
              <AIChat />
            </div>
          )}

          {activeTool === 'projection' && (
            <div className="glass-card rounded-2xl p-6 border border-neon-green/20">
              <ProjectionCharts analysisData={demoAnalysis} />
            </div>
          )}

          {activeTool === 'scenario' && (
            <div className="glass-card rounded-2xl p-6 border border-neon-purple/20">
              <ScenarioSimulator analysisData={demoAnalysis} />
            </div>
          )}

          {activeTool === 'fairprice' && (
            <div className="glass-card rounded-2xl p-6 border border-accent/20">
              <FairPriceCalculator analysisData={demoAnalysis} />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="glass-card rounded-xl p-5 border border-white/10 fade-in fade-in-delay-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              💡
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Tipp: Verwenden Sie echte Analysedaten</h4>
              <p className="text-text-secondary text-sm">
                Diese Tools arbeiten mit Demo-Daten. Für präzisere Ergebnisse öffnen Sie eine gespeicherte Analyse
                aus der Library und nutzen Sie die Tools dort mit Ihren echten Immobiliendaten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tools;
