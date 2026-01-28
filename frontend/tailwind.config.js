/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0A0E27',      // Deep Midnight Blue
        'primary-light': '#1a1f4d',
        'secondary': '#1E3A8A',    // Royal Blue
        'accent': '#D4AF37',       // Luxury Gold
        'accent-light': '#F4E5B8',
        'accent-dark': '#B8941F',
        'platinum': '#E5E4E2',     // Platinum
        'surface': '#F8F9FB',
        'dark': '#0A0E27',
        'slate': '#64748B',
      },
      fontFamily: {
        'display': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'body': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0A0E27 0%, #1E3A8A 50%, #0A0E27 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
        'gradient-shine': 'linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)',
      },
      animation: {
        'shine': 'shine 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
