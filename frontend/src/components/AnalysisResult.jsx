import React, { useState, useMemo } from 'react';

// Chart components
import CashflowChart from './charts/CashflowChart';
import TilgungsChart from './charts/TilgungsChart';
import ZinsTilgungChart from './charts/ZinsTilgungChart';

// UI components
import BreakEvenCalculator from './BreakEvenCalculator';
import ScenarioComparison from './ScenarioComparison';
import InteractiveSliders from './InteractiveSliders';
import LiveCalculator from './LiveCalculator';
import SensitivityMatrix from './SensitivityMatrix';
import InvestmentComparison from './InvestmentComparison';
import MilestonesTimeline from './MilestonesTimeline';
import RentalVariations from './RentalVariations';
import FinancingOptions from './FinancingOptions';

// Dynamic Scoring
import { useUserProfile, INVESTMENT_GOALS } from '../contexts/UserProfileContext';
import {
  calculateDynamicWeights,
  calculateAdjustedScore,
  getWeightDifferences,
  generatePersonalizedWarnings,
  getProfileBasedRecommendation
} from '../utils/dynamicWeights';

function ScoreCircle({ score, adjustedScore = null, showAdjusted = false }) {
  const radius = 60;
  const displayScore = showAdjusted && adjustedScore !== null ? adjustedScore : score;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  // Angepasste Schwellen: +10 positiver
  const getScoreColor = (score) => {
    if (score >= 60) return '#10b981'; // green (war 70)
    if (score >= 45) return '#f59e0b'; // yellow (war 50)
    if (score >= 30) return '#f97316'; // orange (war 30)
    return '#ef4444'; // red
  };

  // Angepasste Labels: +10 positiver
  const getScoreLabel = (score) => {
    if (score >= 75) return 'Exzellent';     // war 80
    if (score >= 60) return 'Sehr gut';       // war 65
    if (score >= 45) return 'Gut';            // war 50
    if (score >= 30) return 'Akzeptabel';     // war 35
    return 'Kritisch';
  };

  const scoreDiff = adjustedScore !== null ? adjustedScore - score : 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full animate-glow opacity-30"
           style={{ background: `radial-gradient(circle, ${getScoreColor(displayScore)}40, transparent)` }}></div>

      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="rgba(100, 116, 139, 0.2)"
          strokeWidth="12"
        />
        {/* Score circle with gradient */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke={getScoreColor(displayScore)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-circle"
          style={{
            '--score-offset': offset,
            filter: `drop-shadow(0 0 8px ${getScoreColor(displayScore)}80)`
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black mb-1" style={{ color: getScoreColor(displayScore) }}>
          {Math.round(displayScore)}
        </span>
        {showAdjusted && adjustedScore !== null && scoreDiff !== 0 && (
          <span className={`text-xs font-bold ${scoreDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
            ({scoreDiff > 0 ? '+' : ''}{scoreDiff} personalisiert)
          </span>
        )}
        <span className="text-xs text-slate/60 font-medium uppercase tracking-wider">von 100</span>
        <span className="text-sm font-bold text-accent mt-2 px-3 py-1 bg-accent/10 rounded-full">
          {getScoreLabel(displayScore)}
        </span>
      </div>
    </div>
  );
}

function CriterionBar({ criterion, weightDiff = null, showAdjusted = false }) {
  // Angepasste Schwellen: +10 positiver
  const getBarColor = (score) => {
    if (score >= 60) return 'from-green-400 to-emerald-500';   // war 70
    if (score >= 45) return 'from-yellow-400 to-orange-400';   // war 50
    if (score >= 30) return 'from-orange-400 to-red-400';      // war 30
    return 'from-red-500 to-rose-600';
  };

  const getScoreEmoji = (score) => {
    if (score >= 60) return '\u{1F7E2}';  // war 70
    if (score >= 45) return '\u{1F7E1}';  // war 50
    if (score >= 30) return '\u{1F7E0}';  // war 30
    return '\u{1F534}';
  };

  const criterionLabels = {
    cashflow_rendite: 'Cashflow / Rendite',
    lage: 'Lage',
    kaufpreis_qm: 'Kaufpreis / m²',
    zukunftspotenzial: 'Zukunftspotenzial',
    zustand_baujahr: 'Zustand / Baujahr',
    energieeffizienz: 'Energieeffizienz',
    nebenkosten: 'Nebenkosten',
    grundriss: 'Grundriss',
    'verkäufertyp': 'Verkäufertyp',
    'verkaeufertyp': 'Verkäufertyp',
  };

  const displayWeight = showAdjusted && weightDiff ? weightDiff.adjusted : criterion.gewichtung;
  const hasWeightChange = weightDiff && Math.abs(weightDiff.diff) >= 1;

  return (
    <div className={`mb-6 p-4 rounded-xl border transition-all ${
      hasWeightChange && showAdjusted
        ? weightDiff.direction === 'up'
          ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
          : 'bg-slate/5 border-slate/10 hover:border-slate/20'
        : 'bg-slate/5 border-slate/10 hover:border-accent/30'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getScoreEmoji(criterion.score)}</span>
          <span className="text-base font-semibold text-primary">
            {criterionLabels[criterion.name] || criterion.name}
          </span>
          {hasWeightChange && showAdjusted && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              weightDiff.direction === 'up'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate/20 text-slate/60'
            }`}>
              {weightDiff.direction === 'up' ? '↑ Wichtiger' : '↓ Weniger wichtig'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full ${
            hasWeightChange && showAdjusted
              ? weightDiff.direction === 'up'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate/10 text-slate/60'
              : 'bg-slate/10 text-slate/60'
          }`}>
            {displayWeight}% Gewichtung
            {hasWeightChange && showAdjusted && (
              <span className="ml-1">
                ({weightDiff.diff > 0 ? '+' : ''}{weightDiff.diff})
              </span>
            )}
          </span>
          <span className="text-lg font-bold text-primary">
            {Math.round(criterion.score)}
          </span>
        </div>
      </div>
      <div className="h-3 bg-slate/10 rounded-full overflow-hidden shadow-inner mb-3">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(criterion.score)} transition-all duration-1000 shadow-lg`}
          style={{ width: `${criterion.score}%` }}
        />
      </div>
      <p className="text-sm text-slate leading-relaxed">{criterion.begründung}</p>
    </div>
  );
}

// Tab configuration
const TABS = [
  { id: 'uebersicht', label: 'Übersicht', icon: '\u{1F3E0}' },
  { id: 'tipps', label: 'Tipps & Förderungen', icon: '\u{1F4A1}' },
  { id: 'projektionen', label: 'Projektionen', icon: '\u{1F4C8}' },
  { id: 'szenarien', label: 'Szenarien', icon: '\u{1F3AD}' },
  { id: 'optionen', label: 'Optionen', icon: '\u{1F4B3}' },
  { id: 'vergleich', label: 'Vergleich', icon: '\u{2696}\u{FE0F}' }
];

function AnalysisResult({ result, propertyData, onNewAnalysis, onEditData, onSwitchVerwendungszweck }) {
  const [activeTab, setActiveTab] = useState('uebersicht');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showPersonalized, setShowPersonalized] = useState(true);

  // Dynamic Scoring Integration
  let userProfileContext;
  try {
    userProfileContext = useUserProfile();
  } catch (e) {
    userProfileContext = null;
  }

  const profile = userProfileContext?.profile;
  const isProfileComplete = userProfileContext?.isProfileComplete;

  // Berechne dynamische Scores und Warnungen
  const dynamicData = useMemo(() => {
    if (!profile || !isProfileComplete) {
      return {
        adjustedScore: null,
        weightDiffs: {},
        warnings: [],
        recommendation: null
      };
    }

    const adjustedScore = calculateAdjustedScore(result.kriterien, profile);
    const weightDiffs = getWeightDifferences(profile);
    const warnings = generatePersonalizedWarnings(result, profile);
    const recommendation = getProfileBasedRecommendation(
      showPersonalized ? adjustedScore : result.gesamtscore,
      profile
    );

    return { adjustedScore, weightDiffs, warnings, recommendation };
  }, [result, profile, isProfileComplete, showPersonalized]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Check if extended analysis data is available
  const hasExtendedData = result.tilgungsplan || result.szenarien || result.sensitivity_analyse;

  // Get the tilgungsplan to use (from selected scenario or default)
  const activeTilgungsplan = selectedScenario?.tilgungsplan || result.tilgungsplan;

  return (
    <div className="fade-in space-y-8">
      {/* Header Card with Score */}
      <div className="glass-light rounded-3xl shadow-2xl p-10 card-hover">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <ScoreCircle
            score={result.gesamtscore}
            adjustedScore={dynamicData.adjustedScore}
            showAdjusted={showPersonalized && isProfileComplete}
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Verwendungszweck Toggle */}
              <div className="inline-flex items-center rounded-full border border-white/20 p-1">
                <button
                  onClick={() => onSwitchVerwendungszweck && result.verwendungszweck !== 'kapitalanlage' && onSwitchVerwendungszweck('kapitalanlage')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    result.verwendungszweck === 'kapitalanlage'
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'text-text-muted hover:text-white cursor-pointer'
                  }`}
                  disabled={!onSwitchVerwendungszweck}
                >
                  <span className="text-lg">💰</span>
                  <span className="font-semibold text-sm">Kapitalanlage</span>
                </button>
                <button
                  onClick={() => onSwitchVerwendungszweck && result.verwendungszweck !== 'eigennutzung' && onSwitchVerwendungszweck('eigennutzung')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    result.verwendungszweck === 'eigennutzung'
                      ? 'bg-neon-purple/20 text-neon-purple'
                      : 'text-text-muted hover:text-white cursor-pointer'
                  }`}
                  disabled={!onSwitchVerwendungszweck}
                >
                  <span className="text-lg">🏠</span>
                  <span className="font-semibold text-sm">Eigennutzung</span>
                </button>
              </div>
              {isProfileComplete && profile && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neon-purple/10 border border-neon-purple/30 rounded-full">
                  <span>{INVESTMENT_GOALS[profile.goal]?.icon}</span>
                  <span className="text-neon-purple text-sm font-medium">
                    {INVESTMENT_GOALS[profile.goal]?.label}
                  </span>
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-primary mb-4">
              Bewertungsergebnis
            </h2>

            <p className="text-slate text-lg leading-relaxed">{result.zusammenfassung}</p>

            {/* Personalized Recommendation */}
            {isProfileComplete && dynamicData.recommendation && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                dynamicData.recommendation.action === 'invest'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : dynamicData.recommendation.action === 'consider'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : dynamicData.recommendation.action === 'caution'
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <span className="text-lg">{dynamicData.recommendation.emoji}</span>
                <span className="font-medium">{dynamicData.recommendation.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Personalized Toggle */}
        {isProfileComplete && dynamicData.adjustedScore !== null && (
          <div className="mt-6 pt-6 border-t border-slate/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPersonalized(!showPersonalized)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    showPersonalized ? 'bg-neon-purple' : 'bg-slate/30'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    showPersonalized ? 'left-7' : 'left-1'
                  }`} />
                </button>
                <span className="text-sm text-slate">
                  Personalisierte Bewertung ({INVESTMENT_GOALS[profile.goal]?.label})
                </span>
              </div>
              {showPersonalized && dynamicData.adjustedScore !== result.gesamtscore && (
                <span className="text-xs text-slate/60">
                  Basis-Score: {Math.round(result.gesamtscore)} | Angepasst: {dynamicData.adjustedScore}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate/10">
          <button
            onClick={onNewAnalysis}
            className="py-4 bg-gradient-gold text-primary font-bold rounded-xl
              btn-premium shadow-lg text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Neue Analyse
            </span>
          </button>
          <button
            onClick={onEditData}
            className="py-4 border-2 border-slate/30 text-primary font-semibold rounded-xl
              hover:border-accent hover:bg-accent/5 transition-all text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Daten bearbeiten
            </span>
          </button>
        </div>
      </div>

      {/* Tab Navigation - Only show if extended data is available and it's kapitalanlage */}
      {hasExtendedData && result.verwendungszweck === 'kapitalanlage' && (
        <div className="glass-light rounded-2xl shadow-lg p-2">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-gradient-gold text-primary shadow-lg'
                    : 'text-slate/70 hover:bg-slate/10 hover:text-primary'
                  }
                `}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'uebersicht' && (
        <>
          {/* Personalized Warnings */}
          {isProfileComplete && dynamicData.warnings.length > 0 && showPersonalized && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 fade-in card-hover border-2 border-neon-purple/20">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center text-xl">
                  🎯
                </span>
                Personalisierte Hinweise
                <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-full ml-2">
                  {INVESTMENT_GOALS[profile.goal]?.label}
                </span>
              </h3>

              <div className="space-y-3">
                {dynamicData.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl flex items-start gap-3 ${
                      warning.type === 'critical'
                        ? 'bg-red-500/10 border border-red-500/30'
                        : warning.type === 'warning'
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : warning.type === 'positive'
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-blue-500/10 border border-blue-500/30'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{warning.icon}</span>
                    <div>
                      {warning.title && (
                        <p className={`font-bold mb-1 ${
                          warning.type === 'critical' ? 'text-red-400' :
                          warning.type === 'warning' ? 'text-amber-400' :
                          warning.type === 'positive' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {warning.title}
                        </p>
                      )}
                      <p className="text-slate text-sm leading-relaxed">{warning.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Break-Even Calculator (new) */}
          {result.breakeven_eigenkapital && result.verwendungszweck === 'kapitalanlage' && (
            <div className="fade-in-delay-1">
              <BreakEvenCalculator
                breakeven={result.breakeven_eigenkapital}
                aktuellesEigenkapital={result.cashflow_analyse?.eigenkapital || 0}
                kaufpreis={propertyData?.kaufpreis || 0}
              />
            </div>
          )}

          {/* Cashflow Analysis (for investment) */}
          {result.cashflow_analyse && (
            <div className="glass-light rounded-3xl shadow-2xl p-10 fade-in-delay-1 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center text-2xl">
                  {'\u{1F4B0}'}
                </span>
                Cashflow-Analyse
              </h3>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="font-bold text-primary mb-6 text-lg">Monatliche Berechnung</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-green-50/50 rounded-xl border border-green-200/30">
                      <span className="text-slate font-medium">Mieteinnahmen</span>
                      <span className="font-bold text-green-600 text-lg">
                        +{formatCurrency(result.cashflow_analyse.monatliche_miete)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-red-50/50 rounded-xl border border-red-200/30">
                      <span className="text-slate font-medium">Kreditrate</span>
                      <span className="font-bold text-red-600 text-lg">
                        -{formatCurrency(result.cashflow_analyse.monatliche_rate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-red-50/50 rounded-xl border border-red-200/30">
                      <span className="text-slate font-medium">Nebenkosten/Hausgeld</span>
                      <span className="font-bold text-red-600 text-lg">
                        -{formatCurrency(result.cashflow_analyse.monatliche_nebenkosten)}
                      </span>
                    </div>
                    <div className={`flex justify-between items-center py-4 px-5 rounded-2xl shadow-lg ${result.cashflow_analyse.monatlicher_cashflow >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}>
                      <span className="font-bold text-white text-lg">Monatlicher Cashflow</span>
                      <span className="font-black text-white text-2xl">
                        {result.cashflow_analyse.monatlicher_cashflow >= 0 ? '+' : ''}
                        {formatCurrency(result.cashflow_analyse.monatlicher_cashflow)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-primary mb-6 text-lg">Kennzahlen</h4>
                  <div className="space-y-4">
                    <div className={`p-5 rounded-2xl shadow-md ${result.cashflow_analyse.selbsttragend ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {result.cashflow_analyse.selbsttragend ? (
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        <span className={`font-bold text-lg ${result.cashflow_analyse.selbsttragend ? 'text-green-700' : 'text-red-700'}`}>
                          {result.cashflow_analyse.selbsttragend ? 'Selbsttragend \u2713' : 'Nicht selbsttragend'}
                        </span>
                      </div>
                      <p className="text-sm text-slate leading-relaxed">
                        {result.cashflow_analyse.selbsttragend
                          ? 'Die Immobilie finanziert sich selbst bei 100% Finanzierung.'
                          : 'Monatliche Zuzahlung erforderlich.'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-accent/5 rounded-xl border border-accent/20">
                      <span className="text-slate font-medium">Bruttorendite</span>
                      <span className="font-bold text-xl text-accent">
                        {result.cashflow_analyse.bruttorendite_prozent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-slate/5 rounded-xl border border-slate/20">
                      <span className="text-slate font-medium">Finanzierungssumme</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(result.cashflow_analyse.finanzierungssumme)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-slate/5 rounded-xl border border-slate/20">
                      <span className="text-slate font-medium">Jährlicher Cashflow</span>
                      <span className={`font-bold ${result.cashflow_analyse.jaehrlicher_cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.cashflow_analyse.jaehrlicher_cashflow >= 0 ? '+' : ''}
                        {formatCurrency(result.cashflow_analyse.jaehrlicher_cashflow)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Criteria Breakdown */}
          <div className="glass-light rounded-3xl shadow-2xl p-10 fade-in-delay-2 card-hover">
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
              <span className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-2xl">
                {'\u{1F4CA}'}
              </span>
              Detailbewertung
              {isProfileComplete && showPersonalized && Object.keys(dynamicData.weightDiffs).length > 0 && (
                <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded-full ml-2">
                  Gewichtung angepasst
                </span>
              )}
            </h3>

            <div className="space-y-6">
              {result.kriterien
                .filter(k => k.gewichtung > 0)
                .sort((a, b) => {
                  // Bei personalisierter Ansicht nach angepasster Gewichtung sortieren
                  if (showPersonalized && isProfileComplete) {
                    const aWeight = dynamicData.weightDiffs[a.name]?.adjusted || a.gewichtung;
                    const bWeight = dynamicData.weightDiffs[b.name]?.adjusted || b.gewichtung;
                    return bWeight - aWeight;
                  }
                  return b.gewichtung - a.gewichtung;
                })
                .map((criterion, index) => (
                  <CriterionBar
                    key={criterion.name}
                    criterion={criterion}
                    weightDiff={dynamicData.weightDiffs[criterion.name]}
                    showAdjusted={showPersonalized && isProfileComplete}
                  />
                ))}
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-light rounded-3xl shadow-xl p-8 fade-in-delay-3 card-hover border-2 border-green-200/30">
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Stärken
              </h3>
              <ul className="space-y-3">
                {result.stärken.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50/50 rounded-xl">
                    <span className="text-green-500 text-lg font-bold flex-shrink-0">{'\u2713'}</span>
                    <span className="text-primary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-light rounded-3xl shadow-xl p-8 fade-in-delay-3 card-hover border-2 border-red-200/30">
              <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Schwächen
              </h3>
              <ul className="space-y-3">
                {result.schwächen.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl">
                    <span className="text-red-500 text-lg font-bold flex-shrink-0">!</span>
                    <span className="text-primary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* V3.0 Kennzahlen & Markt-Vergleich */}
          {result.kennzahlen && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 fade-in-delay-3 card-hover border-2 border-neon-blue/20">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  📊
                </span>
                Markt-Vergleich (Live-Daten)
                {result.kennzahlen.marktdaten_quelle === 'live_web_search_v3' && (
                  <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded-full ml-2">✓ Live</span>
                )}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Preis pro qm */}
                <div className="p-5 bg-gradient-to-br from-slate/5 to-slate/10 rounded-2xl border border-slate/20">
                  <p className="text-sm text-slate/70 mb-2 font-medium">Objekt-Preis</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.kennzahlen.preis_pro_qm?.toLocaleString('de-DE')} €/m²
                  </p>
                </div>

                {/* Markt-Durchschnitt */}
                <div className="p-5 bg-gradient-to-br from-slate/5 to-slate/10 rounded-2xl border border-slate/20">
                  <p className="text-sm text-slate/70 mb-2 font-medium">Markt-Durchschnitt</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.kennzahlen.markt_durchschnitt_qm?.toLocaleString('de-DE') || '---'} €/m²
                  </p>
                </div>

                {/* Abweichung */}
                <div className={`p-5 rounded-2xl border ${
                  result.kennzahlen.unter_markt
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
                }`}>
                  <p className="text-sm text-slate/70 mb-2 font-medium">Abweichung vom Markt</p>
                  <p className={`text-2xl font-bold ${
                    result.kennzahlen.unter_markt ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.kennzahlen.abweichung_prozent > 0 ? '+' : ''}
                    {result.kennzahlen.abweichung_prozent?.toFixed(1) || '---'}%
                  </p>
                  <p className={`text-sm mt-1 font-semibold ${
                    result.kennzahlen.unter_markt ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {result.kennzahlen.unter_markt ? '✓ Unter Markt' : '⚠ Über Markt'}
                  </p>
                </div>

                {/* Kaufpreisfaktor */}
                {result.kennzahlen.kaufpreisfaktor && (
                  <div className={`p-5 rounded-2xl border ${
                    result.kennzahlen.kaufpreisfaktor < 20
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : result.kennzahlen.kaufpreisfaktor < 25
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
                        : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
                  }`}>
                    <p className="text-sm text-slate/70 mb-2 font-medium">Kaufpreisfaktor</p>
                    <p className={`text-2xl font-bold ${
                      result.kennzahlen.kaufpreisfaktor < 20 ? 'text-green-600' :
                      result.kennzahlen.kaufpreisfaktor < 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.kennzahlen.kaufpreisfaktor}
                    </p>
                    <p className="text-xs text-slate/60 mt-1">
                      {'<'}20 gut, {'<'}25 ok, {'>'}25 hoch
                    </p>
                  </div>
                )}
              </div>

              {/* Datenquelle Info */}
              <div className="flex items-center justify-between text-sm border-t border-slate/10 pt-4">
                <span className="text-slate/60">
                  📍 Standort: {result.kennzahlen.marktdaten_standort || 'Nicht angegeben'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  result.kennzahlen.marktdaten_vertrauen === 'hoch'
                    ? 'bg-green-100 text-green-700'
                    : result.kennzahlen.marktdaten_vertrauen === 'mittel'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  Vertrauen: {result.kennzahlen.marktdaten_vertrauen || 'unbekannt'}
                </span>
              </div>
            </div>
          )}

          {/* Market Data */}
          {result.marktdaten && (
            <div className="glass-light rounded-3xl shadow-2xl p-10 fade-in-delay-3 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  {'\u{1F4C8}'}
                </span>
                Marktdaten & Prognose
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-slate/5 to-slate/10 rounded-2xl border border-slate/20">
                  <p className="text-sm text-slate/70 mb-3 font-medium">Kaufpreis / m²</p>
                  <p className="text-xl font-bold text-primary mb-2">
                    {formatCurrency(result.marktdaten.kaufpreis_qm_von)} - {formatCurrency(result.marktdaten.kaufpreis_qm_bis)}
                  </p>
                  <p className="text-sm text-accent font-semibold">
                    Ø {formatCurrency(result.marktdaten.kaufpreis_qm_durchschnitt)}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-slate/5 to-slate/10 rounded-2xl border border-slate/20">
                  <p className="text-sm text-slate/70 mb-3 font-medium">Miete / m²</p>
                  <p className="text-xl font-bold text-primary mb-2">
                    {result.marktdaten.miete_qm_von?.toFixed(2)}\u20AC - {result.marktdaten.miete_qm_bis?.toFixed(2)}\u20AC
                  </p>
                  <p className="text-sm text-accent font-semibold">
                    Ø {result.marktdaten.miete_qm_durchschnitt?.toFixed(2)}\u20AC
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/30">
                  <p className="text-sm text-slate/70 mb-3 font-medium">5-Jahres-Entwicklung</p>
                  <p className="text-xl font-bold text-accent mb-2">
                    {result.marktdaten.preisentwicklung_5_jahre}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    {result.marktdaten.tendenz}
                  </p>
                </div>
              </div>

              {result.marktdaten.prognose && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 mb-2">Marktprognose</p>
                      <p className="text-primary leading-relaxed">{result.marktdaten.prognose}</p>
                    </div>
                  </div>
                </div>
              )}

              {result.marktdaten.datenqualität && (
                <p className="text-xs text-slate/50 mt-6 italic text-center">
                  {result.marktdaten.datenqualität}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Tipps & Förderungen Tab */}
      {activeTab === 'tipps' && (
        <div className="space-y-8">
          {/* Fairer Preis */}
          {result.fairer_preis && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{2696}\u{FE0F}'}</span>
                Fairer Preis Analyse
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                  <p className="text-slate text-sm mb-2">Aktueller Preis</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(result.fairer_preis.aktueller_preis)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
                  <p className="text-slate text-sm mb-2">Fairer Preis</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(result.fairer_preis.fairer_preis)}</p>
                </div>
                <div className={`rounded-2xl p-6 text-center ${result.fairer_preis.differenz_prozent > 0 ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
                  <p className="text-slate text-sm mb-2">Differenz</p>
                  <p className={`text-2xl font-bold ${result.fairer_preis.differenz_prozent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.fairer_preis.differenz_prozent > 0 ? '+' : ''}{result.fairer_preis.differenz_prozent}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center">
                  <p className="text-slate text-sm mb-2">Bewertung</p>
                  <p className="text-2xl font-bold text-amber-600 capitalize">{result.fairer_preis.bewertung}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-slate/5 rounded-xl p-4">
                  <p className="text-slate mb-1">Nach Ertragswert</p>
                  <p className="font-semibold text-primary">{formatCurrency(result.fairer_preis.nach_rendite)}</p>
                </div>
                <div className="bg-slate/5 rounded-xl p-4">
                  <p className="text-slate mb-1">Nach Faktor 22</p>
                  <p className="font-semibold text-primary">{formatCurrency(result.fairer_preis.nach_faktor)}</p>
                </div>
                <div className="bg-slate/5 rounded-xl p-4">
                  <p className="text-slate mb-1">Nach Cashflow</p>
                  <p className="font-semibold text-primary">{formatCurrency(result.fairer_preis.nach_cashflow)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Verbesserungsvorschläge */}
          {result.verbesserungsvorschlaege && result.verbesserungsvorschlaege.length > 0 && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{1F4A1}'}</span>
                Verbesserungsvorschläge
              </h3>
              <div className="space-y-4">
                {result.verbesserungsvorschlaege.map((tipp, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate/5 to-transparent rounded-2xl p-6 border-l-4 border-accent">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{tipp.icon}</span>
                      <h4 className="text-lg font-bold text-primary">{tipp.typ}</h4>
                      {tipp.prioritaet && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tipp.prioritaet === 'hoch' ? 'bg-red-100 text-red-700' :
                          tipp.prioritaet === 'sehr hoch' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tipp.prioritaet}
                        </span>
                      )}
                    </div>
                    <p className="text-primary mb-2">{tipp.tipp}</p>
                    {tipp.effekt && <p className="text-sm text-green-600 mb-1">{'\u{2192}'} {tipp.effekt}</p>}
                    {tipp.argument && <p className="text-sm text-slate italic">{tipp.argument}</p>}
                    {tipp.optionen && (
                      <ul className="mt-3 space-y-1">
                        {tipp.optionen.map((opt, i) => (
                          <li key={i} className="text-sm text-slate flex items-center gap-2">
                            <span className="text-accent">{'\u{2022}'}</span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Förderungen */}
          {result.foerderungen && result.foerderungen.length > 0 && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{1F3E6}'}</span>
                Passende Förderungen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.foerderungen.map((foerderung, index) => (
                  <div key={index} className={`rounded-2xl p-6 border-2 ${
                    foerderung.prioritaet === 'sehr hoch' ? 'border-green-400 bg-green-50' :
                    foerderung.prioritaet === 'hoch' ? 'border-blue-400 bg-blue-50' :
                    'border-slate/20 bg-slate/5'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs font-bold text-accent uppercase">{foerderung.programm}</span>
                        <h4 className="text-lg font-bold text-primary">{foerderung.name}</h4>
                      </div>
                      {foerderung.prioritaet && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          foerderung.prioritaet === 'sehr hoch' ? 'bg-green-200 text-green-800' :
                          foerderung.prioritaet === 'hoch' ? 'bg-blue-200 text-blue-800' :
                          'bg-slate/20 text-slate'
                        }`}>
                          {foerderung.prioritaet}
                        </span>
                      )}
                    </div>
                    {foerderung.kredit && <p className="text-sm text-primary mb-1">{'\u{1F4B0}'} Kredit: {formatCurrency(foerderung.kredit)}</p>}
                    {foerderung.zins && <p className="text-sm text-primary mb-1">{'\u{1F4C9}'} Zins: {foerderung.zins}</p>}
                    {foerderung.zuschuss && <p className="text-sm text-green-600 mb-1">{'\u{1F381}'} {foerderung.zuschuss}</p>}
                    {foerderung.foerderung_prozent && <p className="text-sm text-green-600 mb-1">{'\u{2705}'} {foerderung.foerderung_prozent}% Förderung</p>}
                    {foerderung.grund && <p className="text-sm text-slate mb-2">{foerderung.grund}</p>}
                    {foerderung.wichtig && (
                      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                        {'\u{26A0}\u{FE0F}'} {foerderung.wichtig}
                      </p>
                    )}
                    {foerderung.tipp && (
                      <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mt-2">
                        {'\u{1F4A1}'} {foerderung.tipp}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AfA Berechnung */}
          {result.afa_berechnung && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{1F4CA}'}</span>
                AfA (Abschreibung)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.afa_berechnung.linear && (
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h4 className="font-bold text-primary mb-3">Lineare AfA</h4>
                    <div className="space-y-2 text-sm">
                      <p>AfA-Satz: <span className="font-semibold">{result.afa_berechnung.linear.satz_prozent}%</span></p>
                      <p>Dauer: <span className="font-semibold">{result.afa_berechnung.linear.dauer_jahre} Jahre</span></p>
                      <p>Jährlich absetzbar: <span className="font-semibold text-green-600">{formatCurrency(result.afa_berechnung.linear.jaehrlich)}</span></p>
                      <p>Gesamt in 15 Jahren: <span className="font-semibold text-green-600">{formatCurrency(result.afa_berechnung.linear.gesamt_15_jahre)}</span></p>
                    </div>
                  </div>
                )}
                {result.afa_berechnung.degressiv && (
                  <div className="bg-green-50 rounded-2xl p-6">
                    <h4 className="font-bold text-primary mb-3">Degressive AfA {'\u{2728}'}</h4>
                    <div className="space-y-2 text-sm">
                      <p>AfA-Satz: <span className="font-semibold">{result.afa_berechnung.degressiv.satz_prozent}%</span> vom Restwert</p>
                      <p>Gesamt in 15 Jahren: <span className="font-semibold text-green-600">{formatCurrency(result.afa_berechnung.degressiv.gesamt_15_jahre)}</span></p>
                      <p className="text-green-700 font-medium">Vorteil vs. linear: +{formatCurrency(result.afa_berechnung.degressiv.vorteil_vs_linear)}</p>
                      <p className="text-xs text-slate mt-2">{result.afa_berechnung.degressiv.empfehlung}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leverage Effekt */}
          {result.leverage_effekt && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{1F4B9}'}</span>
                Leverage-Effekt (Hebel)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate/5 rounded-xl p-4 text-center">
                  <p className="text-slate text-sm mb-1">Objektrendite</p>
                  <p className="text-xl font-bold text-primary">{result.leverage_effekt.objektrendite_prozent}%</p>
                </div>
                <div className="bg-slate/5 rounded-xl p-4 text-center">
                  <p className="text-slate text-sm mb-1">FK-Zins</p>
                  <p className="text-xl font-bold text-primary">{result.leverage_effekt.fremdkapitalzins_prozent}%</p>
                </div>
                <div className="bg-slate/5 rounded-xl p-4 text-center">
                  <p className="text-slate text-sm mb-1">Hebel</p>
                  <p className="text-xl font-bold text-primary">{result.leverage_effekt.hebel_faktor}x</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${result.leverage_effekt.ist_positiver_hebel ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="text-slate text-sm mb-1">EK-Rendite</p>
                  <p className={`text-xl font-bold ${result.leverage_effekt.ist_positiver_hebel ? 'text-green-600' : 'text-red-600'}`}>
                    {result.leverage_effekt.eigenkapitalrendite_prozent}%
                  </p>
                </div>
              </div>
              {result.leverage_effekt.warnung && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{'\u{26A0}\u{FE0F}'} {result.leverage_effekt.warnung}</p>
                </div>
              )}
              <p className="text-sm text-slate mt-4">
                Break-Even-Zins: {result.leverage_effekt.break_even_zins}% - Ab diesem FK-Zins wird der Hebel negativ.
              </p>
            </div>
          )}

          {/* Quick Check */}
          {result.quick_check_result && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 card-hover">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="text-3xl">{'\u{2714}\u{FE0F}'}</span>
                Quick-Check
              </h3>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl">
                  {result.quick_check_result.ampel === 'gruen' ? '\u{1F7E2}' :
                   result.quick_check_result.ampel === 'gelb' ? '\u{1F7E1}' : '\u{1F534}'}
                </span>
                <p className="text-lg font-bold text-primary">{result.quick_check_result.empfehlung}</p>
                <span className="text-lg text-slate">{result.quick_check_result.bestanden}/{result.quick_check_result.gesamt} Kriterien</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.quick_check_result.checks).map(([key, value]) => (
                  <div key={key} className={`rounded-xl p-4 flex items-center gap-3 ${value ? 'bg-green-50' : 'bg-red-50'}`}>
                    <span>{value ? '\u{2705}' : '\u{274C}'}</span>
                    <span className="text-sm">{key.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projektionen Tab */}
      {activeTab === 'projektionen' && hasExtendedData && (
        <div className="space-y-8">
          {/* NEW: Full Live Calculator */}
          <LiveCalculator
            kaufpreis={propertyData?.kaufpreis || 0}
            monatlicheMiete={propertyData?.aktuelle_miete || 0}
            hausgeld={propertyData?.hausgeld || propertyData?.nebenkosten || 0}
            wohnflaeche={propertyData?.wohnflaeche || 0}
            baujahr={propertyData?.baujahr || null}
            initialValues={{
              eigenkapital: result.cashflow_analyse?.eigenkapital || 0,
              zinssatz: result.cashflow_analyse?.zinssatz_prozent || 3.75,
              tilgung: result.cashflow_analyse?.tilgung_prozent || 1.5
            }}
          />

          {/* Charts */}
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <CashflowChart szenarien={result.szenarien} />
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <TilgungsChart tilgungsplan={activeTilgungsplan} />
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <ZinsTilgungChart tilgungsplan={activeTilgungsplan} />
          </div>
        </div>
      )}

      {/* Szenarien Tab */}
      {activeTab === 'szenarien' && hasExtendedData && (
        <div className="space-y-8">
          <div className="glass-light rounded-3xl shadow-2xl p-10 card-hover">
            <ScenarioComparison
              szenarien={result.szenarien}
              onSelectScenario={setSelectedScenario}
            />
          </div>

          {/* Show selected scenario details */}
          {selectedScenario && (
            <div className="glass-light rounded-3xl shadow-2xl p-10 card-hover">
              <h4 className="text-lg font-bold text-primary mb-6">
                Details: {selectedScenario.name} Szenario
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <TilgungsChart tilgungsplan={selectedScenario.tilgungsplan} />
                <ZinsTilgungChart tilgungsplan={selectedScenario.tilgungsplan} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optionen Tab - Finanzierung & Miet-Variationen */}
      {activeTab === 'optionen' && hasExtendedData && (
        <div className="space-y-8">
          {/* Financing Options */}
          {result.finanzierungsoptionen && (
            <FinancingOptions optionen={result.finanzierungsoptionen} />
          )}

          {/* Rental Variations */}
          {result.miet_variationen && (
            <RentalVariations variationen={result.miet_variationen} />
          )}

          {/* Sensitivity Matrix */}
          {result.sensitivity_analyse && (
            <SensitivityMatrix sensitivity={result.sensitivity_analyse} />
          )}
        </div>
      )}

      {/* Vergleich Tab - Investment Comparison & Milestones */}
      {activeTab === 'vergleich' && hasExtendedData && (
        <div className="space-y-8">
          {/* Investment Comparison */}
          {result.investment_vergleich && (
            <InvestmentComparison vergleich={result.investment_vergleich} />
          )}

          {/* Milestones Timeline */}
          {result.meilensteine && (
            <MilestonesTimeline meilensteine={result.meilensteine} />
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="glass border-2 border-accent/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-accent font-bold mb-2">Rechtlicher Hinweis</p>
            <p className="text-slate text-sm leading-relaxed">
              Diese Analyse basiert auf den eingegebenen Daten und KI-gestützten Schätzungen.
              Sie ersetzt keine professionelle Immobilienbewertung, Rechts- oder Finanzberatung.
              Die tatsächlichen Marktbedingungen und individuellen Umstände können erheblich abweichen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
