import React, { useState, useCallback } from 'react';

function PropertyForm({ initialData, onAnalyze, onBack }) {
  const [formData, setFormData] = useState({
    kaufpreis: initialData?.kaufpreis || '',
    wohnflaeche: initialData?.wohnflaeche || '',
    zimmer: initialData?.zimmer || '',
    baujahr: initialData?.baujahr || '',
    etage: initialData?.etage || '',
    nebenkosten: initialData?.nebenkosten || '',
    hausgeld: initialData?.hausgeld || '',
    energieklasse: initialData?.energieklasse || '',
    heizungsart: initialData?.heizungsart || '',
    adresse: initialData?.adresse || '',
    stadt: initialData?.stadt || '',
    stadtteil: initialData?.stadtteil || '',
    objekttyp: initialData?.objekttyp || '',
    zustand: initialData?.zustand || '',
    ausstattung: initialData?.ausstattung || '',
    balkon_terrasse: initialData?.balkon_terrasse || false,
    keller: initialData?.keller || false,
    stellplatz: initialData?.stellplatz || '',
    vermietet: initialData?.vermietet || false,
    aktuelle_miete: initialData?.aktuelle_miete || '',
    verkaufertyp: initialData?.verkaufertyp || '',
    provision: initialData?.provision || '',
  });

  const [verwendungszweck, setVerwendungszweck] = useState('kapitalanlage');
  const [finanzierung, setFinanzierung] = useState({
    eigenkapital: 0,
    zinssatz: 3.75,
    tilgung: 1.25,
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleFinanzierungChange = useCallback((e) => {
    const { name, value } = e.target;
    setFinanzierung(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const processedData = {
      ...formData,
      kaufpreis: formData.kaufpreis ? parseFloat(formData.kaufpreis) : null,
      wohnflaeche: formData.wohnflaeche ? parseFloat(formData.wohnflaeche) : null,
      zimmer: formData.zimmer ? parseFloat(formData.zimmer) : null,
      baujahr: formData.baujahr ? parseInt(formData.baujahr) : null,
      nebenkosten: formData.nebenkosten ? parseFloat(formData.nebenkosten) : null,
      hausgeld: formData.hausgeld ? parseFloat(formData.hausgeld) : null,
      aktuelle_miete: formData.aktuelle_miete ? parseFloat(formData.aktuelle_miete) : null,
    };

    onAnalyze(processedData, verwendungszweck, finanzierung);
  }, [formData, verwendungszweck, finanzierung, onAnalyze]);

  const inputClass = "w-full px-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder:text-text-muted";
  const labelClass = "block text-sm font-semibold text-text-secondary mb-2";
  const selectClass = "w-full px-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white";

  return (
    <div className="fade-in">
      <div className="glass-card rounded-3xl p-10 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="text-gradient-neon">Objektdaten</span>
            </h2>
            <p className="text-text-secondary">Geben Sie die Immobiliendaten ein</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 glass-neon text-text-secondary font-medium rounded-xl hover:text-neon-blue hover:border-neon-blue/50 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zuruck
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Verwendungszweck */}
          <div className="mb-10">
            <label className={labelClass}>Verwendungszweck</label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setVerwendungszweck('kapitalanlage')}
                className={`py-5 px-6 rounded-2xl border-2 font-semibold transition-all text-lg
                  ${verwendungszweck === 'kapitalanlage'
                    ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-neon-blue'
                    : 'border-white/20 text-text-secondary hover:border-neon-blue/50 hover:text-neon-blue'}`}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">💰</span>
                  Kapitalanlage
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVerwendungszweck('eigennutzung')}
                className={`py-5 px-6 rounded-2xl border-2 font-semibold transition-all text-lg
                  ${verwendungszweck === 'eigennutzung'
                    ? 'border-neon-purple bg-neon-purple/20 text-neon-purple shadow-neon-purple'
                    : 'border-white/20 text-text-secondary hover:border-neon-purple/50 hover:text-neon-purple'}`}
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🏠</span>
                  Eigennutzung
                </span>
              </button>
            </div>
          </div>

          {/* Hauptdaten */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Kaufpreis (EUR) *</label>
              <input
                type="number"
                name="kaufpreis"
                value={formData.kaufpreis}
                onChange={handleChange}
                required
                placeholder="z.B. 350000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Wohnflache (m2) *</label>
              <input
                type="number"
                name="wohnflaeche"
                value={formData.wohnflaeche}
                onChange={handleChange}
                required
                placeholder="z.B. 75"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Zimmer</label>
              <input
                type="number"
                step="0.5"
                name="zimmer"
                value={formData.zimmer}
                onChange={handleChange}
                placeholder="z.B. 3"
                className={inputClass}
              />
            </div>
          </div>

          {/* Lage */}
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-blue/30">📍</span>
            <span className="text-neon-blue">Lage</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Stadt *</label>
              <input
                type="text"
                name="stadt"
                value={formData.stadt}
                onChange={handleChange}
                required
                placeholder="z.B. Munchen"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stadtteil</label>
              <input
                type="text"
                name="stadtteil"
                value={formData.stadtteil}
                onChange={handleChange}
                placeholder="z.B. Schwabing"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                placeholder="z.B. Musterstrasse 12"
                className={inputClass}
              />
            </div>
          </div>

          {/* Objektdetails */}
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center text-xl border border-neon-purple/30">🏢</span>
            <span className="text-neon-purple">Objektdetails</span>
          </h3>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className={labelClass}>Baujahr</label>
              <input
                type="number"
                name="baujahr"
                value={formData.baujahr}
                onChange={handleChange}
                placeholder="z.B. 1985"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Etage</label>
              <input
                type="text"
                name="etage"
                value={formData.etage}
                onChange={handleChange}
                placeholder="z.B. 2. OG"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Objekttyp</label>
              <select
                name="objekttyp"
                value={formData.objekttyp}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Bitte wahlen</option>
                <option value="Eigentumswohnung">Eigentumswohnung</option>
                <option value="Einfamilienhaus">Einfamilienhaus</option>
                <option value="Doppelhaushalfte">Doppelhaushalfte</option>
                <option value="Reihenhaus">Reihenhaus</option>
                <option value="Mehrfamilienhaus">Mehrfamilienhaus</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Zustand</label>
              <select
                name="zustand"
                value={formData.zustand}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Bitte wahlen</option>
                <option value="Neubau">Neubau</option>
                <option value="Neuwertig">Neuwertig</option>
                <option value="Modernisiert">Modernisiert</option>
                <option value="Gepflegt">Gepflegt</option>
                <option value="Renovierungsbedurftig">Renovierungsbedurftig</option>
              </select>
            </div>
          </div>

          {/* Energie */}
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center text-xl border border-neon-green/30">⚡</span>
            <span className="text-neon-green">Energie</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className={labelClass}>Energieklasse</label>
              <select
                name="energieklasse"
                value={formData.energieklasse}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Bitte wahlen</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Heizungsart</label>
              <input
                type="text"
                name="heizungsart"
                value={formData.heizungsart}
                onChange={handleChange}
                placeholder="z.B. Gas-Zentralheizung"
                className={inputClass}
              />
            </div>
          </div>

          {/* Kosten */}
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl border border-accent/30">💶</span>
            <span className="text-accent">Kosten</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Hausgeld / Monat (EUR)</label>
              <input
                type="number"
                name="hausgeld"
                value={formData.hausgeld}
                onChange={handleChange}
                placeholder="z.B. 250"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Verkaufertyp</label>
              <select
                name="verkaufertyp"
                value={formData.verkaufertyp}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Bitte wahlen</option>
                <option value="Privat">Privat</option>
                <option value="Makler">Makler</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Provision</label>
              <input
                type="text"
                name="provision"
                value={formData.provision}
                onChange={handleChange}
                placeholder="z.B. 3,57% oder provisionsfrei"
                className={inputClass}
              />
            </div>
          </div>

          {/* Ausstattung */}
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-neon-pink/20 rounded-xl flex items-center justify-center text-xl border border-neon-pink/30">✨</span>
            <span className="text-neon-pink">Ausstattung</span>
          </h3>
          <div className="flex flex-wrap gap-6 mb-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="balkon_terrasse"
                checked={formData.balkon_terrasse}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-neon-blue focus:ring-neon-blue/50"
              />
              <span className="text-text-secondary group-hover:text-white transition-colors">Balkon / Terrasse</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="keller"
                checked={formData.keller}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-neon-blue focus:ring-neon-blue/50"
              />
              <span className="text-text-secondary group-hover:text-white transition-colors">Keller</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary">Stellplatz:</label>
              <select
                name="stellplatz"
                value={formData.stellplatz}
                onChange={handleChange}
                className="px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none text-white"
              >
                <option value="">Keiner</option>
                <option value="Tiefgarage">Tiefgarage</option>
                <option value="Aussenstellplatz">Aussenstellplatz</option>
                <option value="Garage">Garage</option>
              </select>
            </div>
          </div>

          {/* Vermietung (nur bei Kapitalanlage) */}
          {verwendungszweck === 'kapitalanlage' && (
            <>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-blue/30">🔑</span>
                <span className="text-neon-blue">Vermietung</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="vermietet"
                      checked={formData.vermietet}
                      onChange={handleChange}
                      className="w-5 h-5 rounded bg-surface border-white/20 text-neon-blue focus:ring-neon-blue/50"
                    />
                    <span className="text-text-secondary group-hover:text-white transition-colors">Aktuell vermietet</span>
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Aktuelle Kaltmiete / Monat (EUR)</label>
                  <input
                    type="number"
                    name="aktuelle_miete"
                    value={formData.aktuelle_miete}
                    onChange={handleChange}
                    placeholder="z.B. 850"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Finanzierung */}
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center text-xl border border-neon-purple/30">🏦</span>
                <span className="text-neon-purple">Finanzierung</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className={labelClass}>Eigenkapital (EUR)</label>
                  <input
                    type="number"
                    name="eigenkapital"
                    value={finanzierung.eigenkapital}
                    onChange={handleFinanzierungChange}
                    placeholder="0 = 100% Finanzierung"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Zinssatz (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="zinssatz"
                    value={finanzierung.zinssatz}
                    onChange={handleFinanzierungChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tilgung (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="tilgung"
                    value={finanzierung.tilgung}
                    onChange={handleFinanzierungChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-5 btn-neon font-bold rounded-2xl text-xl mt-4"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Immobilie bewerten
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;
