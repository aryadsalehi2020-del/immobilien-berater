import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    default_verwendungszweck: user?.default_verwendungszweck || 'kapitalanlage',
    default_zinssatz: user?.default_zinssatz || 3.75,
    default_tilgung: user?.default_tilgung || 1.25
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUser(formData);
      setSuccess('Einstellungen erfolgreich gespeichert!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Einstellungen</h1>
        <p className="text-slate text-lg">
          Passen Sie Ihr Profil und Standardwerte an
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Section */}
        <div className="glass-light rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Profil
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl bg-slate/10 text-slate cursor-not-allowed"
                />
                <p className="text-xs text-slate mt-1">E-Mail kann nicht geändert werden</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Benutzername
                </label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl bg-slate/10 text-slate cursor-not-allowed"
                />
                <p className="text-xs text-slate mt-1">Username kann nicht geändert werden</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Vollständiger Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Max Mustermann"
                className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
              />
            </div>
          </div>
        </div>

        {/* Default Analysis Settings */}
        <div className="glass-light rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            Standard-Analysewerte
          </h2>

          <p className="text-slate mb-6">
            Diese Werte werden als Standard für neue Analysen verwendet
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Standard-Verwendungszweck
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, default_verwendungszweck: 'kapitalanlage' })}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${
                    formData.default_verwendungszweck === 'kapitalanlage'
                      ? 'border-accent bg-gradient-gold text-primary'
                      : 'border-slate/30 text-slate hover:border-accent'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">💰</span>
                    Kapitalanlage
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, default_verwendungszweck: 'eigennutzung' })}
                  className={`py-4 px-6 rounded-xl border-2 font-semibold transition-all ${
                    formData.default_verwendungszweck === 'eigennutzung'
                      ? 'border-accent bg-gradient-gold text-primary'
                      : 'border-slate/30 text-slate hover:border-accent'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">🏠</span>
                    Eigennutzung
                  </span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Standard-Zinssatz (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="default_zinssatz"
                  value={formData.default_zinssatz}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
                />
                <p className="text-xs text-slate mt-1">Aktuell empfohlen: 3.75%</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Standard-Tilgung (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="default_tilgung"
                  value={formData.default_tilgung}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
                />
                <p className="text-xs text-slate mt-1">Aktuell empfohlen: 1.25%</p>
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="text-primary font-semibold mb-1">Info</p>
                  <p className="text-slate leading-relaxed">
                    Die Gesamtrate (Zins + Tilgung) von {(formData.default_zinssatz + formData.default_tilgung).toFixed(2)}%
                    wird für Cashflow-Berechnungen verwendet. Sie können diese Werte jederzeit bei einzelnen Analysen anpassen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-gold text-primary font-bold rounded-2xl btn-premium shadow-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Speichern...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Einstellungen speichern
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
