/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Neon Palette
        'primary': '#0a0a0f',           // Deep Space Black
        'primary-light': '#12121a',     // Slightly lighter
        'secondary': '#1a1a2e',         // Dark Purple-Blue

        // Neon Accents
        'neon-blue': '#00d4ff',         // Electric Cyan
        'neon-purple': '#a855f7',       // Vivid Purple
        'neon-pink': '#ec4899',         // Hot Pink
        'neon-green': '#22c55e',        // Matrix Green

        // Legacy Gold (improved)
        'accent': '#fbbf24',            // Brighter Gold
        'accent-light': '#fde68a',
        'accent-dark': '#d97706',

        // Functional Colors
        'surface': '#16161e',           // Card backgrounds
        'surface-light': '#1e1e2a',     // Hover states

        // Text Colors (bessere Lesbarkeit!)
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',    // Deutlich heller als vorher
        'text-muted': '#71717a',

        // Status Colors
        'success': '#22c55e',
        'warning': '#fbbf24',
        'error': '#ef4444',
        'info': '#00d4ff',

        // Legacy support
        'dark': '#0a0a0f',
        'slate': '#a1a1aa',             // Aufgehellt für Lesbarkeit
        'platinum': '#e4e4e7',
      },
      fontFamily: {
        'display': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        // Animated Gradients
        'gradient-cyber': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ec4899 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #00d4ff 0%, #22c55e 25%, #a855f7 50%, #ec4899 75%, #00d4ff 100%)',
        'gradient-gold': 'linear-gradient(135deg, #fbbf24 0%, #fde68a 50%, #fbbf24 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #1a1a2e 0px, transparent 50%), radial-gradient(at 80% 0%, #312e81 0px, transparent 50%), radial-gradient(at 0% 50%, #1e1b4b 0px, transparent 50%), radial-gradient(at 80% 50%, #0c4a6e 0px, transparent 50%), radial-gradient(at 0% 100%, #312e81 0px, transparent 50%), radial-gradient(at 80% 100%, #1a1a2e 0px, transparent 50%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 60px rgba(0, 212, 255, 0.2), 0 0 40px rgba(168, 85, 247, 0.1)',
      },
      animation: {
        'shine': 'shine 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'gradient-flow': 'gradientFlow 15s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
        'aurora': 'aurora 10s ease-in-out infinite',
        'particle': 'particle 20s linear infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
          '50%': { backgroundPosition: '100% 50%', filter: 'hue-rotate(30deg)' },
          '100%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
