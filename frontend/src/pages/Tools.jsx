import React, { useState, useEffect } from 'react';
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

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Reusable Input Panel Component
function ToolInputPanel({ data, onChange, color = 'neon-blue', showFinancing = true }) {
  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/30";
  const labelClass = "text-xs text-text-muted mb-1 block";

  return (
    <div className={`glass-card rounded-xl p-4 border border-${color}/20 mb-4`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span>⚙️</span> Basisdaten anpassen
        </h4>
        <button
          onClick={() => onChange({
            kaufpreis: 320000,
            kaltmiete: 1050,
            hausgeld: 320,
            wohnflaeche: 82,
            eigenkapital: 50000,
            zinssatz: 3.75,
            tilgung: 1.5,
            vergleichspreisProQm: 3800
          })}
          className="text-xs text-text-muted hover:text-neon-blue transition-colors"
        >
          Zurücksetzen
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Kaufpreis */}
        <div>
          <label className={labelClass}>Kaufpreis (€)</label>
          <input
            type="number"
            value={data.kaufpreis}
            onChange={(e) => onChange({ ...data, kaufpreis: parseFloat(e.target.value) || 0 })}
            className={inputClass}
            step="10000"
          />
        </div>

        {/* Wohnfläche */}
        <div>
          <label className={labelClass}>Wohnfläche (m²)</label>
          <input
            type="number"
            value={data.wohnflaeche}
            onChange={(e) => onChange({ ...data, wohnflaeche: parseFloat(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>

        {/* Kaltmiete */}
        <div>
          <label className={labelClass}>Kaltmiete (€/Monat)</label>
          <input
            type="number"
            value={data.kaltmiete}
            onChange={(e) => onChange({ ...data, kaltmiete: parseFloat(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>

        {/* Hausgeld */}
        <div>
          <label className={labelClass}>Hausgeld (€/Monat)</label>
          <input
            type="number"
            value={data.hausgeld}
            onChange={(e) => onChange({ ...data, hausgeld: parseFloat(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>

        {showFinancing && (
          <>
            {/* Eigenkapital */}
            <div>
              <label className={labelClass}>Eigenkapital (€)</label>
              <input
                type="number"
                value={data.eigenkapital}
                onChange={(e) => onChange({ ...data, eigenkapital: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                step="5000"
              />
            </div>

            {/* Zinssatz */}
            <div>
              <label className={labelClass}>Zinssatz (%)</label>
              <input
                type="number"
                value={data.zinssatz}
                onChange={(e) => onChange({ ...data, zinssatz: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                step="0.1"
                min="0"
                max="15"
              />
            </div>

            {/* Tilgung */}
            <div>
              <label className={labelClass}>Tilgung (%)</label>
              <input
                type="number"
                value={data.tilgung}
                onChange={(e) => onChange({ ...data, tilgung: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                step="0.25"
                min="0"
                max="10"
              />
            </div>

            {/* Marktpreis/m² */}
            <div>
              <label className={labelClass}>Marktpreis (€/m²)</label>
              <input
                type="number"
                value={data.vergleichspreisProQm}
                onChange={(e) => onChange({ ...data, vergleichspreisProQm: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                step="100"
              />
            </div>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-xs text-text-muted">Preis/m²</p>
          <p className="text-sm font-bold text-white">
            {data.wohnflaeche > 0 ? formatCurrency(data.kaufpreis / data.wohnflaeche) : '-'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">Bruttorendite</p>
          <p className="text-sm font-bold text-neon-green">
            {data.kaufpreis > 0 ? ((data.kaltmiete * 12 / data.kaufpreis) * 100).toFixed(2) : '0'}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">Kaufpreisfaktor</p>
          <p className="text-sm font-bold text-accent">
            {data.kaltmiete > 0 ? (data.kaufpreis / (data.kaltmiete * 12)).toFixed(1) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Tools() {
  const [activeTool, setActiveTool] = useState('chat');
  const [showInputPanel, setShowInputPanel] = useState(true);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Separate state for each tool's data
  const [projectionData, setProjectionData] = useState({
    kaufpreis: 320000,
    kaltmiete: 1050,
    hausgeld: 320,
    wohnflaeche: 82,
    eigenkapital: 50000,
    zinssatz: 3.75,
    tilgung: 1.5,
    vergleichspreisProQm: 3800
  });

  const [scenarioData, setScenarioData] = useState({
    kaufpreis: 280000,
    kaltmiete: 950,
    hausgeld: 280,
    wohnflaeche: 72,
    eigenkapital: 40000,
    zinssatz: 3.5,
    tilgung: 2.0,
    vergleichspreisProQm: 3600
  });

  const [fairpriceData, setFairpriceData] = useState({
    kaufpreis: 350000,
    kaltmiete: 1200,
    hausgeld: 350,
    wohnflaeche: 95,
    eigenkapital: 60000,
    zinssatz: 4.0,
    tilgung: 1.25,
    vergleichspreisProQm: 4000
  });

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

  // Get current tool's data and setter
  const getCurrentToolData = () => {
    switch (activeTool) {
      case 'projection': return { data: projectionData, setData: setProjectionData, color: 'neon-green' };
      case 'scenario': return { data: scenarioData, setData: setScenarioData, color: 'neon-purple' };
      case 'fairprice': return { data: fairpriceData, setData: setFairpriceData, color: 'accent' };
      default: return null;
    }
  };

  const currentToolData = getCurrentToolData();

  return (
    <div className="p-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
        <div className="glow-orb w-64 h-64 bg-neon-green/5 top-1/2 right-1/4" style={{ animationDelay: '10s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
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

        {/* Input Panel Toggle (only for tools that use data) */}
        {activeTool !== 'chat' && (
          <div className="flex items-center justify-between fade-in">
            <button
              onClick={() => setShowInputPanel(!showInputPanel)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <svg className={`w-4 h-4 transition-transform ${showInputPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showInputPanel ? 'Eingaben ausblenden' : 'Eingaben anzeigen'}
            </button>
            <p className="text-xs text-text-muted">
              Passen Sie die Werte an Ihre Immobilie an
            </p>
          </div>
        )}

        {/* Tool-Specific Input Panel */}
        {activeTool !== 'chat' && showInputPanel && currentToolData && (
          <div className="fade-in">
            <ToolInputPanel
              data={currentToolData.data}
              onChange={currentToolData.setData}
              color={currentToolData.color}
              showFinancing={activeTool !== 'fairprice'}
            />
          </div>
        )}

        {/* Active Tool Content */}
        <div className="fade-in fade-in-delay-2">
          {activeTool === 'chat' && (
            <div className="glass-card rounded-2xl border border-neon-blue/20 overflow-hidden" style={{ height: '600px' }}>
              <AIChat />
            </div>
          )}

          {activeTool === 'projection' && (
            <div className="glass-card rounded-2xl p-6 border border-neon-green/20">
              <ProjectionCharts analysisData={projectionData} />
            </div>
          )}

          {activeTool === 'scenario' && (
            <div className="glass-card rounded-2xl p-6 border border-neon-purple/20">
              <ScenarioSimulator analysisData={scenarioData} />
            </div>
          )}

          {activeTool === 'fairprice' && (
            <div className="glass-card rounded-2xl p-6 border border-accent/20">
              <FairPriceCalculator analysisData={fairpriceData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tools;
