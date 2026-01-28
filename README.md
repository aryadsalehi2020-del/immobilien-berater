# Immobilien-Berater 🏠

KI-gestützter Immobilienanalyse-Service mit transparenten Bewertungsregeln.

## Features

- **PDF-Extraktion**: Laden Sie ein Exposé hoch, die KI extrahiert automatisch alle relevanten Daten
- **Zwei Modi**: Kapitalanlage oder Eigennutzung – unterschiedliche Gewichtungen
- **Score-System**: 0-100 Punkte mit transparenter Begründung für jedes Kriterium
- **Cashflow-Analyse**: Automatische Berechnung bei 100% Finanzierung
- **Marktdaten**: KI-gestützte Schätzungen für Vergleichspreise

## Schnellstart

### Voraussetzungen

- Python 3.9+
- Node.js 18+
- Anthropic API Key ([hier erstellen](https://console.anthropic.com/))

### 1. Repository klonen / Dateien kopieren

```bash
# Erstelle Projektordner
mkdir immobilien-berater
cd immobilien-berater

# Kopiere die Dateien in diesen Ordner
```

### 2. Backend einrichten

```bash
cd backend

# Virtuelle Umgebung erstellen (empfohlen)
python -m venv venv

# Aktivieren
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# API Key konfigurieren
cp .env.example .env
# Öffne .env und füge deinen API Key ein:
# ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Frontend einrichten

```bash
cd ../frontend

# Abhängigkeiten installieren
npm install
```

### 4. Starten

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # oder venv\Scripts\activate auf Windows
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Öffne http://localhost:3000 im Browser.

## Verwendung

1. **Exposé hochladen**: PDF-Datei in die Drop-Zone ziehen oder klicken zum Auswählen
2. **Daten prüfen**: Die extrahierten Daten werden angezeigt – korrigieren falls nötig
3. **Verwendungszweck wählen**: Kapitalanlage oder Eigennutzung
4. **Finanzierung angeben** (bei Kapitalanlage): Eigenkapital, Zinssatz, Tilgung
5. **Analysieren**: Klick auf "Immobilie bewerten"
6. **Ergebnis interpretieren**: Score, Detailbewertung, Cashflow-Analyse

## Bewertungskriterien

### Kapitalanlage (Gewichtung)
| Kriterium | Punkte |
|-----------|--------|
| Cashflow / Rendite | 30 |
| Lage | 20 |
| Kaufpreis/m² vs. Markt | 15 |
| Zukunftspotenzial | 10 |
| Zustand / Baujahr | 10 |
| Energieeffizienz | 5 |
| Nebenkosten | 5 |
| Grundriss | 3 |
| Verkäufertyp | 2 |

### Eigennutzung (Gewichtung)
| Kriterium | Punkte |
|-----------|--------|
| Lage | 25 |
| Grundriss | 20 |
| Zustand / Baujahr | 15 |
| Zukunftspotenzial | 15 |
| Kaufpreis/m² | 10 |
| Energieeffizienz | 8 |
| Nebenkosten | 5 |
| Verkäufertyp | 2 |

## API Endpunkte

- `GET /` - Health check
- `POST /extract-pdf` - PDF-Daten extrahieren
- `POST /search-market-data` - Marktdaten suchen
- `POST /analyze` - Vollständige Analyse durchführen
- `GET /health` - Detaillierter Health Check

## Kosten

Die App nutzt die Claude API. Ungefähre Kosten:
- ~$0.01-0.02 pro Analyse
- $5 Guthaben = ~250-500 Analysen

## Projektstruktur

```
immobilien-berater/
├── backend/
│   ├── main.py           # FastAPI Server
│   ├── requirements.txt  # Python Dependencies
│   ├── .env.example      # API Key Template
│   └── .env              # Dein API Key (nicht committen!)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── FileUpload.jsx
│   │       ├── PropertyForm.jsx
│   │       ├── AnalysisResult.jsx
│   │       └── LoadingState.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Nächste Schritte (Roadmap)

- [ ] Echte Marktdaten-API anbinden
- [ ] Vergleichsanalyse mehrerer Objekte
- [ ] Export als PDF-Report
- [ ] Benutzerkonten mit gespeicherten Analysen
- [ ] Mobile App

## Lizenz

MIT

## Hinweis

Diese Analyse dient nur zur Orientierung und ersetzt keine professionelle Immobilienbewertung oder Finanzberatung.
