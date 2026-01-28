import React, { useMemo } from 'react';

function CreditChanceIndicator({ profile, kaufpreis }) {
  const { chance, faktoren, tipps } = useMemo(() => {
    if (!profile || !kaufpreis) {
      return { chance: 0, faktoren: [], tipps: [] };
    }

    let basisChance = 50;
    const faktoren = [];
    const tipps = [];

    // 1. Eigenkapitalquote
    const eigenkapital = parseFloat(profile.eigenkapital) || 0;
    const ekQuote = (eigenkapital / kaufpreis) * 100;

    if (ekQuote >= 30) {
      basisChance += 20;
      faktoren.push({ text: 'Sehr gute EK-Quote (30%+)', effekt: +20, typ: 'positiv' });
    } else if (ekQuote >= 20) {
      basisChance += 15;
      faktoren.push({ text: 'Gute EK-Quote (20%+)', effekt: +15, typ: 'positiv' });
    } else if (ekQuote >= 10) {
      basisChance += 5;
      faktoren.push({ text: 'EK-Quote 10-20%', effekt: +5, typ: 'neutral' });
    } else if (ekQuote > 0) {
      basisChance -= 5;
      faktoren.push({ text: 'Niedrige EK-Quote (<10%)', effekt: -5, typ: 'negativ' });
      tipps.push({
        icon: '💡',
        titel: 'Eigenkapital erhohen',
        text: 'Mit bestehendem Vermogen (Depot, LV, Riester) konnen Sie Ihr EK aufstocken'
      });
    } else {
      basisChance -= 15;
      faktoren.push({ text: 'Kein Eigenkapital', effekt: -15, typ: 'negativ' });
      tipps.push({
        icon: '🏦',
        titel: '100% Finanzierung moglich',
        text: 'Einige Banken finanzieren 100% bei guter Bonitat. KfW-Kredit als EK-Ersatz pruefen!'
      });
    }

    // 2. Berufsgruppe
    if (profile.beruf === 'beamte') {
      basisChance += 15;
      faktoren.push({ text: 'Beamtenstatus (beste Bonitat)', effekt: +15, typ: 'positiv' });
    } else if (profile.beruf === 'angestellt') {
      basisChance += 10;
      faktoren.push({ text: 'Unbefristete Anstellung', effekt: +10, typ: 'positiv' });
    } else if (profile.beruf === 'selbststaendig') {
      basisChance -= 5;
      faktoren.push({ text: 'Selbststandig (3 Jahre Steuerbescheide notig)', effekt: -5, typ: 'neutral' });
      tipps.push({
        icon: '📊',
        titel: 'Selbststandigen-freundliche Banken',
        text: 'ING, Sparda-Banken und KfW haben keine Aufschlage fur Selbststandige!'
      });
    } else if (profile.beruf === 'befristet') {
      basisChance -= 10;
      faktoren.push({ text: 'Befristete Anstellung', effekt: -10, typ: 'negativ' });
      tipps.push({
        icon: '⏳',
        titel: 'Entfristung anstreben',
        text: 'Nach Entfristung steigen Ihre Chancen erheblich. Alternativ: Zweiten Kreditnehmer einbeziehen.'
      });
    }

    // 3. Probezeit
    if (profile.probezeit) {
      basisChance -= 20;
      faktoren.push({ text: 'In der Probezeit', effekt: -20, typ: 'negativ' });
      tipps.push({
        icon: '⚠️',
        titel: 'Nach Probezeit warten',
        text: 'Die meisten Banken lehnen wahrend der Probezeit ab. Warten Sie wenn moglich.'
      });
    }

    // 4. SCHUFA
    if (profile.schufa === 'sehr-gut') {
      basisChance += 10;
      faktoren.push({ text: 'Sehr guter SCHUFA-Score', effekt: +10, typ: 'positiv' });
    } else if (profile.schufa === 'gut') {
      basisChance += 5;
      faktoren.push({ text: 'Guter SCHUFA-Score', effekt: +5, typ: 'positiv' });
    } else if (profile.schufa === 'mittel') {
      basisChance -= 10;
      faktoren.push({ text: 'Mittlerer SCHUFA-Score', effekt: -10, typ: 'negativ' });
      tipps.push({
        icon: '📋',
        titel: 'SCHUFA bereinigen',
        text: 'Nicht mehr genutzte Konten kundigen, Kreditkarten reduzieren, Selbstauskunft prufen'
      });
    } else if (profile.schufa === 'schlecht') {
      basisChance -= 25;
      faktoren.push({ text: 'Problematischer SCHUFA-Score', effekt: -25, typ: 'negativ' });
      tipps.push({
        icon: '🔧',
        titel: 'SCHUFA verbessern',
        text: 'Erst alte Eintrage loschen lassen (nach 3 Jahren automatisch). Von Essen Bank akzeptiert auch schwache SCHUFA.'
      });
    }

    // 5. Bestehende Kredite
    const bestehendeKredite = parseFloat(profile.bestehendeKredite) || 0;
    const einkommen = parseFloat(profile.jahreseinkommen) || 0;
    const monatlichesNetto = einkommen * 0.6 / 12; // Grobe Schatzung

    if (bestehendeKredite > 0 && monatlichesNetto > 0) {
      const kreditBelastung = (bestehendeKredite / monatlichesNetto) * 100;
      if (kreditBelastung > 20) {
        basisChance -= 15;
        faktoren.push({ text: 'Hohe bestehende Kreditbelastung', effekt: -15, typ: 'negativ' });
        tipps.push({
          icon: '💳',
          titel: 'Kredite ablosen',
          text: 'Bestehende Kredite vor Immobilienkauf ablosen oder umschulden. Verbessert Bonitat erheblich!'
        });
      } else if (kreditBelastung > 10) {
        basisChance -= 5;
        faktoren.push({ text: 'Moderate bestehende Kredite', effekt: -5, typ: 'neutral' });
      }
    }

    // 6. Zusatzliches Vermogen (EK-Ersatz)
    let zusatzEK = 0;
    if (profile.hatDepot && profile.depotWert) {
      zusatzEK += parseFloat(profile.depotWert) * 0.7; // 70% beleihbar
      faktoren.push({ text: 'Wertpapierdepot als Sicherheit', effekt: +5, typ: 'positiv' });
      basisChance += 5;
    }
    if (profile.hatLebensversicherung && profile.lvRueckkaufswert) {
      zusatzEK += parseFloat(profile.lvRueckkaufswert);
      faktoren.push({ text: 'Lebensversicherung als Sicherheit', effekt: +5, typ: 'positiv' });
      basisChance += 5;
    }
    if (profile.hatRiester && profile.riesterGuthaben) {
      zusatzEK += parseFloat(profile.riesterGuthaben);
      faktoren.push({ text: 'Wohn-Riester verfugbar', effekt: +3, typ: 'positiv' });
      basisChance += 3;
    }
    if (profile.hatBausparvertrag && profile.bausparGuthaben) {
      zusatzEK += parseFloat(profile.bausparGuthaben);
      faktoren.push({ text: 'Bausparvertrag vorhanden', effekt: +5, typ: 'positiv' });
      basisChance += 5;
    }

    // 7. Kinder + Einkommen = KfW-Forderung
    const kinder = parseInt(profile.kinder) || 0;
    if (kinder > 0 && einkommen > 0) {
      const kfwGrenze = 90000 + (kinder * 10000);
      if (einkommen <= kfwGrenze) {
        basisChance += 10;
        faktoren.push({ text: `KfW-Forderung moglich (${kinder} Kind${kinder > 1 ? 'er' : ''})`, effekt: +10, typ: 'positiv' });
        tipps.push({
          icon: '🎉',
          titel: 'KfW 300 "Wohneigentum fur Familien"',
          text: `Sie erfullen die Voraussetzungen! Kredit bis ${170000 + (Math.min(kinder, 5) * 20000)}EUR zu nur 1,12% Zins!`
        });
      }
    }

    // 8. Verheiratet = bessere Chancen
    if (profile.verheiratet) {
      basisChance += 5;
      faktoren.push({ text: 'Zwei Kreditnehmer moglich', effekt: +5, typ: 'positiv' });
    }

    // Begrenzung auf 0-100
    const finalChance = Math.max(0, Math.min(100, basisChance));

    // Standard-Tipps bei niedriger Chance
    if (finalChance < 50) {
      tipps.push({
        icon: '🏦',
        titel: 'Vermittler einschalten',
        text: 'Interhyp, Dr. Klein oder Baufi24 haben 500+ Bankpartner und finden auch fur schwierige Falle Losungen'
      });
    }

    return { chance: finalChance, faktoren, tipps };
  }, [profile, kaufpreis]);

  const getChanceColor = (c) => {
    if (c >= 70) return { color: 'neon-green', label: 'Sehr gut', emoji: '🟢' };
    if (c >= 50) return { color: 'accent', label: 'Gut', emoji: '🟡' };
    if (c >= 30) return { color: 'orange-400', label: 'Schwierig', emoji: '🟠' };
    return { color: 'red-400', label: 'Kritisch', emoji: '🔴' };
  };

  const chanceInfo = getChanceColor(chance);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        <span className="text-gradient-neon">Kredit-Chancen-Analyse</span>
      </h3>

      {/* Haupt-Anzeige */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          {/* Hintergrund-Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="40"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50" cy="50" r="40"
              stroke={chance >= 70 ? '#22c55e' : chance >= 50 ? '#fbbf24' : chance >= 30 ? '#f97316' : '#ef4444'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${chance * 2.51} 251`}
              style={{
                filter: `drop-shadow(0 0 10px ${chance >= 70 ? 'rgba(34, 197, 94, 0.5)' : chance >= 50 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(239, 68, 68, 0.5)'})`
              }}
            />
          </svg>
          {/* Zahl in der Mitte */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-black text-${chanceInfo.color}`} style={{
              textShadow: `0 0 20px ${chance >= 70 ? 'rgba(34, 197, 94, 0.5)' : chance >= 50 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
            }}>
              {chance}%
            </span>
            <span className="text-text-secondary text-sm mt-1">{chanceInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Bewertungsbalken */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Kritisch</span>
          <span>Schwierig</span>
          <span>Gut</span>
          <span>Sehr gut</span>
        </div>
        <div className="h-3 bg-surface rounded-full overflow-hidden flex">
          <div className="h-full bg-red-500" style={{ width: '25%' }}></div>
          <div className="h-full bg-orange-400" style={{ width: '25%' }}></div>
          <div className="h-full bg-accent" style={{ width: '25%' }}></div>
          <div className="h-full bg-neon-green" style={{ width: '25%' }}></div>
        </div>
        <div
          className="w-3 h-3 bg-white rounded-full border-2 border-background -mt-3 transition-all duration-500"
          style={{ marginLeft: `calc(${chance}% - 6px)` }}
        />
      </div>

      {/* Faktoren */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Einflussfaktoren</h4>
        {faktoren.map((faktor, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-text-secondary">{faktor.text}</span>
            <span className={`font-bold ${
              faktor.typ === 'positiv' ? 'text-neon-green' :
              faktor.typ === 'negativ' ? 'text-red-400' : 'text-accent'
            }`}>
              {faktor.effekt > 0 ? '+' : ''}{faktor.effekt}%
            </span>
          </div>
        ))}
      </div>

      {/* Profi-Tipps */}
      {tipps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
            {chance < 50 ? '🚨 Profi-Tipps zur Verbesserung' : '💡 Optimierungstipps'}
          </h4>
          {tipps.map((tipp, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${
              chance < 50 ? 'bg-accent/10 border-accent/30' : 'bg-neon-blue/10 border-neon-blue/30'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tipp.icon}</span>
                <div>
                  <p className={`font-bold ${chance < 50 ? 'text-accent' : 'text-neon-blue'}`}>{tipp.titel}</p>
                  <p className="text-text-secondary text-sm mt-1">{tipp.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreditChanceIndicator;
