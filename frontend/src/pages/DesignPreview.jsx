/**
 * DESIGN PREVIEW V2 - Premium Design System
 *
 * Basierend auf echter Analyse von:
 * - Slite: Soft off-white (moon-dust), gradient accents, 42px rounded buttons, 100px section spacing
 * - Setrex: Deep navy backgrounds, vibrant blue CTAs, animated elements, soft shadows
 * - Orrivo: Cream backgrounds, earth tones, Outfit font, luxury through restraint
 */

import React, { useState } from 'react';

// ============================================
// DESIGN TOKENS - Based on Real Analysis
// ============================================

const DesignPreview = () => {
  const [activeTab, setActiveTab] = useState('light');
  const [inputFocused, setInputFocused] = useState(null);

  // Light Theme (Slite + Orrivo inspired)
  const lightTheme = {
    bg: '#FAFAFA',
    bgCard: '#FFFFFF',
    bgAccent: '#F5F3EF', // Warm cream (Orrivo)
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accent: '#6366F1', // Indigo
    accentHover: '#4F46E5',
    border: '#E2E8F0',
    success: '#10B981',
    successBg: '#ECFDF5',
  };

  // Dark Theme (Setrex inspired)
  const darkTheme = {
    bg: '#0B1120',
    bgCard: '#131C31',
    bgAccent: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    accent: '#38BDF8', // Vibrant blue (Setrex)
    accentHover: '#0EA5E9',
    border: '#1E293B',
    success: '#34D399',
    successBg: 'rgba(52, 211, 153, 0.1)',
  };

  const theme = activeTab === 'light' ? lightTheme : darkTheme;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: theme.text,
      transition: 'all 0.3s ease',
    }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: activeTab === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(11,17,32,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
          }}>
            ImmoBerater
          </div>

          {/* Theme Toggle */}
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            backgroundColor: theme.bgAccent,
            borderRadius: '12px',
          }}>
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  backgroundColor: activeTab === t ? (t === 'light' ? '#fff' : '#0EA5E9') : 'transparent',
                  color: activeTab === t ? (t === 'light' ? theme.text : '#fff') : theme.textMuted,
                  boxShadow: activeTab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {t === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>

        {/* Hero Section - Slite Style */}
        <section style={{
          padding: '100px 0',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: theme.bgAccent,
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.textSecondary,
            marginBottom: '24px',
          }}>
            ✨ Neues Premium Design System
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            background: activeTab === 'dark'
              ? 'linear-gradient(135deg, #fff 0%, #38BDF8 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Immobilien intelligent<br />analysieren
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: theme.textSecondary,
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            Professionelle Immobilienanalyse mit KI-Unterstützung.
            Rendite berechnen, Risiken erkennen, fundiert entscheiden.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 14px ${theme.accent}40`,
            }}>
              Jetzt starten →
            </button>
            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              Demo ansehen
            </button>
          </div>
        </section>

        {/* Stats Section - Setrex Style */}
        <section style={{
          padding: '60px 0',
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
          }}>
            {[
              { value: '4.200+', label: 'Analysen erstellt' },
              { value: '98%', label: 'Zufriedenheit' },
              { value: '< 30s', label: 'Analysezeit' },
              { value: '24/7', label: 'Verfügbar' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: theme.accent,
                  marginBottom: '8px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: theme.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cards Section */}
        <section style={{ padding: '100px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Komponenten
            </h2>
            <p style={{ color: theme.textSecondary, fontSize: '1.125rem' }}>
              Premium UI-Elemente für die App
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {/* Property Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                height: '200px',
                background: activeTab === 'dark'
                  ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
              }}>
                🏠
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}>
                      Frankfurt-Bockenheim
                    </h3>
                    <p style={{ color: theme.textMuted, fontSize: '0.875rem' }}>
                      3-Zimmer-Wohnung • 85 m²
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: theme.successBg,
                    color: theme.success,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    +4,2% Rendite
                  </span>
                </div>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                }}>
                  450.000 €
                </div>
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  paddingTop: '20px',
                  borderTop: `1px solid ${theme.border}`,
                }}>
                  {[
                    { label: 'Cashflow', value: '+127 €/M' },
                    { label: 'Faktor', value: '22,4' },
                    { label: 'Score', value: '78/100' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '0.75rem', color: theme.textMuted, marginBottom: '4px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              padding: '32px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.accent}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '1.5rem',
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '12px',
              }}>
                Schnell-Analyse
              </h3>
              <p style={{
                color: theme.textSecondary,
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}>
                Gib Kaufpreis, Miete und Hausgeld ein – erhalte sofort
                Rendite, Cashflow und Bewertung.
              </p>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                backgroundColor: theme.accent,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}>
                Analyse starten
                <span style={{ fontSize: '1.125rem' }}>→</span>
              </button>
            </div>

            {/* Stats Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              padding: '32px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                  Monatsübersicht
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  color: theme.textMuted,
                  padding: '6px 12px',
                  backgroundColor: theme.bgAccent,
                  borderRadius: '6px',
                }}>
                  Januar 2026
                </span>
              </div>

              {[
                { label: 'Bruttorendite', value: '4,8%', color: theme.success },
                { label: 'Eigenkapitalrendite', value: '12,4%', color: theme.accent },
                { label: 'Monatl. Cashflow', value: '+245 €', color: theme.success },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none',
                }}>
                  <span style={{ color: theme.textSecondary, fontSize: '0.9375rem' }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: item.color,
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section style={{ padding: '100px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Formular-Elemente
            </h2>
          </div>

          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: theme.bgCard,
            borderRadius: '20px',
            border: `1px solid ${theme.border}`,
            padding: '40px',
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Schnell-Rechner
            </h3>
            <p style={{
              color: theme.textSecondary,
              marginBottom: '32px',
              fontSize: '0.9375rem',
            }}>
              Berechne Rendite und Cashflow in Sekunden
            </p>

            {[
              { label: 'Kaufpreis', placeholder: '450.000 €', id: 'price' },
              { label: 'Monatliche Kaltmiete', placeholder: '1.200 €', id: 'rent' },
              { label: 'Hausgeld', placeholder: '350 €', id: 'hausgeld' },
            ].map((field) => (
              <div key={field.id} style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: theme.text,
                }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  onFocus={() => setInputFocused(field.id)}
                  onBlur={() => setInputFocused(null)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    backgroundColor: theme.bgAccent,
                    border: `2px solid ${inputFocused === field.id ? theme.accent : 'transparent'}`,
                    borderRadius: '10px',
                    color: theme.text,
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <button style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 14px ${theme.accent}40`,
            }}>
              Berechnen →
            </button>
          </div>
        </section>

        {/* Buttons Section */}
        <section style={{ padding: '60px 0 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Button-Varianten
            </h2>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '40px',
          }}>
            {/* Primary */}
            <button style={{
              padding: '14px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: theme.accent,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${theme.accent}40`,
            }}>
              Primary Button
            </button>

            {/* Secondary */}
            <button style={{
              padding: '14px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
              color: theme.text,
              border: `2px solid ${theme.border}`,
              borderRadius: '10px',
              cursor: 'pointer',
            }}>
              Secondary
            </button>

            {/* Ghost */}
            <button style={{
              padding: '14px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
              color: theme.accent,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}>
              Ghost Button →
            </button>

            {/* Success */}
            <button style={{
              padding: '14px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: theme.success,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}>
              Speichern ✓
            </button>

            {/* Pill Button (Slite style) */}
            <button style={{
              padding: '14px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.text}`,
              borderRadius: '100px',
              cursor: 'pointer',
            }}>
              Pill Style
            </button>
          </div>

          {/* Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
          }}>
            {[
              { label: 'Empfehlenswert', bg: theme.successBg, color: theme.success },
              { label: 'Prüfen', bg: `${theme.accent}15`, color: theme.accent },
              { label: 'Risiko', bg: '#FEE2E2', color: '#DC2626' },
              { label: 'Neu', bg: theme.bgAccent, color: theme.textSecondary },
            ].map((badge, i) => (
              <span key={i} style={{
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                backgroundColor: badge.bg,
                color: badge.color,
                borderRadius: '100px',
              }}>
                {badge.label}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '40px 0',
          borderTop: `1px solid ${theme.border}`,
          textAlign: 'center',
        }}>
          <p style={{
            color: theme.textMuted,
            fontSize: '0.875rem',
          }}>
            Design Preview v2 • Basierend auf Slite, Setrex, Orrivo
          </p>
          <p style={{
            color: theme.textMuted,
            fontSize: '0.875rem',
            marginTop: '8px',
          }}>
            Bestehende App wurde NICHT verändert
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DesignPreview;
