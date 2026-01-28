import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, INVESTMENT_GOALS, RISK_PROFILES, EXPERIENCE_LEVELS } from '../contexts/UserProfileContext';
import UserProfileForm from '../components/UserProfileForm';
import UserGoalsForm from '../components/UserGoalsForm';
import CreditChanceIndicator from '../components/CreditChanceIndicator';
import SmartTipsPanel from '../components/SmartTipsPanel';
import { formatCurrency, ENERGY_CLASSES } from '../constants';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {};
  });

  const [testKaufpreis, setTestKaufpreis] = useState(300000);
  const [testImmobilie, setTestImmobilie] = useState({
    kaufpreis: 300000,
    energieKlasse: 'D',
    verwendungszweck: 'kapitalanlage'
  });

  const [activeSection, setActiveSection] = useState('profil'); // profil, test, tipps

  // Speichere Profil bei Änderung
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
  };

  // Berechne Gesamtvermögen
  const gesamtEK = () => {
    let summe = parseFloat(profile.eigenkapital) || 0;
    if (profile.hatDepot) summe += (parseFloat(profile.depotWert) || 0) * 0.7;
    if (profile.hatLebensversicherung) summe += parseFloat(profile.lvRueckkaufswert) || 0;
    if (profile.hatRiester) summe += parseFloat(profile.riesterGuthaben) || 0;
    if (profile.hatBausparvertrag) summe += parseFloat(profile.bausparGuthaben) || 0;
    return summe;
  };

  // Profilstärke berechnen
  const getProfileStrength = () => {
    let filled = 0;
    const fields = ['eigenkapital', 'jahreseinkommen', 'beruf', 'kinder', 'bundesland', 'schufa'];
    fields.forEach(f => { if (profile[f]) filled++; });
    if (profile.hatDepot || profile.hatLebensversicherung || profile.hatRiester || profile.hatBausparvertrag) filled++;
    return Math.round((filled / 7) * 100);
  };

  const profileStrength = getProfileStrength();

  return (
    <div className="p-8 bg-mesh-animated min-h-screen relative">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/10 -top-48 -right-48" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/10 bottom-0 left-1/4" style={{ animationDelay: '5s' }} />
        <div className="glow-orb w-64 h-64 bg-neon-green/5 top-1/3 right-1/3" style={{ animationDelay: '10s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="text-gradient-neon">Mein Finanzprofil</span>
              </h1>
              <p className="text-text-secondary text-lg">
                Ihr persönliches Profil für optimale Finanzierungs- und Fördertipps
              </p>
            </div>

            {/* Profile Strength Indicator */}
            <div className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke={profileStrength >= 70 ? '#22c55e' : profileStrength >= 40 ? '#fbbf24' : '#ef4444'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${profileStrength * 0.94} 94`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {profileStrength}%
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">Profil-Vollständigkeit</p>
                <p className="text-text-muted text-sm">
                  {profileStrength >= 70 ? 'Sehr gut ausgefüllt' : profileStrength >= 40 ? 'Mehr Details = bessere Tipps' : 'Bitte ausfüllen'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in fade-in-delay-1">
          <div className="glass-card rounded-xl p-5 border border-neon-blue/20">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Direktes Eigenkapital</p>
            <p className="text-2xl font-bold text-neon-blue text-glow-blue">
              {formatCurrency(parseFloat(profile.eigenkapital) || 0)}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5 border border-neon-purple/20">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Inkl. EK-Ersatz</p>
            <p className="text-2xl font-bold text-neon-purple text-glow-purple">
              {formatCurrency(gesamtEK())}
            </p>
            {gesamtEK() > (parseFloat(profile.eigenkapital) || 0) && (
              <p className="text-xs text-neon-green mt-1">
                +{formatCurrency(gesamtEK() - (parseFloat(profile.eigenkapital) || 0))} Ersatz
              </p>
            )}
          </div>
          <div className="glass-card rounded-xl p-5 border border-neon-green/20">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Jahreseinkommen</p>
            <p className="text-2xl font-bold text-neon-green" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}>
              {formatCurrency(parseFloat(profile.jahreseinkommen) || 0)}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5 border border-accent/20">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Familiensituation</p>
            <p className="text-2xl font-bold text-accent">
              {profile.kinder > 0 ? `${profile.kinder} Kind${profile.kinder > 1 ? 'er' : ''}` : 'Keine Kinder'}
            </p>
            {profile.verheiratet && <p className="text-xs text-text-muted mt-1">Verheiratet</p>}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card rounded-2xl p-2 border border-white/10 fade-in fade-in-delay-2">
          <div className="flex gap-2">
            {[
              { id: 'profil', label: 'Profil bearbeiten', icon: '👤' },
              { id: 'test', label: 'Kredit-Chance testen', icon: '🧪' },
              { id: 'tipps', label: 'Spar-Tipps', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active section */}
        {activeSection === 'profil' && (
          <div className="grid lg:grid-cols-3 gap-8 fade-in">
            {/* Profil-Formular */}
            <div className="lg:col-span-2">
              <UserProfileForm profile={profile} onProfileChange={handleProfileChange} />
            </div>

            {/* Kredit-Chance Anzeige (Mini) */}
            <div className="space-y-6">
              <CreditChanceIndicator profile={profile} kaufpreis={testKaufpreis} />

              {/* Speicher-Hinweis */}
              <div className="glass-card rounded-xl p-4 border border-neon-green/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💾</span>
                  <div>
                    <p className="text-neon-green font-medium text-sm">Automatisch gespeichert</p>
                    <p className="text-text-secondary text-xs">Daten bleiben lokal in Ihrem Browser</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'test' && (
          <div className="grid lg:grid-cols-2 gap-8 fade-in">
            {/* Test-Konfiguration */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-blue/30">🏠</span>
                <span className="text-neon-blue">Test-Immobilie konfigurieren</span>
              </h3>

              <div className="space-y-6">
                {/* Kaufpreis Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-text-secondary">Kaufpreis</label>
                    <span className="text-2xl font-bold text-neon-blue">{formatCurrency(testKaufpreis)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1500000}
                    step={10000}
                    value={testKaufpreis}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setTestKaufpreis(value);
                      setTestImmobilie(prev => ({ ...prev, kaufpreis: value }));
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>50.000 €</span>
                    <span>1.500.000 €</span>
                  </div>
                </div>

                {/* EK-Quote Anzeige */}
                {testKaufpreis > 0 && gesamtEK() > 0 && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-secondary">Ihre EK-Quote</span>
                      <span className={`text-lg font-bold ${
                        (gesamtEK() / testKaufpreis) >= 0.2 ? 'text-neon-green' :
                        (gesamtEK() / testKaufpreis) >= 0.1 ? 'text-accent' : 'text-red-400'
                      }`}>
                        {((gesamtEK() / testKaufpreis) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (gesamtEK() / testKaufpreis) >= 0.2 ? 'bg-neon-green' :
                          (gesamtEK() / testKaufpreis) >= 0.1 ? 'bg-accent' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.min((gesamtEK() / testKaufpreis) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      {(gesamtEK() / testKaufpreis) >= 0.2
                        ? '✓ Sehr gute EK-Quote - beste Zinskonditionen'
                        : (gesamtEK() / testKaufpreis) >= 0.1
                          ? 'Akzeptable EK-Quote - mittlere Konditionen'
                          : '⚠ Niedrige EK-Quote - höhere Zinsen oder EK-Ersatz nutzen'}
                    </p>
                  </div>
                )}

                {/* Energieklasse */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-3">Energieklasse</label>
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                    {ENERGY_CLASSES.map(k => (
                      <button
                        key={k}
                        onClick={() => setTestImmobilie(prev => ({ ...prev, energieKlasse: k }))}
                        className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                          testImmobilie.energieKlasse === k
                            ? k <= 'B' ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green' :
                              k <= 'D' ? 'bg-accent/20 border border-accent/50 text-accent' :
                              'bg-red-500/20 border border-red-500/50 text-red-400'
                            : 'border border-white/20 text-text-secondary hover:border-white/40'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                  {['F', 'G', 'H'].includes(testImmobilie.energieKlasse) && (
                    <p className="text-xs text-neon-green mt-2">
                      💡 KfW 308 "Jung kauft Alt" möglicherweise verfügbar!
                    </p>
                  )}
                </div>

                {/* Verwendungszweck */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-3">Verwendungszweck</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTestImmobilie(prev => ({ ...prev, verwendungszweck: 'kapitalanlage' }))}
                      className={`py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                        testImmobilie.verwendungszweck === 'kapitalanlage'
                          ? 'bg-neon-purple/20 border-2 border-neon-purple/50 text-neon-purple'
                          : 'border border-white/20 text-text-secondary hover:border-white/40'
                      }`}
                    >
                      <span className="text-2xl">💰</span>
                      Kapitalanlage
                    </button>
                    <button
                      onClick={() => setTestImmobilie(prev => ({ ...prev, verwendungszweck: 'eigennutzung' }))}
                      className={`py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                        testImmobilie.verwendungszweck === 'eigennutzung'
                          ? 'bg-neon-blue/20 border-2 border-neon-blue/50 text-neon-blue'
                          : 'border border-white/20 text-text-secondary hover:border-white/40'
                      }`}
                    >
                      <span className="text-2xl">🏠</span>
                      Eigennutzung
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Kredit-Chance Anzeige */}
            <div>
              <CreditChanceIndicator profile={profile} kaufpreis={testKaufpreis} />
            </div>
          </div>
        )}

        {activeSection === 'tipps' && (
          <div className="fade-in">
            <SmartTipsPanel profile={profile} immobilie={testImmobilie} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
