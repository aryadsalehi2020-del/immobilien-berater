/**
 * DESIGN PREVIEW - Neue Design-Komponenten
 *
 * Diese Datei zeigt das neue Design-System OHNE die App zu verändern.
 * Inspiriert von: Slite, ChatGPT, Setrex, Orrivo
 *
 * Route: /design-preview (muss in App.jsx hinzugefügt werden)
 */

import React, { useState } from 'react';

// ============================================
// DESIGN TOKENS (CSS-in-JS für Preview)
// ============================================
const tokens = {
  colors: {
    // Backgrounds - Warm & Clean
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#f1f3f5',
    bgAccent: '#f8f7f4',

    // Text - Readable & Warm
    textPrimary: '#1a1a2e',
    textSecondary: '#4a5568',
    textMuted: '#718096',

    // Accent - Deep Indigo (nicht Neon!)
    accentPrimary: '#5046e5',
    accentSecondary: '#6366f1',
    accentLight: '#eef2ff',

    // Status
    success: '#059669',
    successLight: '#ecfdf5',
    warning: '#d97706',
    warningLight: '#fffbeb',
    error: '#dc2626',
    errorLight: '#fef2f2',

    // Borders
    borderLight: '#e5e7eb',
    borderDefault: '#d1d5db',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.03), 0 4px 6px rgba(0, 0, 0, 0.02)',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  }
};

// ============================================
// BASE STYLES
// ============================================
const baseStyles = {
  page: {
    minHeight: '100vh',
    backgroundColor: tokens.colors.bgSecondary,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: tokens.colors.textPrimary,
    padding: tokens.spacing[8],
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: tokens.spacing[12],
  },
  sectionTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing[4],
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: tokens.spacing[6],
  }
};

