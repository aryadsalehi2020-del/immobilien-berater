import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';

function FairPriceCalculator({ analysisData }) {
  const { token } = useAuth();
  const [values, setValues] = useState({
    kaufpreis: analysisData?.kaufpreis || 300000,
    kaltmiete: analysisData?.kaltmiete || 950,
    hausgeld: analysisData?.hausgeld || 280,
    wohnflaeche: analysisData?.wohnflaeche || 75,
    vergleichspreisProQm: analysisData?.vergleichspreisProQm || 3500,
    zielRendite: 4.5,
    zielFaktor: 22,
    zinssatz: 3.8,
    tilgungssatz: 1.5
  });
  const [stadtInput, setStadtInput] = useState('');
  const [isLoadingMarkt, setIsLoadingMarkt] = useState(false);
  const [marktdatenInfo, setMarktdatenInfo] = useState(null);

  const fetchLiveMarktdaten = async () => {
    if (!stadtInput.trim()) return;
    setIsLoadingMarkt(true);
    try {
      const response = await fetch(`${API_BASE}/search-market-data?stadt=${encodeURIComponent(stadtInput)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.kaufpreis_qm_durchschnitt) {
          setValues(v => ({ ...v, vergleichspreisProQm: Math.round(data.kaufpreis_qm_durchschnitt) }));
          setMarktdatenInfo({
            standort: data.standort,
            quelle: data.recherche_methode === 'live_web_search_v3' ? 'Live-Recherche' : 'Schätzung',
            preis: data.kaufpreis_qm_durchschnitt
          });
        }
      }
    } catch (error) {
      console.error('Marktdaten-Fehler:', error);
    } finally {
      setIsLoadingMarkt(false);
    }
  };

  const calculation = useMemo(() => {
    const {
      kaufpreis,
      kaltmiete,
      hausgeld,
      wohnflaeche,
      vergleichspreisProQm,
      zielRendite,
      zielFaktor,
      zinssatz,
      tilgungssatz
    } = values;

    const jahresmiete = kaltmiete * 12;
    const aktuellerFaktor = kaufpreis / jahresmiete;
    const aktuelleBruttorendite = (jahresmiete / kaufpreis) * 100;
    const preisProQm = kaufpreis / wohnflaeche;

    // Methode 1: Nach Zielrendite
    const nachRendite = Math.round(jahresmiete / (zielRendite / 100));

    // Methode 2: Nach Kaufpreisfaktor
    const nachFaktor = Math.round(jahresmiete * zielFaktor);

    // Methode 3: Nach Vergleichspreis/m²
    const nachVergleich = Math.round(vergleichspreisProQm * wohnflaeche);

    // Methode 4: Für Cashflow-Neutralität
    const nichtUmlagefaehig = hausgeld * 0.30;
    const verfuegbarFuerRate = kaltmiete - nichtUmlagefaehig;
    const jahresRate = verfuegbarFuerRate * 12;
    const maxKreditFuerCashflow0 = jahresRate / (zinssatz / 100 + tilgungssatz / 100);
    const nachCashflow = Math.round(maxKreditFuerCashflow0 * 0.88); // 12% Nebenkosten abziehen

    // Gewichteter Durchschnitt
    const fairerPreis = Math.round(
      (nachRendite * 0.3 + nachFaktor * 0.3 + nachVergleich * 0.2 + nachCashflow * 0.2)
    );

    // Differenz zum aktuellen Preis
    const differenz = kaufpreis - fairerPreis;
    const differenzProzent = ((kaufpreis / fairerPreis) - 1) * 100;

    // Empfehlung
    let empfehlung;
    let empfehlungFarbe;
    if (differenzProzent <= -5) {
      empfehlung = 'Schnäppchen! Preis liegt unter dem fairen Wert.';
      empfehlungFarbe = 'neon-green';
    } else if (differenzProzent <= 5) {
      empfehlung = 'Fairer Preis. Kaufen wenn Objekt passt.';
      empfehlungFarbe = 'neon-green';
    } else if (differenzProzent <= 15) {
      empfehlung = 'Leicht überteuert. Preisverhandlung empfohlen.';
      empfehlungFarbe = 'accent';
    } else if (differenzProzent <= 25) {
      empfehlung = 'Deutlich überteuert. Nur bei starken Argumenten kaufen.';
      empfehlungFarbe = 'orange-400';
    } else {
      empfehlung = 'Stark überteuert. Finger weg oder aggressiv verhandeln!';
      empfehlungFarbe = 'red-400';
    }

    return {
      aktuell: {
        kaufpreis,
        faktor: aktuellerFaktor,
        rendite: aktuelleBruttorendite,
        preisProQm
      },
      methoden: [
        {
          name: 'Nach Zielrendite',
          preis: nachRendite,
          beschreibung: `Preis für ${zielRendite}% Bruttorendite`,
          gewicht: '30%'
        },
        {
          name: 'Nach Kaufpreisfaktor',
          preis: nachFaktor,
          beschreibung: `Preis für Faktor ${zielFaktor}`,
          gewicht: '30%'
        },
        {
          name: 'Nach Vergleichspreisen',
          preis: nachVergleich,
          beschreibung: `${vergleichspreisProQm}€/m² × ${wohnflaeche}m²`,
          gewicht: '20%'
        },
        {
          name: 'Für Cashflow-Neutral',
          preis: nachCashflow,
          beschreibung: 'Max. Preis für Cashflow = 0',
          gewicht: '20%'
        }
      ],
      fairerPreis,
      differenz,
      differenzProzent,
      empfehlung,
      empfehlungFarbe,
      verhandlungsziel: Math.round(fairerPreis * 0.95) // 5% unter fair
    };
  }, [values]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-xl flex items-center justify-center text-xl border border-accent/30">⚖️</span>
          <span className="text-gradient-neon">Fairer Preis Rechner</span>
        </h3>
        <p className="text-text-secondary text-sm mt-1">
          Berechnen Sie den objektiven Marktwert und das optimale Verhandlungsziel
        </p>
      </div>

      {/* Live-Marktdaten Section */}
      <div className="glass-card rounded-2xl p-4 border border-neon-blue/30 bg-neon-blue/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm text-neon-blue font-medium mb-2">🔴 Live-Marktdaten laden</label>
            <input
              type="text"
              value={stadtInput}
              onChange={(e) => setStadtInput(e.target.value)}
              placeholder="Stadt eingeben (z.B. München, Hamburg-Eimsbüttel)"
              className="w-full px-3 py-2 bg-surface border border-neon-blue/30 rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <button
            onClick={fetchLiveMarktdaten}
            disabled={isLoadingMarkt || !stadtInput.trim()}
            className="px-4 py-2 bg-neon-blue text-white rounded-lg font-medium hover:bg-neon-blue/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {isLoadingMarkt ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Lade...
              </>
            ) : (
              <>📊 Preise abrufen</>
            )}
          </button>
        </div>
        {marktdatenInfo && (
          <div className="mt-3 p-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-sm">
            <span className="text-neon-green font-medium">✓ {marktdatenInfo.standort}:</span>
            <span className="text-white ml-2">{marktdatenInfo.preis.toLocaleString('de-DE')} €/m²</span>
            <span className="text-text-muted ml-2">({marktdatenInfo.quelle})</span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Objektdaten</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Kaufpreis</label>
            <input
              type="number"
              value={values.kaufpreis}
              onChange={(e) => setValues(v => ({ ...v, kaufpreis: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Kaltmiete/Monat</label>
            <input
              type="number"
              value={values.kaltmiete}
              onChange={(e) => setValues(v => ({ ...v, kaltmiete: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Wohnfläche m²</label>
            <input
              type="number"
              value={values.wohnflaeche}
              onChange={(e) => setValues(v => ({ ...v, wohnflaeche: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Vergleichspreis €/m²
              {marktdatenInfo && <span className="text-neon-green text-xs ml-1">(Live)</span>}
            </label>
            <input
              type="number"
              value={values.vergleichspreisProQm}
              onChange={(e) => setValues(v => ({ ...v, vergleichspreisProQm: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
        </div>

        <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 mt-6">Zielwerte</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Ziel-Bruttorendite %</label>
            <input
              type="number"
              step="0.1"
              value={values.zielRendite}
              onChange={(e) => setValues(v => ({ ...v, zielRendite: parseFloat(e.target.value) || 4 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Ziel-Kaufpreisfaktor</label>
            <input
              type="number"
              value={values.zielFaktor}
              onChange={(e) => setValues(v => ({ ...v, zielFaktor: parseInt(e.target.value) || 20 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Zinssatz %</label>
            <input
              type="number"
              step="0.1"
              value={values.zinssatz}
              onChange={(e) => setValues(v => ({ ...v, zinssatz: parseFloat(e.target.value) || 3 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Tilgung %</label>
            <input
              type="number"
              step="0.1"
              value={values.tilgungssatz}
              onChange={(e) => setValues(v => ({ ...v, tilgungssatz: parseFloat(e.target.value) || 1 }))}
              className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-white text-right focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Aktueller vs. Fairer Preis */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4">Preisvergleich</h4>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Aktueller Preis</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(calculation.aktuell.kaufpreis)}</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-text-muted">
                <span>Faktor {calculation.aktuell.faktor.toFixed(1)}</span>
                <span>{calculation.aktuell.rendite.toFixed(2)}% Rendite</span>
                <span>{formatCurrency(calculation.aktuell.preisProQm)}/m²</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className={`px-4 py-2 rounded-full font-bold ${
                calculation.differenzProzent > 0
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-neon-green/20 text-neon-green'
              }`}>
                {calculation.differenzProzent > 0 ? '+' : ''}{calculation.differenzProzent.toFixed(1)}%
                ({calculation.differenz > 0 ? '+' : ''}{formatCurrency(calculation.differenz)})
              </div>
            </div>

            <div className="p-4 bg-neon-green/10 rounded-xl border border-neon-green/30">
              <div className="flex justify-between items-center">
                <span className="text-neon-green font-medium">Fairer Preis</span>
                <span className="text-2xl font-bold text-neon-green">{formatCurrency(calculation.fairerPreis)}</span>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
              <div className="flex justify-between items-center">
                <span className="text-accent font-medium">Verhandlungsziel (-5%)</span>
                <span className="text-xl font-bold text-accent">{formatCurrency(calculation.verhandlungsziel)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bewertungsmethoden */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4">Bewertungsmethoden</h4>

          <div className="space-y-3">
            {calculation.methoden.map((methode, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{methode.name}</p>
                    <p className="text-xs text-text-muted">{methode.beschreibung}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{formatCurrency(methode.preis)}</p>
                    <p className="text-xs text-text-muted">Gewicht: {methode.gewicht}</p>
                  </div>
                </div>
                {/* Visual bar */}
                <div className="mt-2 h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      methode.preis >= values.kaufpreis ? 'bg-neon-green' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((methode.preis / values.kaufpreis) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empfehlung */}
      <div className="glass-card rounded-xl p-5 border"
           style={{
             borderColor: calculation.empfehlungFarbe === 'neon-green' ? 'rgba(34, 197, 94, 0.3)' :
                          calculation.empfehlungFarbe === 'accent' ? 'rgba(251, 191, 36, 0.3)' :
                          calculation.empfehlungFarbe === 'orange-400' ? 'rgba(251, 146, 60, 0.3)' :
                          'rgba(248, 113, 113, 0.3)',
             backgroundColor: calculation.empfehlungFarbe === 'neon-green' ? 'rgba(34, 197, 94, 0.05)' :
                              calculation.empfehlungFarbe === 'accent' ? 'rgba(251, 191, 36, 0.05)' :
                              calculation.empfehlungFarbe === 'orange-400' ? 'rgba(251, 146, 60, 0.05)' :
                              'rgba(248, 113, 113, 0.05)'
           }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
               style={{
                 backgroundColor: calculation.empfehlungFarbe === 'neon-green' ? 'rgba(34, 197, 94, 0.2)' :
                                  calculation.empfehlungFarbe === 'accent' ? 'rgba(251, 191, 36, 0.2)' :
                                  calculation.empfehlungFarbe === 'orange-400' ? 'rgba(251, 146, 60, 0.2)' :
                                  'rgba(248, 113, 113, 0.2)'
               }}>
            {calculation.differenzProzent <= 5 ? '✅' : calculation.differenzProzent <= 15 ? '⚠️' : '❌'}
          </div>
          <div>
            <p className="font-bold text-white text-lg">{calculation.empfehlung}</p>
            {calculation.differenz > 0 && (
              <p className="text-text-secondary text-sm mt-1">
                Verhandlungsargument: "Der faire Marktpreis liegt bei {formatCurrency(calculation.fairerPreis)}.
                Mein maximales Angebot ist {formatCurrency(calculation.verhandlungsziel)}."
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FairPriceCalculator;
