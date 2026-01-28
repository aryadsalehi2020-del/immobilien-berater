import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../constants';

function ScenarioSimulator({ analysisData }) {
  const [baseValues, setBaseValues] = useState({
    kaufpreis: analysisData?.kaufpreis || 300000,
    kaltmiete: analysisData?.kaltmiete || 950,
    hausgeld: analysisData?.hausgeld || 280,
    zinssatz: 3.8,
    tilgungssatz: 1.5,
    eigenkapitalQuote: 12 // Prozent vom Kaufpreis
  });

  const scenarios = useMemo(() => {
    const base = { ...baseValues };
    const kaufnebenkosten = base.kaufpreis * 0.12;
    const eigenkapital = base.kaufpreis * (base.eigenkapitalQuote / 100);
    const kredit = base.kaufpreis + kaufnebenkosten - eigenkapital;
    const monatlicheRate = (kredit * (base.zinssatz / 100 + base.tilgungssatz / 100)) / 12;
    const nichtUmlagefaehig = base.hausgeld * 0.30;
    const baseCashflow = base.kaltmiete - monatlicheRate - nichtUmlagefaehig;

    const calcCashflow = (modifiedBase) => {
      const modKaufnebenkosten = modifiedBase.kaufpreis * 0.12;
      const modEigenkapital = modifiedBase.kaufpreis * (modifiedBase.eigenkapitalQuote / 100);
      const modKredit = modifiedBase.kaufpreis + modKaufnebenkosten - modEigenkapital;
      const modRate = (modKredit * (modifiedBase.zinssatz / 100 + modifiedBase.tilgungssatz / 100)) / 12;
      const modNichtUmlagefaehig = modifiedBase.hausgeld * 0.30;
      return modifiedBase.kaltmiete - modRate - modNichtUmlagefaehig;
    };

    const calcRendite = (modifiedBase) => {
      return ((modifiedBase.kaltmiete * 12) / modifiedBase.kaufpreis * 100);
    };

    return [
      {
        name: 'Basisfall',
        icon: '📍',
        description: 'Aktuelle Eingaben',
        values: { ...base },
        cashflow: baseCashflow,
        rendite: calcRendite(base),
        change: 0,
        category: 'basis'
      },
      {
        name: 'Kaufpreis -5%',
        icon: '💰',
        description: 'Erfolgreiche Preisverhandlung',
        values: { ...base, kaufpreis: base.kaufpreis * 0.95 },
        cashflow: calcCashflow({ ...base, kaufpreis: base.kaufpreis * 0.95 }),
        rendite: calcRendite({ ...base, kaufpreis: base.kaufpreis * 0.95 }),
        change: null,
        category: 'preis'
      },
      {
        name: 'Kaufpreis -10%',
        icon: '💰💰',
        description: 'Aggressive Verhandlung',
        values: { ...base, kaufpreis: base.kaufpreis * 0.90 },
        cashflow: calcCashflow({ ...base, kaufpreis: base.kaufpreis * 0.90 }),
        rendite: calcRendite({ ...base, kaufpreis: base.kaufpreis * 0.90 }),
        change: null,
        category: 'preis'
      },
      {
        name: 'Miete +10%',
        icon: '📈',
        description: 'Mieterhöhung nach §558',
        values: { ...base, kaltmiete: base.kaltmiete * 1.10 },
        cashflow: calcCashflow({ ...base, kaltmiete: base.kaltmiete * 1.10 }),
        rendite: calcRendite({ ...base, kaltmiete: base.kaltmiete * 1.10 }),
        change: null,
        category: 'miete'
      },
      {
        name: 'Miete -10%',
        icon: '📉',
        description: 'Mietausfall/Leerstand',
        values: { ...base, kaltmiete: base.kaltmiete * 0.90 },
        cashflow: calcCashflow({ ...base, kaltmiete: base.kaltmiete * 0.90 }),
        rendite: calcRendite({ ...base, kaltmiete: base.kaltmiete * 0.90 }),
        change: null,
        category: 'miete'
      },
      {
        name: 'Zins +1%',
        icon: '📊',
        description: 'Anschlussfinanzierung teurer',
        values: { ...base, zinssatz: base.zinssatz + 1 },
        cashflow: calcCashflow({ ...base, zinssatz: base.zinssatz + 1 }),
        rendite: calcRendite(base),
        change: null,
        category: 'finanzierung'
      },
      {
        name: 'Zins +2%',
        icon: '📊📊',
        description: 'Stark steigende Zinsen',
        values: { ...base, zinssatz: base.zinssatz + 2 },
        cashflow: calcCashflow({ ...base, zinssatz: base.zinssatz + 2 }),
        rendite: calcRendite(base),
        change: null,
        category: 'finanzierung'
      },
      {
        name: 'Tilgung 2%',
        icon: '💳',
        description: 'Schneller schuldenfrei',
        values: { ...base, tilgungssatz: 2 },
        cashflow: calcCashflow({ ...base, tilgungssatz: 2 }),
        rendite: calcRendite(base),
        change: null,
        category: 'finanzierung'
      },
      {
        name: 'Tilgung 3%',
        icon: '💳💳',
        description: 'Sehr schnelle Tilgung',
        values: { ...base, tilgungssatz: 3 },
        cashflow: calcCashflow({ ...base, tilgungssatz: 3 }),
        rendite: calcRendite(base),
        change: null,
        category: 'finanzierung'
      },
      {
        name: '20% Eigenkapital',
        icon: '🏦',
        description: 'Klassische Finanzierung',
        values: { ...base, eigenkapitalQuote: 20 },
        cashflow: calcCashflow({ ...base, eigenkapitalQuote: 20 }),
        rendite: calcRendite(base),
        change: null,
        category: 'ek'
      },
      {
        name: 'Mit KfW 1,12%',
        icon: '🏛️',
        description: 'KfW 300/308 Förderung',
        values: { ...base, zinssatz: 1.12 },
        cashflow: calcCashflow({ ...base, zinssatz: 1.12 }),
        rendite: calcRendite(base),
        change: null,
        category: 'förderung'
      },
      {
        name: 'WORST CASE',
        icon: '⚠️',
        description: 'Miete -10%, Zins +2%',
        values: { ...base, kaltmiete: base.kaltmiete * 0.90, zinssatz: base.zinssatz + 2 },
        cashflow: calcCashflow({ ...base, kaltmiete: base.kaltmiete * 0.90, zinssatz: base.zinssatz + 2 }),
        rendite: calcRendite({ ...base, kaltmiete: base.kaltmiete * 0.90 }),
        change: null,
        category: 'stress'
      },
      {
        name: 'BEST CASE',
        icon: '🌟',
        description: 'Preis -10%, Miete +10%',
        values: { ...base, kaufpreis: base.kaufpreis * 0.90, kaltmiete: base.kaltmiete * 1.10 },
        cashflow: calcCashflow({ ...base, kaufpreis: base.kaufpreis * 0.90, kaltmiete: base.kaltmiete * 1.10 }),
        rendite: calcRendite({ ...base, kaufpreis: base.kaufpreis * 0.90, kaltmiete: base.kaltmiete * 1.10 }),
        change: null,
        category: 'optimistisch'
      }
    ].map(s => ({
      ...s,
      change: s.name !== 'Basisfall' ? s.cashflow - baseCashflow : 0
    }));
  }, [baseValues]);

  const categories = [
    { id: 'all', label: 'Alle', icon: '📊' },
    { id: 'preis', label: 'Kaufpreis', icon: '💰' },
    { id: 'miete', label: 'Miete', icon: '📈' },
    { id: 'finanzierung', label: 'Finanzierung', icon: '🏦' },
    { id: 'stress', label: 'Stress-Test', icon: '⚠️' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredScenarios = activeCategory === 'all'
    ? scenarios
    : scenarios.filter(s => s.category === activeCategory || s.category === 'basis');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center text-xl border border-neon-purple/30">🔮</span>
            <span className="text-gradient-neon">Was wäre wenn...</span>
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            Simulieren Sie verschiedene Szenarien und sehen Sie die Auswirkungen
          </p>
        </div>
      </div>

      {/* Base Values Sliders */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Basiswerte anpassen</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-text-secondary">Kaufpreis</label>
              <span className="text-neon-blue font-bold">{formatCurrency(baseValues.kaufpreis)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={1000000}
              step={10000}
              value={baseValues.kaufpreis}
              onChange={(e) => setBaseValues(v => ({ ...v, kaufpreis: parseInt(e.target.value) }))}
              className="w-full accent-neon-blue cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-text-secondary">Kaltmiete</label>
              <span className="text-neon-green font-bold">{formatCurrency(baseValues.kaltmiete)}/Monat</span>
            </div>
            <input
              type="range"
              min={300}
              max={3000}
              step={50}
              value={baseValues.kaltmiete}
              onChange={(e) => setBaseValues(v => ({ ...v, kaltmiete: parseInt(e.target.value) }))}
              className="w-full accent-neon-blue cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="text-text-secondary">Zinssatz</label>
              <span className="text-accent font-bold">{baseValues.zinssatz}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={0.1}
              value={baseValues.zinssatz}
              onChange={(e) => setBaseValues(v => ({ ...v, zinssatz: parseFloat(e.target.value) }))}
              className="w-full accent-neon-blue cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenarios.map((scenario, idx) => (
          <div
            key={idx}
            className={`glass-card rounded-xl p-5 border transition-all ${
              scenario.category === 'basis'
                ? 'border-neon-blue/50 bg-neon-blue/5'
                : scenario.category === 'stress'
                  ? 'border-red-500/30'
                  : scenario.category === 'optimistisch'
                    ? 'border-neon-green/30'
                    : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <h4 className="font-bold text-white">{scenario.name}</h4>
                <p className="text-xs text-text-muted">{scenario.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Cashflow/Monat</span>
                <span className={`font-bold ${scenario.cashflow >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {formatCurrency(scenario.cashflow)}
                </span>
              </div>

              {scenario.name !== 'Basisfall' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Veränderung</span>
                  <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                    scenario.change > 0
                      ? 'bg-neon-green/20 text-neon-green'
                      : scenario.change < 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-text-muted'
                  }`}>
                    {scenario.change > 0 ? '+' : ''}{formatCurrency(scenario.change)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Bruttorendite</span>
                <span className="text-white font-medium">{scenario.rendite.toFixed(2)}%</span>
              </div>
            </div>

            {/* Visual indicator */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {scenario.cashflow >= 100 ? '🟢' :
                   scenario.cashflow >= 0 ? '🟡' :
                   scenario.cashflow >= -200 ? '🟠' : '🔴'}
                </span>
                <span className="text-xs text-text-muted">
                  {scenario.cashflow >= 100 ? 'Sehr gut' :
                   scenario.cashflow >= 0 ? 'Tragbar' :
                   scenario.cashflow >= -200 ? 'Belastend' : 'Kritisch'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="glass-card rounded-xl p-5 border border-accent/30 bg-accent/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="font-bold text-accent mb-2">Robustheits-Analyse</h4>
            <p className="text-text-secondary text-sm">
              {scenarios.find(s => s.name === 'WORST CASE')?.cashflow >= 0 ? (
                <span className="text-neon-green">✓ Diese Immobilie trägt sich auch im Worst-Case-Szenario! Das ist ein robustes Investment.</span>
              ) : scenarios.find(s => s.name === 'WORST CASE')?.cashflow >= -200 ? (
                <span className="text-accent">⚠ Im Worst Case negativer Cashflow. Halten Sie eine Liquiditätsreserve von mindestens {formatCurrency(Math.abs(scenarios.find(s => s.name === 'WORST CASE')?.cashflow || 0) * 12)} pro Jahr vor.</span>
              ) : (
                <span className="text-red-400">⚠ Hohes Risiko im Worst Case. Prüfen Sie Preisverhandlung oder höheres Eigenkapital.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScenarioSimulator;
