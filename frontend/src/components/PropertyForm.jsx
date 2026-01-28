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
    verkäufertyp: initialData?.verkäufertyp || '',
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
    
    // Convert string values to numbers where needed
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

  const inputClass = "w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary placeholder:text-slate/50";
  const labelClass = "block text-sm font-semibold text-primary mb-2";

  return (
    <div className="fade-in">
      <div className="glass-light rounded-3xl shadow-2xl p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Objektdaten
            </h2>
            <p className="text-slate">Geben Sie die Immobiliendaten ein</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 border-2 border-slate/30 text-primary font-medium rounded-xl hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück
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
                    ? 'border-accent bg-gradient-gold text-primary shadow-lg'
                    : 'border-slate/30 text-primary hover:border-accent hover:bg-accent/5'}`}
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
                    ? 'border-accent bg-gradient-gold text-primary shadow-lg'
                    : 'border-slate/30 text-primary hover:border-accent hover:bg-accent/5'}`}
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
              <label className={labelClass}>Kaufpreis (€) *</label>
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
              <label className={labelClass}>Wohnfläche (m²) *</label>
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
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">📍</span>
            Lage
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
                placeholder="z.B. München"
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
                placeholder="z.B. Musterstraße 12"
                className={inputClass}
              />
            </div>
          </div>

          {/* Objektdetails */}
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">🏢</span>
            Objektdetails
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
                className={inputClass}
              >
                <option value="">Bitte wählen</option>
                <option value="Eigentumswohnung">Eigentumswohnung</option>
                <option value="Einfamilienhaus">Einfamilienhaus</option>
                <option value="Doppelhaushälfte">Doppelhaushälfte</option>
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
                className={inputClass}
              >
                <option value="">Bitte wählen</option>
                <option value="Neubau">Neubau</option>
                <option value="Neuwertig">Neuwertig</option>
                <option value="Modernisiert">Modernisiert</option>
                <option value="Gepflegt">Gepflegt</option>
                <option value="Renovierungsbedürftig">Renovierungsbedürftig</option>
              </select>
            </div>
          </div>

          {/* Energie */}
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">⚡</span>
            Energie
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className={labelClass}>Energieklasse</label>
              <select
                name="energieklasse"
                value={formData.energieklasse}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Bitte wählen</option>
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
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">💶</span>
            Kosten
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Hausgeld / Monat (€)</label>
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
              <label className={labelClass}>Verkäufertyp</label>
              <select
                name="verkäufertyp"
                value={formData.verkäufertyp}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Bitte wählen</option>
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
          <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">✨</span>
            Ausstattung
          </h3>
          <div className="flex flex-wrap gap-6 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="balkon_terrasse"
                checked={formData.balkon_terrasse}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span>Balkon / Terrasse</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="keller"
                checked={formData.keller}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span>Keller</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Stellplatz:</label>
              <select
                name="stellplatz"
                value={formData.stellplatz}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none"
              >
                <option value="">Keiner</option>
                <option value="Tiefgarage">Tiefgarage</option>
                <option value="Außenstellplatz">Außenstellplatz</option>
                <option value="Garage">Garage</option>
              </select>
            </div>
          </div>

          {/* Vermietung (nur bei Kapitalanlage) */}
          {verwendungszweck === 'kapitalanlage' && (
            <>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">🔑</span>
                Vermietung
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      name="vermietet"
                      checked={formData.vermietet}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span>Aktuell vermietet</span>
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Aktuelle Kaltmiete / Monat (€)</label>
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
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl">🏦</span>
                Finanzierung
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className={labelClass}>Eigenkapital (€)</label>
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
            className="w-full py-5 bg-gradient-gold text-primary font-bold rounded-2xl
              btn-premium shadow-2xl text-xl mt-4"
          >
            <span className="flex items-center justify-center gap-3">
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
