# AmlakI Setup Guide

## Backend Setup

1. **Navigiere zum Backend-Ordner:**
   ```bash
   cd backend
   ```

2. **Installiere Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Erstelle `.env` Datei (falls nicht vorhanden):**
   ```bash
   ANTHROPIC_API_KEY=dein_api_key_hier
   SECRET_KEY=dein_geheimer_jwt_key_hier
   ```

4. **Starte den Server:**
   ```bash
   uvicorn main:app --reload
   ```

   Der Server läuft auf: `http://localhost:8000`

## Frontend Setup

1. **Navigiere zum Frontend-Ordner:**
   ```bash
   cd frontend
   ```

2. **Installiere Dependencies:**
   ```bash
   npm install
   ```

3. **Starte den Development Server:**
   ```bash
   npm run dev
   ```

   Das Frontend läuft auf: `http://localhost:5173`

## Erste Schritte

1. Öffne `http://localhost:5173` im Browser
2. Klicke auf "Registrieren" und erstelle einen Account
3. Nach erfolgreicher Registrierung wirst du automatisch eingeloggt
4. Du siehst nun das Dashboard mit Navigation

## Features

### Für User:
- ✅ **Login/Register** - Sicheres Account-System mit JWT
- ✅ **Dashboard** - Übersicht über alle Analysen
- ✅ **Neue Analyse** - Immobilien bewerten (PDF-Upload oder manuell)
- ✅ **Library** - Alle gespeicherten Analysen mit Suche & Filter
- ✅ **Favoriten** - Wichtige Analysen markieren
- ✅ **Einstellungen** - Profil und Standard-Werte anpassen

### Technisch:
- **Backend**: FastAPI + SQLAlchemy + JWT Auth
- **Frontend**: React + React Router + Tailwind CSS
- **Datenbank**: SQLite (automatisch erstellt)
- **KI**: Claude Sonnet 4 für Analysen

## Datenbank

Die SQLite-Datenbank `amlaki.db` wird automatisch beim ersten Start erstellt.

### Tabellen:
- `users` - User-Accounts
- `analyses` - Gespeicherte Immobilienanalysen

## API Endpoints

### Auth:
- `POST /auth/register` - Neuen User registrieren
- `POST /auth/login` - Login (gibt JWT Token zurück)
- `GET /auth/me` - Aktuellen User abrufen
- `PUT /auth/me` - User-Profil aktualisieren

### Library:
- `GET /library` - Alle Analysen des Users
- `GET /library/{id}` - Einzelne Analyse
- `PUT /library/{id}` - Analyse aktualisieren (Titel, Notizen, Favorit)
- `DELETE /library/{id}` - Analyse löschen
- `GET /library/favorites` - Nur Favoriten

### Analysis:
- `POST /extract-pdf` - PDF-Exposé analysieren
- `POST /analyze` - Immobilie bewerten (speichert automatisch)

## Troubleshooting

### Backend startet nicht:
- Prüfe ob alle Dependencies installiert sind
- Prüfe ob Port 8000 frei ist
- Prüfe `.env` Datei

### Frontend startet nicht:
- Prüfe ob `node_modules` installiert sind
- Führe `npm install` erneut aus
- Prüfe ob Port 5173 frei ist

### Login funktioniert nicht:
- Prüfe ob Backend läuft
- Prüfe Browser Console für Fehler
- Prüfe ob CORS korrekt konfiguriert ist

## Produktions-Hinweise

Für Production solltest du:
1. PostgreSQL statt SQLite verwenden
2. SECRET_KEY mit starkem Wert setzen
3. CORS nur für deine Domain erlauben
4. HTTPS verwenden
5. Environment Variables sicher verwalten
