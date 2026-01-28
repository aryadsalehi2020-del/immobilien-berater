import React, { useState } from 'react';
import { useUserProfile, INVESTMENT_GOALS, RISK_PROFILES, EXPERIENCE_LEVELS } from '../contexts/UserProfileContext';

function UserGoalsForm({ onComplete, compact = false }) {
  const { profile, updateProfile, isProfileComplete } = useUserProfile();
  const [activeStep, setActiveStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const steps = [
    { id: 'goal', title: 'Investitionsziel', icon: '🎯' },
    { id: 'risk', title: 'Risikoprofil', icon: '⚖️' },
    { id: 'experience', title: 'Erfahrung', icon: '📊' }
  ];

  const handleGoalSelect = (goal) => {
    updateProfile({ goal });
    if (!compact) setActiveStep(1);
  };

  const handleRiskSelect = (riskProfile) => {
    updateProfile({ riskProfile });
    if (!compact) setActiveStep(2);
  };

  const handleExperienceSelect = (experience) => {
    updateProfile({ experience });
    if (onComplete && isProfileComplete) {
      onComplete();
    }
  };

  const handleFinancialUpdate = (field, value) => {
    updateProfile({ [field]: value });
  };

  // Kompakte Ansicht für Einbettung in Analyze-Seite
  if (compact) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-neon-purple/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Dein Investorenprofil
        </h3>

        {/* Goal Selection - Compact */}
        <div className="mb-4">
          <label className="text-sm text-text-secondary mb-2 block">Investitionsziel</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(INVESTMENT_GOALS).map(([key, goal]) => (
              <button
                key={key}
                onClick={() => handleGoalSelect(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  profile.goal === key
                    ? `bg-${goal.color}/20 border border-${goal.color} text-${goal.color}`
                    : 'bg-white/5 border border-white/10 text-text-secondary hover:border-white/30'
                }`}
                style={profile.goal === key ? {
                  backgroundColor: `var(--${goal.color}, rgba(74, 222, 128, 0.2))`,
                  borderColor: `var(--${goal.color}, #4ade80)`
                } : {}}
              >
                <span>{goal.icon}</span>
                <span>{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Risk Profile - Compact */}
        <div className="mb-4">
          <label className="text-sm text-text-secondary mb-2 block">Risikoprofil</label>
          <div className="flex gap-2">
            {Object.entries(RISK_PROFILES).map(([key, risk]) => (
              <button
                key={key}
                onClick={() => handleRiskSelect(key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  profile.riskProfile === key
                    ? 'bg-neon-blue/20 border border-neon-blue text-neon-blue'
                    : 'bg-white/5 border border-white/10 text-text-secondary hover:border-white/30'
                }`}
              >
                <span className="mr-1">{risk.icon}</span>
                {risk.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience - Compact */}
        <div className="mb-4">
          <label className="text-sm text-text-secondary mb-2 block">Erfahrungslevel</label>
          <div className="flex gap-2">
            {Object.entries(EXPERIENCE_LEVELS).map(([key, exp]) => (
              <button
                key={key}
                onClick={() => handleExperienceSelect(key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  profile.experience === key
                    ? 'bg-neon-purple/20 border border-neon-purple text-neon-purple'
                    : 'bg-white/5 border border-white/10 text-text-secondary hover:border-white/30'
                }`}
              >
                <span className="mr-1">{exp.icon}</span>
                {exp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Advanced */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-text-muted hover:text-neon-blue transition-colors flex items-center gap-1"
        >
          {showAdvanced ? '▼' : '▶'} Erweiterte Einstellungen
        </button>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Eigenkapital</label>
                <input
                  type="number"
                  value={profile.eigenkapital}
                  onChange={(e) => handleFinancialUpdate('eigenkapital', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Max. Kaufpreis</label>
                <input
                  type="number"
                  value={profile.maxKaufpreis}
                  onChange={(e) => handleFinancialUpdate('maxKaufpreis', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none"
                  placeholder="300000"
                />
              </div>
            </div>

            {profile.goal === 'cashflow' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Mind. Cashflow/Monat</label>
                  <input
                    type="number"
                    value={profile.mindestCashflow}
                    onChange={(e) => handleFinancialUpdate('mindestCashflow', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Mind. Rendite %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.mindestRendite}
                    onChange={(e) => handleFinancialUpdate('mindestRendite', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-neon-blue focus:outline-none"
                    placeholder="4"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Status */}
        <div className={`mt-4 p-3 rounded-lg ${isProfileComplete ? 'bg-neon-green/10 border border-neon-green/30' : 'bg-accent/10 border border-accent/30'}`}>
          <p className={`text-sm font-medium ${isProfileComplete ? 'text-neon-green' : 'text-accent'}`}>
            {isProfileComplete ? '✓ Profil vollständig - Scores werden personalisiert' : '⚠ Bitte alle Felder ausfüllen für personalisierte Bewertung'}
          </p>
        </div>
      </div>
    );
  }

  // Vollständige Step-by-Step Ansicht
  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeStep === index
                  ? 'bg-neon-blue/20 border border-neon-blue text-neon-blue'
                  : index < activeStep
                    ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                    : 'bg-white/5 border border-white/10 text-text-secondary'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="font-medium">{step.title}</span>
              {index < activeStep && <span>✓</span>}
            </button>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${index < activeStep ? 'bg-neon-green' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-2xl p-8 border border-white/10">
        {/* Step 1: Investment Goal */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Was ist dein Investitionsziel?</h2>
              <p className="text-text-secondary">Wähle dein primäres Ziel - die Bewertung wird darauf optimiert</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(INVESTMENT_GOALS).map(([key, goal]) => (
                <button
                  key={key}
                  onClick={() => handleGoalSelect(key)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left group hover:scale-[1.02] ${
                    profile.goal === key
                      ? 'border-neon-green bg-neon-green/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <h3 className={`text-lg font-bold mb-1 ${profile.goal === key ? 'text-neon-green' : 'text-white'}`}>
                    {goal.label}
                  </h3>
                  <p className="text-sm text-text-secondary">{goal.description}</p>
                  {profile.goal === key && (
                    <div className="mt-3 text-neon-green text-sm font-medium">✓ Ausgewählt</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Risk Profile */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Wie ist deine Risikobereitschaft?</h2>
              <p className="text-text-secondary">Dies beeinflusst die Gewichtung von Sicherheits-Kriterien</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(RISK_PROFILES).map(([key, risk]) => (
                <button
                  key={key}
                  onClick={() => handleRiskSelect(key)}
                  className={`p-8 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] ${
                    profile.riskProfile === key
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="text-5xl mb-4">{risk.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${profile.riskProfile === key ? 'text-neon-blue' : 'text-white'}`}>
                    {risk.label}
                  </h3>
                  <p className="text-sm text-text-secondary">{risk.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Wie viel Erfahrung hast du?</h2>
              <p className="text-text-secondary">Anfänger erhalten mehr Warnhinweise und Erklärungen</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(EXPERIENCE_LEVELS).map(([key, exp]) => (
                <button
                  key={key}
                  onClick={() => handleExperienceSelect(key)}
                  className={`p-8 rounded-2xl border-2 transition-all text-center hover:scale-[1.02] ${
                    profile.experience === key
                      ? 'border-neon-purple bg-neon-purple/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="text-5xl mb-4">{exp.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 ${profile.experience === key ? 'text-neon-purple' : 'text-white'}`}>
                    {exp.label}
                  </h3>
                  <p className="text-sm text-text-secondary">{exp.description}</p>
                </button>
              ))}
            </div>

            {/* Completion Message */}
            {isProfileComplete && (
              <div className="mt-8 p-6 bg-neon-green/10 border border-neon-green/30 rounded-2xl text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-neon-green mb-2">Profil vollständig!</h3>
                <p className="text-text-secondary mb-4">
                  Deine Analysen werden jetzt auf <strong>{INVESTMENT_GOALS[profile.goal]?.label}</strong> optimiert
                </p>
                {onComplete && (
                  <button
                    onClick={onComplete}
                    className="px-6 py-3 btn-neon rounded-xl font-bold"
                  >
                    Weiter zur Analyse
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeStep === 0
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-secondary hover:text-white border border-white/10 hover:border-white/30'
          }`}
        >
          ← Zurück
        </button>
        {activeStep < 2 && (
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="px-6 py-3 btn-neon rounded-xl font-bold"
          >
            Weiter →
          </button>
        )}
      </div>
    </div>
  );
}

export default UserGoalsForm;
