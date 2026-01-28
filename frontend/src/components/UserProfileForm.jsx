import React, { useState, useEffect } from 'react';

function UserProfileForm({ profile, onProfileChange }) {
  const [formData, setFormData] = useState({
    jahreseinkommen: profile?.jahreseinkommen || '',
    eigenkapital: profile?.eigenkapital || '',
    beruf: profile?.beruf || 'angestellt',
    kinder: profile?.kinder || 0,
    bundesland: profile?.bundesland || 'Hessen',
    verheiratet: profile?.verheiratet || false,
    // Bestehendes Vermogen
    hatDepot: profile?.hatDepot || false,
    depotWert: profile?.depotWert || '',
    hatLebensversicherung: profile?.hatLebensversicherung || false,
    lvRueckkaufswert: profile?.lvRueckkaufswert || '',
    hatRiester: profile?.hatRiester || false,
    riesterGuthaben: profile?.riesterGuthaben || '',
    hatBausparvertrag: profile?.hatBausparvertrag || false,
    bausparGuthaben: profile?.bausparGuthaben || '',
    // Weitere Angaben
    schufa: profile?.schufa || 'gut',
    befristetAngestellt: profile?.befristetAngestellt || false,
    probezeit: profile?.probezeit || false,
    bestehendeKredite: profile?.bestehendeKredite || '',
  });

  useEffect(() => {
    onProfileChange(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  const bundeslaender = [
    'Baden-Wurttemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'NRW',
    'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt',
    'Schleswig-Holstein', 'Thuringen'
  ];

  const inputClass = "w-full px-4 py-3 bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder:text-text-muted";
  const labelClass = "block text-sm font-semibold text-text-secondary mb-2";

  return (
    <div className="space-y-8">
      {/* Finanzielle Situation */}
      <div className="glass-card rounded-2xl p-6 border border-neon-blue/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-neon-blue/20 rounded-xl flex items-center justify-center text-xl border border-neon-blue/30">💰</span>
          <span className="text-neon-blue">Finanzielle Situation</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Jahreseinkommen brutto (EUR)</label>
            <input
              type="number"
              name="jahreseinkommen"
              value={formData.jahreseinkommen}
              onChange={handleChange}
              placeholder="z.B. 60000"
              className={inputClass}
            />
            <p className="text-xs text-text-muted mt-1">Wichtig fur Forderungsgrenzen</p>
          </div>

          <div>
            <label className={labelClass}>Verfugbares Eigenkapital (EUR)</label>
            <input
              type="number"
              name="eigenkapital"
              value={formData.eigenkapital}
              onChange={handleChange}
              placeholder="z.B. 50000"
              className={inputClass}
            />
            <p className="text-xs text-text-muted mt-1">Bargeld + kurzfristig verfugbar</p>
          </div>

          <div>
            <label className={labelClass}>Bestehende Kreditraten (EUR/Monat)</label>
            <input
              type="number"
              name="bestehendeKredite"
              value={formData.bestehendeKredite}
              onChange={handleChange}
              placeholder="z.B. 300"
              className={inputClass}
            />
            <p className="text-xs text-text-muted mt-1">Auto, Konsumkredit, etc.</p>
          </div>

          <div>
            <label className={labelClass}>SCHUFA-Score</label>
            <select
              name="schufa"
              value={formData.schufa}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="sehr-gut">Sehr gut (97-100%)</option>
              <option value="gut">Gut (90-97%)</option>
              <option value="mittel">Mittel (80-90%)</option>
              <option value="schlecht">Problematisch (&lt;80%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Berufliche Situation */}
      <div className="glass-card rounded-2xl p-6 border border-neon-purple/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center text-xl border border-neon-purple/30">💼</span>
          <span className="text-neon-purple">Berufliche Situation</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Beschaftigungsart</label>
            <select
              name="beruf"
              value={formData.beruf}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="angestellt">Angestellt (unbefristet)</option>
              <option value="beamte">Beamte/r</option>
              <option value="selbststaendig">Selbststandig/Freiberufler</option>
              <option value="befristet">Befristet angestellt</option>
              <option value="rentner">Rentner/in</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Bundesland</label>
            <select
              name="bundesland"
              value={formData.bundesland}
              onChange={handleChange}
              className={inputClass}
            >
              {bundeslaender.map(bl => (
                <option key={bl} value={bl}>{bl}</option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">Fur Landesforderung + Grunderwerbsteuer</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="probezeit"
              checked={formData.probezeit}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-surface border-white/20 text-neon-purple focus:ring-neon-purple/50"
            />
            <span className="text-text-secondary group-hover:text-white transition-colors">Noch in Probezeit</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="verheiratet"
              checked={formData.verheiratet}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-surface border-white/20 text-neon-purple focus:ring-neon-purple/50"
            />
            <span className="text-text-secondary group-hover:text-white transition-colors">Verheiratet</span>
          </label>
        </div>
      </div>

      {/* Familie */}
      <div className="glass-card rounded-2xl p-6 border border-neon-green/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center text-xl border border-neon-green/30">👨‍👩‍👧‍👦</span>
          <span className="text-neon-green">Familie</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Anzahl Kinder</label>
            <select
              name="kinder"
              value={formData.kinder}
              onChange={handleChange}
              className={inputClass}
            >
              <option value={0}>Keine Kinder</option>
              <option value={1}>1 Kind</option>
              <option value={2}>2 Kinder</option>
              <option value={3}>3 Kinder</option>
              <option value={4}>4+ Kinder</option>
            </select>
            <p className="text-xs text-neon-green mt-1">Wichtig! Kinder erhohen KfW-Forderung erheblich</p>
          </div>
        </div>
      </div>

      {/* Bestehendes Vermogen */}
      <div className="glass-card rounded-2xl p-6 border border-accent/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-xl border border-accent/30">📊</span>
          <span className="text-accent">Bestehendes Vermogen (EK-Ersatz)</span>
        </h3>

        <p className="text-text-secondary text-sm mb-6">
          Diese Werte konnen als Eigenkapital-Ersatz dienen und verbessern Ihre Kreditchancen
        </p>

        <div className="space-y-6">
          {/* Depot */}
          <div className="p-4 bg-white/5 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer group mb-3">
              <input
                type="checkbox"
                name="hatDepot"
                checked={formData.hatDepot}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-neon-blue focus:ring-neon-blue/50"
              />
              <span className="text-white font-medium">Wertpapierdepot vorhanden</span>
            </label>
            {formData.hatDepot && (
              <div className="ml-8">
                <input
                  type="number"
                  name="depotWert"
                  value={formData.depotWert}
                  onChange={handleChange}
                  placeholder="Depotwert in EUR"
                  className={inputClass}
                />
                <p className="text-xs text-neon-blue mt-1">Lombardkredit moglich: bis 70% beleihbar</p>
              </div>
            )}
          </div>

          {/* Lebensversicherung */}
          <div className="p-4 bg-white/5 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer group mb-3">
              <input
                type="checkbox"
                name="hatLebensversicherung"
                checked={formData.hatLebensversicherung}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-neon-purple focus:ring-neon-purple/50"
              />
              <span className="text-white font-medium">Kapital-Lebensversicherung</span>
            </label>
            {formData.hatLebensversicherung && (
              <div className="ml-8">
                <input
                  type="number"
                  name="lvRueckkaufswert"
                  value={formData.lvRueckkaufswert}
                  onChange={handleChange}
                  placeholder="Ruckkaufswert in EUR"
                  className={inputClass}
                />
                <p className="text-xs text-neon-purple mt-1">Policendarlehen moglich: bis 100% beleihbar</p>
              </div>
            )}
          </div>

          {/* Riester */}
          <div className="p-4 bg-white/5 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer group mb-3">
              <input
                type="checkbox"
                name="hatRiester"
                checked={formData.hatRiester}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-neon-green focus:ring-neon-green/50"
              />
              <span className="text-white font-medium">Riester-Vertrag</span>
            </label>
            {formData.hatRiester && (
              <div className="ml-8">
                <input
                  type="number"
                  name="riesterGuthaben"
                  value={formData.riesterGuthaben}
                  onChange={handleChange}
                  placeholder="Guthaben in EUR"
                  className={inputClass}
                />
                <p className="text-xs text-neon-green mt-1">Wohn-Riester: 100% fur Immobilienkauf entnehmbar</p>
              </div>
            )}
          </div>

          {/* Bausparvertrag */}
          <div className="p-4 bg-white/5 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer group mb-3">
              <input
                type="checkbox"
                name="hatBausparvertrag"
                checked={formData.hatBausparvertrag}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-surface border-white/20 text-accent focus:ring-accent/50"
              />
              <span className="text-white font-medium">Bausparvertrag</span>
            </label>
            {formData.hatBausparvertrag && (
              <div className="ml-8">
                <input
                  type="number"
                  name="bausparGuthaben"
                  value={formData.bausparGuthaben}
                  onChange={handleChange}
                  placeholder="Guthaben in EUR"
                  className={inputClass}
                />
                <p className="text-xs text-accent mt-1">Direktes Eigenkapital + gunstiges Bauspardarlehen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileForm;