// ============================================
// TYPOGRAPHY PREVIEW
// ============================================
const TypographyPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Typography</div>
    <div style={{
      backgroundColor: tokens.colors.bgPrimary,
      padding: tokens.spacing[8],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.borderLight}`,
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: tokens.colors.textPrimary,
        marginBottom: tokens.spacing[4],
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}>
        Headline 1 - Premium Design
      </h1>
      <h2 style={{
        fontSize: '2.25rem',
        fontWeight: 600,
        lineHeight: 1.25,
        color: tokens.colors.textPrimary,
        marginBottom: tokens.spacing[4],
      }}>
        Headline 2 - Clean & Modern
      </h2>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: tokens.colors.textPrimary,
        marginBottom: tokens.spacing[4],
      }}>
        Headline 3 - Subtitles
      </h3>
      <p style={{
        fontSize: '1rem',
        lineHeight: 1.6,
        color: tokens.colors.textSecondary,
        marginBottom: tokens.spacing[3],
        maxWidth: '65ch',
      }}>
        Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation.
      </p>
      <p style={{
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: tokens.colors.textMuted,
      }}>
        Small Text / Caption - Zusätzliche Informationen und Hinweise
      </p>
    </div>
  </div>
);

// ============================================
// COLOR PALETTE PREVIEW
// ============================================
const ColorSwatch = ({ name, color, textColor = '#fff' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing[2],
  }}>
    <div style={{
      width: '100%',
      height: '80px',
      backgroundColor: color,
      borderRadius: tokens.radius.md,
      border: `1px solid ${tokens.colors.borderLight}`,
      display: 'flex',
      alignItems: 'flex-end',
      padding: tokens.spacing[3],
    }}>
      <span style={{
        color: textColor,
        fontSize: '0.75rem',
        fontWeight: 500,
        textShadow: textColor === '#fff' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
      }}>
        {color}
      </span>
    </div>
    <span style={{
      fontSize: '0.75rem',
      color: tokens.colors.textSecondary,
      fontWeight: 500,
    }}>
      {name}
    </span>
  </div>
);

const ColorPalettePreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Color Palette</div>
    <div style={{
      backgroundColor: tokens.colors.bgPrimary,
      padding: tokens.spacing[8],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.borderLight}`,
    }}>
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[3], color: tokens.colors.textSecondary }}>
          Backgrounds
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: tokens.spacing[4] }}>
          <ColorSwatch name="Primary" color={tokens.colors.bgPrimary} textColor="#666" />
          <ColorSwatch name="Secondary" color={tokens.colors.bgSecondary} textColor="#666" />
          <ColorSwatch name="Tertiary" color={tokens.colors.bgTertiary} textColor="#666" />
          <ColorSwatch name="Accent" color={tokens.colors.bgAccent} textColor="#666" />
        </div>
      </div>

      <div style={{ marginBottom: tokens.spacing[6] }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[3], color: tokens.colors.textSecondary }}>
          Text Colors
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing[4] }}>
          <ColorSwatch name="Primary" color={tokens.colors.textPrimary} />
          <ColorSwatch name="Secondary" color={tokens.colors.textSecondary} />
          <ColorSwatch name="Muted" color={tokens.colors.textMuted} />
        </div>
      </div>

      <div style={{ marginBottom: tokens.spacing[6] }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[3], color: tokens.colors.textSecondary }}>
          Accent Colors
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing[4] }}>
          <ColorSwatch name="Primary" color={tokens.colors.accentPrimary} />
          <ColorSwatch name="Secondary" color={tokens.colors.accentSecondary} />
          <ColorSwatch name="Light" color={tokens.colors.accentLight} textColor="#5046e5" />
        </div>
      </div>

      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[3], color: tokens.colors.textSecondary }}>
          Status Colors
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing[4] }}>
          <ColorSwatch name="Success" color={tokens.colors.success} />
          <ColorSwatch name="Warning" color={tokens.colors.warning} />
          <ColorSwatch name="Error" color={tokens.colors.error} />
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// BUTTON PREVIEW
// ============================================
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing[2],
    fontWeight: 500,
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    fontFamily: 'inherit',
  };

  const sizes = {
    sm: { padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`, fontSize: '0.875rem' },
    md: { padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`, fontSize: '0.875rem' },
    lg: { padding: `${tokens.spacing[4]} ${tokens.spacing[8]}`, fontSize: '1rem' },
  };

  const variants = {
    primary: {
      backgroundColor: isHovered ? tokens.colors.accentSecondary : tokens.colors.accentPrimary,
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: isHovered ? tokens.colors.bgSecondary : 'transparent',
      color: tokens.colors.textPrimary,
      border: `1px solid ${tokens.colors.borderDefault}`,
    },
    ghost: {
      backgroundColor: isHovered ? tokens.colors.bgSecondary : 'transparent',
      color: tokens.colors.textSecondary,
    },
    success: {
      backgroundColor: isHovered ? '#047857' : tokens.colors.success,
      color: '#ffffff',
    },
    danger: {
      backgroundColor: isHovered ? '#b91c1c' : tokens.colors.error,
      color: '#ffffff',
    },
  };

  return (
    <button
      style={{ ...baseStyle, ...sizes[size], ...variants[variant] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

const ButtonPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Buttons</div>
    <div style={{
      backgroundColor: tokens.colors.bgPrimary,
      padding: tokens.spacing[8],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.borderLight}`,
    }}>
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[4], color: tokens.colors.textSecondary }}>
          Variants
        </p>
        <div style={{ display: 'flex', gap: tokens.spacing[4], flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: tokens.spacing[4], color: tokens.colors.textSecondary }}>
          Sizes
        </p>
        <div style={{ display: 'flex', gap: tokens.spacing[4], alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// INPUT PREVIEW
// ============================================
const Input = ({ label, placeholder, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
      {label && (
        <label style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: tokens.colors.textPrimary,
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderRadius: tokens.radius.md,
          border: `1px solid ${error ? tokens.colors.error : isFocused ? tokens.colors.accentPrimary : tokens.colors.borderDefault}`,
          fontSize: '1rem',
          fontFamily: 'inherit',
          backgroundColor: tokens.colors.bgPrimary,
          color: tokens.colors.textPrimary,
          outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isFocused ? `0 0 0 3px ${tokens.colors.accentLight}` : 'none',
        }}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: tokens.colors.error }}>
          {error}
        </span>
      )}
    </div>
  );
};

const InputPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Inputs</div>
    <div style={{
      backgroundColor: tokens.colors.bgPrimary,
      padding: tokens.spacing[8],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.borderLight}`,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: tokens.spacing[6] }}>
        <Input label="Email" placeholder="name@beispiel.de" type="email" />
        <Input label="Passwort" placeholder="********" type="password" />
        <Input label="Mit Fehler" placeholder="Ungültige Eingabe" error="Dieses Feld ist erforderlich" />
      </div>
    </div>
  </div>
);

// ============================================
// CARD PREVIEW
// ============================================
const Card = ({ children, hover = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: tokens.colors.bgPrimary,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.colors.borderLight}`,
        padding: tokens.spacing[6],
        boxShadow: isHovered && hover ? tokens.shadows.md : tokens.shadows.sm,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        transform: isHovered && hover ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

const CardPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Cards</div>
    <div style={baseStyles.grid}>
      <Card>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: tokens.radius.md,
          backgroundColor: tokens.colors.accentLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: tokens.spacing[4],
          color: tokens.colors.accentPrimary,
          fontSize: '1.25rem',
        }}>
          📊
        </div>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: tokens.spacing[2],
          color: tokens.colors.textPrimary,
        }}>
          Analyse-Karte
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: tokens.colors.textSecondary,
          lineHeight: 1.5,
        }}>
          Subtile Schatten, saubere Kanten, professionelles Erscheinungsbild ohne Glassmorphism.
        </p>
      </Card>

      <Card>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: tokens.spacing[4],
        }}>
          <div>
            <p style={{
              fontSize: '0.75rem',
              color: tokens.colors.textMuted,
              marginBottom: tokens.spacing[1],
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Kaufpreis
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: tokens.colors.textPrimary,
            }}>
              450.000 €
            </p>
          </div>
          <span style={{
            backgroundColor: tokens.colors.successLight,
            color: tokens.colors.success,
            padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}>
            +4,2% Rendite
          </span>
        </div>
        <div style={{
          display: 'flex',
          gap: tokens.spacing[6],
          paddingTop: tokens.spacing[4],
          borderTop: `1px solid ${tokens.colors.borderLight}`,
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Wohnfläche</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: tokens.colors.textPrimary }}>85 m²</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Zimmer</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: tokens.colors.textPrimary }}>3</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Baujahr</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: tokens.colors.textPrimary }}>1995</p>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[4],
          marginBottom: tokens.spacing[4],
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: tokens.colors.bgSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}>
            🏠
          </div>
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: tokens.colors.textPrimary,
            }}>
              Frankfurt-Bockenheim
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: tokens.colors.textMuted,
            }}>
              3-Zimmer-Wohnung
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing[3] }}>
          <Button variant="primary" size="sm">Details</Button>
          <Button variant="secondary" size="sm">Speichern</Button>
        </div>
      </Card>
    </div>
  </div>
);

// ============================================
// STAT CARD (Setrex-inspired)
// ============================================
const StatCard = ({ label, value, change, changeType = 'positive' }) => (
  <Card>
    <p style={{
      fontSize: '0.75rem',
      color: tokens.colors.textMuted,
      marginBottom: tokens.spacing[2],
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {label}
    </p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: tokens.spacing[3] }}>
      <span style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: tokens.colors.textPrimary,
      }}>
        {value}
      </span>
      {change && (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: changeType === 'positive' ? tokens.colors.success : tokens.colors.error,
        }}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
  </Card>
);

const StatsPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Statistics Cards</div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: tokens.spacing[4]
    }}>
      <StatCard label="Bruttorendite" value="4,8%" change="0,3%" changeType="positive" />
      <StatCard label="Cashflow/Monat" value="+127 €" change="12 €" changeType="positive" />
      <StatCard label="Kaufpreisfaktor" value="22,4" />
      <StatCard label="Eigenkapitalrendite" value="8,2%" change="1,1%" changeType="positive" />
    </div>
  </div>
);

// ============================================
// COMPARISON: OLD vs NEW
// ============================================
const ComparisonPreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Vergleich: Alt vs. Neu</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing[6] }}>
      {/* OLD STYLE - What to avoid */}
      <div>
        <p style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: tokens.spacing[4],
          color: tokens.colors.error
        }}>
          ❌ Alter Stil (vermeiden)
        </p>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(59, 37, 96, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px',
          boxShadow: '0 0 40px rgba(102, 126, 234, 0.3)',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}>
            Neon Glassmorphism Card
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '16px' }}>
            Übertriebene Effekte, schwer lesbar, generisch.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
          }}>
            Neon Button
          </button>
        </div>
      </div>

      {/* NEW STYLE */}
      <div>
        <p style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: tokens.spacing[4],
          color: tokens.colors.success
        }}>
          ✓ Neuer Stil (professionell)
        </p>
        <Card hover={false}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: tokens.colors.textPrimary,
            marginBottom: tokens.spacing[3],
          }}>
            Clean Premium Card
          </h3>
          <p style={{
            color: tokens.colors.textSecondary,
            fontSize: '0.875rem',
            marginBottom: tokens.spacing[4],
            lineHeight: 1.5,
          }}>
            Subtile Schatten, warme Farben, lesbar und professionell.
          </p>
          <Button variant="primary">Clean Button</Button>
        </Card>
      </div>
    </div>
  </div>
);

// ============================================
// BADGE/TAG PREVIEW
// ============================================
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: { bg: tokens.colors.bgSecondary, color: tokens.colors.textSecondary },
    success: { bg: tokens.colors.successLight, color: tokens.colors.success },
    warning: { bg: tokens.colors.warningLight, color: tokens.colors.warning },
    error: { bg: tokens.colors.errorLight, color: tokens.colors.error },
    accent: { bg: tokens.colors.accentLight, color: tokens.colors.accentPrimary },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: variants[variant].bg,
      color: variants[variant].color,
    }}>
      {children}
    </span>
  );
};

const BadgePreview = () => (
  <div style={baseStyles.section}>
    <div style={baseStyles.sectionTitle}>Badges / Tags</div>
    <div style={{
      backgroundColor: tokens.colors.bgPrimary,
      padding: tokens.spacing[6],
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.borderLight}`,
      display: 'flex',
      gap: tokens.spacing[3],
      flexWrap: 'wrap',
    }}>
      <Badge>Default</Badge>
      <Badge variant="success">Empfehlenswert</Badge>
      <Badge variant="warning">Prüfen</Badge>
      <Badge variant="error">Risiko</Badge>
      <Badge variant="accent">Neu</Badge>
    </div>
  </div>
);

// ============================================
// MAIN PREVIEW PAGE
// ============================================
const DesignPreview = () => {
  return (
    <div style={baseStyles.page}>
      <div style={baseStyles.container}>
        {/* Header */}
        <div style={{
          marginBottom: tokens.spacing[12],
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: tokens.colors.textPrimary,
            marginBottom: tokens.spacing[4],
          }}>
            Design System Preview
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: tokens.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Neues, professionelles Design inspiriert von Slite, ChatGPT, Setrex und Orrivo.
            Kein Glassmorphism, keine Neon-Farben, keine übertriebenen Animationen.
          </p>
        </div>

        <ComparisonPreview />
        <ColorPalettePreview />
        <TypographyPreview />
        <ButtonPreview />
        <InputPreview />
        <CardPreview />
        <StatsPreview />
        <BadgePreview />

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          padding: tokens.spacing[8],
          color: tokens.colors.textMuted,
          fontSize: '0.875rem',
        }}>
          <p>Diese Preview-Seite zeigt das neue Design-System.</p>
          <p>Die bestehende App wurde NICHT verändert.</p>
        </div>
      </div>
    </div>
  );
};

export default DesignPreview;
