import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl font-black mb-2">
              <span className="text-accent text-6xl">A</span>
              <span className="text-white">mlak</span>
              <span className="text-accent text-6xl">I</span>
            </h1>
            <p className="text-accent text-sm tracking-wide">Immobilien Intelligence</p>
          </Link>
        </div>

        {/* Login Form */}
        <div className="glass-light rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-primary mb-2 text-center">
            Willkommen zurück
          </h2>
          <p className="text-slate text-center mb-8">
            Melden Sie sich in Ihrem Account an
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ihre@email.de"
                className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-slate/20 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all bg-white text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-gold text-primary font-bold rounded-2xl btn-premium shadow-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Anmeldung läuft...
                </span>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate">
              Noch kein Account?{' '}
              <Link to="/register" className="text-accent font-semibold hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
