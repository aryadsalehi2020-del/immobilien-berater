import React, { useMemo, useState } from 'react';
import { GRUNDERWERBSTEUER, formatCurrency } from '../constants';

function SmartTipsPanel({ profile, immobilie }) {
  const [expandedTipps, setExpandedTipps] = useState(new Set([0])); // First tip expanded by default
  const [filterKategorie, setFilterKategorie] = useState('alle');

  const toggleTipp = (index) => {
    const newExpanded = new Set(expandedTipps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTipps(newExpanded);
  };

  const relevanteTipps = useMemo(() => {
    if (!profile) return [];

    const tipps = [];
    const eigenkapital = parseFloat(profile.eigenkapital) || 0;
    const einkommen = parseFloat(profile.jahreseinkommen) || 0;
    const kinder = parseInt(profile.kinder) || 0;
    const kaufpreis = immobilie?.kaufpreis || 0;

    // KfW-Förderungen
    if (kinder > 0 && einkommen > 0) {
      const kfwGrenze = 90000 + (kinder * 10000);
      const verheiratetBonus = profile.verheiratet ? 10000 : 0;

      if (einkommen <= (kfwGrenze + verheiratetBonus)) {
        const maxKredit = 170000 + Math.min(kinder, 5) * 20000;
        const zinsErsparnis = maxKredit * 0.025 * 10; // ca. 2.5% Differenz über 10 Jahre
        tipps.push({
          kategorie: 'KfW-Förderung',
          icon: '🏠',
          titel: 'KfW 300: Wohneigentum für Familien',
          prioritaet: 'hoch',
          ersparnis: zinsErsparnis,
          ersparnisText: `${formatCurrency(zinsErsparnis)} Zinsersparnis`,
          zusammenfassung: `Kredit bis ${formatCurrency(maxKredit)} zu nur 1,12% Zins`,
          details: [
            `Ihr Haushaltseinkommen (${formatCurrency(einkommen)}) liegt unter der Grenze von ${formatCurrency(kfwGrenze + verheiratetBonus)}`,
            `Mit ${kinder} Kind${kinder > 1 ? 'ern' : ''}: Maximaler Kredit ${formatCurrency(maxKredit)}`,
            'Zinssatz nur 1,12% (Stand 2025) - deutlich unter Marktniveau!',
            'Wichtig: Antrag VOR Kaufvertrag stellen!',
            'Über jede Bank beantragbar'
          ],
          aktion: 'KfW-Förderung prüfen',
          aktionLink: 'https://www.kfw.de/300'
        });
      }

      // Jung kauft Alt
      if (immobilie?.energieKlasse && ['F', 'G', 'H'].includes(immobilie.energieKlasse)) {
        const maxKreditJkA = 100000 + (kinder >= 3 ? 50000 : 0);
        tipps.push({
          kategorie: 'KfW-Förderung',
          icon: '🏚️',
          titel: 'KfW 308: Jung kauft Alt',
          prioritaet: 'hoch',
          ersparnis: maxKreditJkA * 0.02 * 10,
          ersparnisText: `${formatCurrency(maxKreditJkA * 0.02 * 10)} potenzielle Ersparnis`,
          zusammenfassung: `Sanierungskredit bis ${formatCurrency(maxKreditJkA)} zu Sonderkonditionen`,
          details: [
            `Energieklasse ${immobilie.energieKlasse} qualifiziert für dieses Programm!`,
            `Kredit bis ${formatCurrency(maxKreditJkA)} zu 1,12% Zins`,
            'Sanierung auf Effizienzhaus 85 EE innerhalb 54 Monaten erforderlich',
            'Kombinierbar mit Heizungsförderung (BEG EM)',
            'Kann zusätzlich zur KfW 300 beantragt werden'
          ],
          aktion: 'Programm prüfen',
          aktionLink: 'https://www.kfw.de/308'
        });
      }
    }

    // Allgemeine KfW 124
    tipps.push({
      kategorie: 'KfW-Förderung',
      icon: '🏦',
      titel: 'KfW 124: Wohneigentumsprogramm',
      prioritaet: 'mittel',
      ersparnis: 8000,
      ersparnisText: 'ca. 5.000-15.000 EUR über Laufzeit',
      zusammenfassung: 'Bis 100.000 EUR zu ca. 3,4-3,9% Zins - für jeden verfügbar',
      details: [
        'Kredit bis 100.000 EUR zu ca. 3,4-3,9% Zins',
        'KEINE Einkommensgrenzen - für jeden Käufer!',
        'Keine Eigenkapitalanforderung',
        'Über jede Hausbank beantragbar',
        'Tilgungsfreie Anlaufzeit möglich'
      ],
      aktion: 'Bei Hausbank anfragen'
    });

    // Eigenkapital-Ersatz Tipps
    if (eigenkapital < kaufpreis * 0.2 && kaufpreis > 0) {
      if (profile.hatDepot && profile.depotWert) {
        const beleihbar = parseFloat(profile.depotWert) * 0.7;
        tipps.push({
          kategorie: 'Eigenkapital-Ersatz',
          icon: '📈',
          titel: 'Depot beleihen (Lombardkredit)',
          prioritaet: 'hoch',
          ersparnis: beleihbar * 0.015, // ca. 1.5% bessere Konditionen durch mehr EK
          ersparnisText: `Bis ${formatCurrency(beleihbar)} als EK nutzbar`,
          zusammenfassung: 'Wertpapiere als Sicherheit nutzen, ohne zu verkaufen',
          details: [
            `Ihr Depot (${formatCurrency(parseFloat(profile.depotWert))}) ist bis 70% beleihbar`,
            `Das entspricht ${formatCurrency(beleihbar)} zusätzlichem Eigenkapital`,
            'Top-Anbieter: Scalable PRIME+ (3,24%), DEGIRO (4,75%)',
            'Vorteil: Depot bleibt in Ihrem Besitz, profitiert weiter von Kursen',
            'Achtung: Bei Kursverlusten kann Nachschusspflicht entstehen'
          ],
          aktion: 'Broker vergleichen'
        });
      }

      if (profile.hatLebensversicherung && profile.lvRueckkaufswert) {
        const lvWert = parseFloat(profile.lvRueckkaufswert);
        tipps.push({
          kategorie: 'Eigenkapital-Ersatz',
          icon: '💼',
          titel: 'Lebensversicherung beleihen',
          prioritaet: 'hoch',
          ersparnis: lvWert * 0.015,
          ersparnisText: `Bis ${formatCurrency(lvWert)} als EK`,
          zusammenfassung: 'Policendarlehen ohne Kündigung der Versicherung',
          details: [
            'Bis 100% des Rückkaufswertes beleihbar',
            'Versicherungsschutz bleibt vollständig erhalten!',
            'Kein SCHUFA-Eintrag bei den meisten Anbietern',
            'Anbieter: Lifefinance (4,59%), SWK Bank (5,99%)',
            'Deutlich günstiger als Ratenkredite'
          ],
          aktion: 'Angebot einholen'
        });
      }

      if (profile.hatRiester && profile.riesterGuthaben) {
        const riesterWert = parseFloat(profile.riesterGuthaben);
        tipps.push({
          kategorie: 'Eigenkapital-Ersatz',
          icon: '🏠',
          titel: 'Wohn-Riester nutzen',
          prioritaet: 'mittel',
          ersparnis: riesterWert,
          ersparnisText: `${formatCurrency(riesterWert)} direkt entnehmbar`,
          zusammenfassung: 'Riester-Guthaben für Eigenheimkauf verwenden',
          details: [
            '100% des Guthabens für Immobilienkauf entnehmbar',
            'Alle bisherigen Zulagen bleiben erhalten',
            'Achtung: Nachgelagerte Besteuerung im Alter (Wohnförderkonto)',
            'Option: Einmalzahlung bei Renteneintritt mit 30% Rabatt',
            'Nur für selbstgenutzte Immobilien'
          ],
          aktion: 'Riester-Anbieter kontaktieren'
        });
      }
    }

    // Steuer-Tipps (nur für Kapitalanleger)
    if (immobilie?.verwendungszweck === 'kapitalanlage') {
      tipps.push({
        kategorie: 'Steuer-Optimierung',
        icon: '📊',
        titel: 'Kaufpreisaufteilung optimieren',
        prioritaet: 'mittel',
        ersparnis: kaufpreis * 0.015,
        ersparnisText: `${formatCurrency(kaufpreis * 0.015)} über 50 Jahre möglich`,
        zusammenfassung: 'Gebäudeanteil maximieren für höhere AfA-Abschreibung',
        details: [
          'Nur der Gebäudeanteil ist abschreibbar (2% p.a. bzw. 3% bei Neubau)',
          'BMF-Arbeitshilfe oft ungünstig - eigenes Gutachten lohnt sich!',
          'Im Kaufvertrag Aufteilung vereinbaren (Verkäufer einbeziehen)',
          'Gutachterkosten: 1.500-3.000 EUR, Ersparnis: oft 30.000+ EUR',
          'Finanzamt muss plausibles Gutachten akzeptieren'
        ],
        aktion: 'Gutachter suchen'
      });

      const grstSatz = getGrunderwerbsteuerSatz(profile.bundesland);
      const inventarErsparnis = Math.min(kaufpreis * 0.15, 50000) * grstSatz / 100;
      tipps.push({
        kategorie: 'Steuer-Optimierung',
        icon: '💶',
        titel: 'Inventar separat ausweisen',
        prioritaet: 'mittel',
        ersparnis: inventarErsparnis,
        ersparnisText: `Bis ${formatCurrency(inventarErsparnis)} GrESt-Ersparnis`,
        zusammenfassung: 'Einbauküche & Inventar sind nicht grunderwerbsteuerpflichtig',
        details: [
          'Einbauküche, Markisen, Sauna etc. sind NICHT grunderwerbsteuerpflichtig',
          'Finanzamt akzeptiert bis 15% des Kaufpreises ohne Nachweise',
          'Im Kaufvertrag separat mit Werten auflisten',
          `Bei ${grstSatz}% GrESt in ${profile.bundesland}: ${formatCurrency(inventarErsparnis)} Ersparnis möglich`,
          'Möbel, Gartengeräte, Einbauschränke einbeziehen'
        ],
        aktion: 'Im Kaufvertrag aufnehmen'
      });
    }

    // Landesförderung nach Bundesland
    const landesTipp = getLandesfoerderung(profile.bundesland);
    if (landesTipp) {
      tipps.push(landesTipp);
    }

    // Selbstständige
    if (profile.beruf === 'selbststaendig') {
      tipps.push({
        kategorie: 'Finanzierung',
        icon: '📋',
        titel: 'Selbstständigen-freundliche Banken',
        prioritaet: 'hoch',
        ersparnis: kaufpreis * 0.005,
        ersparnisText: 'Vermeidet 0,3-0,5% Zinsaufschlag',
        zusammenfassung: 'Diese Banken haben keine Aufschläge für Selbstständige',
        details: [
          'ING: Keine Aufschläge für Selbstständige! Beliebter Top-Anbieter',
          'Sparda-Banken: Positiv-Listen für Freiberufler wie Ärzte, Anwälte',
          'KfW: Behandelt Selbstständige wie Angestellte (über Hausbank)',
          'Sparkassen/Volksbanken: Individuelle Prüfung, Beziehung hilft',
          'Tipp: 3 Jahre Steuerbescheide + BWA vorbereiten'
        ],
        aktion: 'Banken vergleichen'
      });
    }

    // SCHUFA-Tipps bei mittlerem/schlechtem Score
    if (profile.schufa === 'mittel' || profile.schufa === 'schlecht') {
      tipps.push({
        kategorie: 'Bonität',
        icon: '📋',
        titel: 'SCHUFA-Score verbessern',
        prioritaet: profile.schufa === 'schlecht' ? 'hoch' : 'mittel',
        ersparnis: kaufpreis * 0.008,
        ersparnisText: 'Bis 0,5% bessere Zinsen möglich',
        zusammenfassung: 'Schnelle Maßnahmen zur Score-Verbesserung',
        details: [
          'Nicht mehr genutzte Konten & Kreditkarten kündigen',
          'Kostenlose SCHUFA-Selbstauskunft anfordern, Fehler melden',
          'Alte negative Einträge löschen lassen (nach 3 Jahren automatisch)',
          'Von Essen Bank: Akzeptiert auch schwächere SCHUFA',
          'Kredit zu zweit beantragen verbessert Chancen erheblich'
        ],
        aktion: 'SCHUFA-Auskunft anfordern'
      });
    }

    // Grunderwerbsteuer-Vergleich bei hohen Sätzen
    const grstSatz = getGrunderwerbsteuerSatz(profile.bundesland);
    if (grstSatz >= 6 && kaufpreis > 0) {
      const niedrigsterSatz = 3.5;
      const differenz = (grstSatz - niedrigsterSatz) / 100 * kaufpreis;
      tipps.push({
        kategorie: 'Info',
        icon: '🗺️',
        titel: 'Grunderwerbsteuer-Vergleich',
        prioritaet: 'info',
        ersparnis: differenz,
        ersparnisText: `${formatCurrency(differenz)} vs. Bayern/Sachsen`,
        zusammenfassung: `${profile.bundesland} hat ${grstSatz}% - Bayern/Sachsen nur 3,5%`,
        details: [
          `${profile.bundesland}: ${grstSatz}% Grunderwerbsteuer`,
          'Bayern & Sachsen: Nur 3,5% (niedrigster Satz)',
          'Bei Grenzregionen: Standortwahl prüfen',
          `Differenz bei ${formatCurrency(kaufpreis)}: ${formatCurrency(differenz)}`,
          'Hinweis: Umzug nur für GrESt-Ersparnis meist nicht sinnvoll'
        ]
      });
    }

    // Sortieren nach Priorität und Ersparnis
    const prioritaetOrder = { 'hoch': 0, 'mittel': 1, 'info': 2 };
    return tipps.sort((a, b) => {
      const prioCompare = prioritaetOrder[a.prioritaet] - prioritaetOrder[b.prioritaet];
      if (prioCompare !== 0) return prioCompare;
      return (b.ersparnis || 0) - (a.ersparnis || 0);
    });
  }, [profile, immobilie]);

  const kategorien = ['alle', ...new Set(relevanteTipps.map(t => t.kategorie))];
  const gefilterteTipps = filterKategorie === 'alle'
    ? relevanteTipps
    : relevanteTipps.filter(t => t.kategorie === filterKategorie);

  const gesamtErsparnis = relevanteTipps
    .filter(t => t.prioritaet !== 'info')
    .reduce((sum, t) => sum + (t.ersparnis || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-green/30">🎓</span>
            <span className="text-gradient-neon">Personalisierte Spar-Tipps</span>
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            {relevanteTipps.length} Tipps für Sie • Potenzielle Ersparnis: <span className="text-neon-green font-bold">{formatCurrency(gesamtErsparnis)}</span>
          </p>
        </div>
      </div>

      {/* Kategorie Filter */}
      {relevanteTipps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {kategorien.map((kat) => (
            <button
              key={kat}
              onClick={() => setFilterKategorie(kat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterKategorie === kat
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {kat === 'alle' ? 'Alle Tipps' : kat}
              {kat !== 'alle' && (
                <span className="ml-2 opacity-60">
                  ({relevanteTipps.filter(t => t.kategorie === kat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tipps Liste */}
      {relevanteTipps.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Profil ausfüllen für Tipps</h4>
          <p className="text-text-secondary">
            Füllen Sie Ihr Finanzprofil aus, um personalisierte Spar-Tipps zu erhalten
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gefilterteTipps.map((tipp, idx) => {
            const isExpanded = expandedTipps.has(idx);
            const originalIndex = relevanteTipps.indexOf(tipp);

            return (
              <div
                key={idx}
                className={`glass-card rounded-2xl border overflow-hidden transition-all ${
                  tipp.prioritaet === 'hoch'
                    ? 'border-neon-green/30'
                    : tipp.prioritaet === 'mittel'
                      ? 'border-neon-blue/30'
                      : 'border-white/10'
                }`}
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => toggleTipp(originalIndex)}
                  className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    tipp.prioritaet === 'hoch'
                      ? 'bg-neon-green/20 border border-neon-green/30'
                      : tipp.prioritaet === 'mittel'
                        ? 'bg-neon-blue/20 border border-neon-blue/30'
                        : 'bg-white/10 border border-white/10'
                  }`}>
                    {tipp.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        tipp.prioritaet === 'hoch' ? 'text-neon-green' :
                        tipp.prioritaet === 'mittel' ? 'text-neon-blue' : 'text-text-muted'
                      }`}>
                        {tipp.kategorie}
                      </span>
                      {tipp.prioritaet === 'hoch' && (
                        <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green text-xs rounded-full font-bold animate-pulse">
                          Hohe Priorität
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white">{tipp.titel}</h4>
                    <p className="text-sm text-text-secondary mt-1">{tipp.zusammenfassung}</p>
                    {tipp.ersparnisText && (
                      <p className={`text-sm font-semibold mt-2 ${
                        tipp.prioritaet === 'hoch' ? 'text-neon-green' :
                        tipp.prioritaet === 'mittel' ? 'text-neon-blue' : 'text-accent'
                      }`}>
                        💰 {tipp.ersparnisText}
                      </p>
                    )}
                  </div>

                  <svg
                    className={`w-6 h-6 text-text-muted transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/10">
                    <div className="pt-4 pl-16">
                      <ul className="space-y-2 mb-4">
                        {tipp.details.map((detail, i) => (
                          <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              tipp.prioritaet === 'hoch' ? 'bg-neon-green/20 text-neon-green' :
                              tipp.prioritaet === 'mittel' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/10 text-text-muted'
                            }`}>
                              {i + 1}
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {tipp.aktion && (
                        <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                          tipp.prioritaet === 'hoch'
                            ? 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30'
                            : 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 border border-neon-blue/30'
                        }`}>
                          {tipp.aktion}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Expand/Collapse All */}
      {relevanteTipps.length > 2 && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (expandedTipps.size === relevanteTipps.length) {
                setExpandedTipps(new Set());
              } else {
                setExpandedTipps(new Set(relevanteTipps.map((_, i) => i)));
              }
            }}
            className="text-sm text-text-muted hover:text-white transition-colors flex items-center gap-2"
          >
            {expandedTipps.size === relevanteTipps.length ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Alle einklappen
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Alle ausklappen
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Hilfsfunktionen
function getGrunderwerbsteuerSatz(bundesland) {
  return GRUNDERWERBSTEUER[bundesland] || 6.0;
}

function getLandesfoerderung(bundesland) {
  const foerderungen = {
    'NRW': {
      kategorie: 'Landesförderung',
      icon: '🏛️',
      titel: 'NRW.BANK Eigentumsförderung',
      prioritaet: 'hoch',
      ersparnis: 40000,
      ersparnisText: 'Zinssatz nur 0,5%!',
      zusammenfassung: 'Extrem günstiges Förderdarlehen für NRW-Bürger',
      details: [
        'Förderdarlehen 100.000-184.000 EUR möglich',
        'Extrem günstiger 0,5% Zins - fast geschenkt!',
        'Einkommensgrenzen: ca. 62.000 EUR (Familie mit 2 Kindern)',
        'Antrag über Ihre Hausbank',
        'Kombinierbar mit KfW-Förderung'
      ],
      aktion: 'NRW.BANK Rechner nutzen'
    },
    'Brandenburg': {
      kategorie: 'Landesförderung',
      icon: '🏛️',
      titel: 'ILB Wohneigentumsförderung',
      prioritaet: 'hoch',
      ersparnis: 80000,
      ersparnisText: 'Bis 230.000 EUR ZINSFREI!',
      zusammenfassung: 'Die beste Landesförderung Deutschlands',
      details: [
        'Darlehen bis 230.000 EUR komplett ZINSFREI!',
        'Gilt für Familien mit Kindern',
        'Beste Immobilienförderung in ganz Deutschland',
        'Einkommensgrenzen beachten',
        'Direktantrag bei ILB'
      ],
      aktion: 'ILB kontaktieren'
    },
    'Berlin': {
      kategorie: 'Landesförderung',
      icon: '🏛️',
      titel: 'IBB Berlin FED-Darlehen',
      prioritaet: 'hoch',
      ersparnis: 30000,
      ersparnisText: 'Echter EK-Ersatz möglich',
      zusammenfassung: 'Nachrangdarlehen ohne 1. Rang im Grundbuch',
      details: [
        'Darlehen bis 230.000 EUR',
        'Braucht NICHT den 1. Rang im Grundbuch',
        'Funktioniert als echter Eigenkapital-Ersatz!',
        'Ideal für Käufer mit wenig EK',
        'Nur für selbstgenutzte Immobilien'
      ],
      aktion: 'IBB kontaktieren'
    },
    'Bayern': {
      kategorie: 'Landesförderung',
      icon: '🏛️',
      titel: 'BayernLabo Eigenwohnraumförderung',
      prioritaet: 'mittel',
      ersparnis: 25000,
      ersparnisText: 'Bis 3% unter Marktzins',
      zusammenfassung: 'Günstige Konditionen plus niedrigste GrESt',
      details: [
        'Zinsverbilligung bis zu 3 Prozentpunkte',
        'Für Familien mit Kindern',
        'Einkommensgrenzen beachten (variiert nach Haushaltsgröße)',
        'Plus: Nur 3,5% Grunderwerbsteuer in Bayern!',
        'Antrag über Landratsamt/Stadt'
      ],
      aktion: 'BayernLabo Rechner nutzen'
    },
    'Baden-Württemberg': {
      kategorie: 'Landesförderung',
      icon: '🏛️',
      titel: 'L-Bank Z15-Darlehen',
      prioritaet: 'mittel',
      ersparnis: 15000,
      ersparnisText: 'Günstige Konditionen',
      zusammenfassung: 'Förderdarlehen für Eigennutzer in BaWü',
      details: [
        'Darlehen bis 100.000 EUR zu günstigen Zinsen',
        'Für selbstgenutztes Wohneigentum',
        'Einkommensgrenzen beachten',
        'Kombinierbar mit KfW-Programmen',
        'Antrag über L-Bank'
      ],
      aktion: 'L-Bank kontaktieren'
    }
  };
  return foerderungen[bundesland] || null;
}

export default SmartTipsPanel;
