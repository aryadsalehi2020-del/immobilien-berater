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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-mesh-animated">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb w-96 h-96 bg-neon-blue/20 top-0 right-0" />
        <div className="glow-orb w-80 h-80 bg-neon-purple/20 bottom-0 left-0" style={{ animationDelay: '3s' }} />
        <div className="glow-orb w-64 h-64 bg-neon-pink/15 top-1/2 left-1/4" style={{ animationDelay: '5s' }} />
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8 fade-in">
          <Link to="/" className="inline-block group">
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="text-neon-blue text-5xl md:text-6xl text-glow-blue">A</span>
              <span className="text-white">mlak</span>
              <span className="text-neon-purple text-5xl md:text-6xl text-glow-purple">I</span>
            </h1>
            <p className="text-gradient-neon text-xs md:text-sm tracking-widest font-semibold uppercase">
              Immobilien Intelligence
            </p>
          </Link>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 card-3d fade-in fade-in-delay-1 border border-neon-blue/20">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neon-blue/50 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neon-purple/50 rounded-br-3xl" />

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            Willkommen zurück
          </h2>
          <p className="text-text-secondary text-center mb-6 md:mb-8 text-sm md:text-base">
            Melden Sie sich in Ihrem Account an
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoCapitalize="none"
                placeholder="ihre@email.de"
                className="input-cyber w-full px-4 py-3.5 md:py-3 min-h-[48px] rounded-xl text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input-cyber w-full px-4 py-3.5 md:py-3 min-h-[48px] rounded-xl text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 min-h-[52px] btn-neon font-bold rounded-2xl text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group active:scale-[0.98] transition-transform"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spinner"></div>
                    Anmeldung läuft...
                  </span>
                ) : (
                  'Anmelden'
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Noch kein Account?{' '}
              <Link to="/register" className="text-neon-blue font-semibold hover:text-neon-purple transition-colors">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 flex justify-center gap-2 fade-in fade-in-delay-2">
          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
