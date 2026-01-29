// API Configuration
const getApiBase = () => {
  // Zuerst prüfen ob eine explizite URL gesetzt wurde
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Wenn wir auf localhost sind, verwende localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // Production: Render Backend
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://immobilien-berater-backend.onrender.com';
  }

  // Sonst (z.B. vom Handy im gleichen Netzwerk), verwende die gleiche IP wie das Frontend
  return `http://${window.location.hostname}:8000`;
};

export const API_BASE = getApiBase();
