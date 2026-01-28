# Immobilien-Berater – Claude Code Projektanweisungen (ULTIMATE EDITION)

## Projekt-Übersicht

Du baust einen **Immobilien-Investment-Berater** für Kapitalanleger in Deutschland. Die App hilft Nutzern dabei, Immobilien als Kapitalanlage zu bewerten, Renditen zu berechnen, Förderungen zu optimieren und fundierte Kaufentscheidungen zu treffen.

**Diese KI ist der beste Immobilienberater Deutschlands** – besser als 95% der Makler!

## Zielgruppe & Use Case

- **Nutzer:** Privatanleger, die Immobilien als Kapitalanlage kaufen wollen
- **Strategie:** 100% Finanzierung des Kaufpreises, nur Kaufnebenkosten als Eigenkapital
- **Ziel:** Cashflow-neutrale oder positive Immobilien finden (Immobilie trägt sich selbst)
- **Region:** Fokus auf Deutschland, insbesondere Frankfurt/Hessen

## Tech Stack (Empfehlung)

- **Frontend:** React + TypeScript + Tailwind CSS
- **Styling:** Nutze den Frontend-Design-Prompt aus `/mnt/user-data/outputs/claude-code-frontend-prompt.md` für luxuriöses, modernes UI
- **State:** Zustand oder React Context
- **Charts:** Recharts oder Tremor
- **Icons:** Lucide React

## Kernfunktionen

### 1. Schnell-Rechner
- Eingabe: Kaufpreis, Kaltmiete, Hausgeld
- Ausgabe: Bruttorendite, Kaufpreisfaktor, Cashflow
- Live-Slider für Tilgung (1-3%)

### 2. Detail-Analyse (VOLLSTÄNDIGES BLATT!)
- Vollständige Cashflow-Berechnung
- AfA-Berechnung nach Baujahr (inkl. degressiv, Denkmal, §7b)
- Eigenkapitalrendite mit Leverage
- Steuereffekt-Berechnung
- **NEU: Eigenkapital-Rechner** (siehe unten)

### 3. Förderungs-Finder
- KfW-Programme automatisch vorschlagen
- Landesförderungen nach Bundesland
- Heizungsförderung berechnen
- Gesamtförderung maximieren

### 4. Objekt-Bewertung (Score 0-100)
- Automatische Bewertung basierend auf Kriterien
- Red-Flag-Erkennung (Erbpacht, Energieklasse, etc.)
- Kauf-Empfehlung mit Begründung

### 5. Wissens-Chatbot
- Beantwortet ALLE Fragen zur Immobilienanlage
- Nutzt die komplette Knowledge Base unten
- Kann Förderungen, Steuern, Recht erklären

---

## 🆕 ERWEITERTE ANALYSE-FEATURES

### Philosophie: ALLE Optionen zeigen!
Die KI gibt IMMER alle Möglichkeiten aus – auch wenn sie negativ bewertet werden. Der User entscheidet selbst! Wir zeigen:
- ✅ Optimale Szenarien
- ⚠️ Grenzwertige Szenarien  
- ❌ Riskante Szenarien (mit Warnung, aber trotzdem berechnet!)

### 🆕 Philosophie: NIEMALS nur "Nein" sagen!

**Auch bei schlechter Bewertung IMMER konstruktive Tipps geben:**

```javascript
function generiereVerbesserungsvorschlaege(immobilie, score) {
  const tipps = [];
  
  // IMMER Tipps geben, egal wie schlecht der Score!
  
  // 1. Preisverhandlung
  if (immobilie.kaufpreisfaktor > 25) {
    const zielFaktor = 22;
    const zielPreis = immobilie.jahresmiete * zielFaktor;
    const differenz = immobilie.kaufpreis - zielPreis;
    tipps.push({
      typ: 'Preisverhandlung',
      icon: '💰',
      tipp: `Verhandle den Preis auf ${zielPreis.toLocaleString()}€ (-${Math.round(differenz/1000)}k)`,
      effekt: `Kaufpreisfaktor sinkt auf ${zielFaktor}, Rendite steigt auf ${(100/zielFaktor).toFixed(1)}%`,
      argument: `Begründung: Vergleichbare Objekte in der Region haben Faktor ${zielFaktor}`
    });
  }
  
  // 2. Förderungen die helfen könnten
  tipps.push(...findePassendeFoerderungen(immobilie));
  
  // 3. Mieterhöhungspotenzial
  if (immobilie.istMiete < immobilie.marktMiete * 0.9) {
    const potenzial = immobilie.marktMiete - immobilie.istMiete;
    tipps.push({
      typ: 'Mieterhöhung',
      icon: '📈',
      tipp: `Mieterhöhung nach §558 BGB möglich: +${potenzial.toFixed(0)}€/Monat`,
      effekt: `Bruttorendite steigt von ${immobilie.bruttorendite.toFixed(1)}% auf ${((immobilie.marktMiete*12/immobilie.kaufpreis)*100).toFixed(1)}%`,
      zeitrahmen: 'Nach Kauf gemäß Kappungsgrenze (15-20% in 3 Jahren)',
      hinweis: 'Mietspiegel prüfen, Formvorschriften beachten'
    });
  }
  
  // 4. Energetische Sanierung + Förderung
  if (['E', 'F', 'G', 'H'].includes(immobilie.energieKlasse)) {
    tipps.push({
      typ: 'Energetische Sanierung',
      icon: '🌱',
      tipp: `Mit KfW 261/262 sanieren → bis zu 67.500€ Tilgungszuschuss!`,
      effekt: 'Wertsteigerung 10-20%, Modernisierungsumlage möglich (8%/Jahr)',
      foerderung: 'KfW 261: 150.000€ Kredit zu ~1% Zins',
      rechenbeispiel: `Bei 80.000€ Sanierung: 20.000€ Zuschuss + 8%×80.000€ = 6.400€/Jahr Mieterhöhung möglich`
    });
  }
  
  // 5. Finanzierungsoptimierung
  tipps.push({
    typ: 'Finanzierung optimieren',
    icon: '🏦',
    tipp: 'Mehrere Banken vergleichen + KfW kombinieren',
    optionen: [
      `KfW 124: 100.000€ zu ~3.4% für Eigennutzer-Anteil`,
      `Landesförderung prüfen (${immobilie.bundesland})`,
      `Disagio vereinbaren für Steuereffekt`,
      `Sondertilgung 10% verhandeln`
    ]
  });
  
  // 6. Alternativ-Strategie
  if (score < 40) {
    tipps.push({
      typ: 'Alternative Strategie',
      icon: '🔄',
      tipp: 'Objekt als Verhandlungsbasis nutzen',
      optionen: [
        `Als Referenz für Preisverhandlung bei ähnlichen Objekten`,
        `Verkäufer auf Mängel hinweisen → Preisnachlass fordern`,
        `Nur kaufen wenn Preis auf ${Math.round(immobilie.kaufpreis * 0.8).toLocaleString()}€ sinkt`
      ]
    });
  }
  
  // 7. "Fairer Preis" Berechnung
  const fairerPreis = berechneFairenPreis(immobilie);
  tipps.push({
    typ: 'Fairer Preis',
    icon: '⚖️',
    tipp: `Fairer Kaufpreis wäre: ${fairerPreis.toLocaleString()}€`,
    berechnung: {
      nachErtragswert: Math.round(immobilie.jahresmiete / 0.045), // 4.5% Zielrendite
      nachVergleich: immobilie.vergleichspreisProQm * immobilie.flaeche,
      nachCashflow: berechnePreisFuerCashflowNull(immobilie),
      empfehlung: fairerPreis
    },
    differenz: `Aktuell ${Math.round((immobilie.kaufpreis / fairerPreis - 1) * 100)}% über fairem Preis`
  });
  
  return tipps;
}

function berechneFairenPreis(immobilie) {
  // Mehrere Methoden, dann Durchschnitt
  const nachRendite = immobilie.jahresmiete / 0.045; // Ziel 4.5% Brutto
  const nachFaktor = immobilie.jahresmiete * 22; // Ziel Faktor 22
  const nachCashflow = berechnePreisFuerCashflowNull(immobilie);
  
  // Gewichteter Durchschnitt
  return Math.round((nachRendite * 0.4 + nachFaktor * 0.3 + nachCashflow * 0.3));
}

function berechnePreisFuerCashflowNull(immobilie) {
  const verfuegbar = immobilie.kaltmiete - (immobilie.hausgeld * 0.35);
  const jahresRate = verfuegbar * 12;
  const maxKredit = jahresRate / (0.038 + 0.015); // 3.8% Zins, 1.5% Tilgung
  return Math.round(maxKredit * 0.9); // 10% Puffer für Nebenkosten
}
```

### 🆕 Output-Format bei schlechter Bewertung

**NIEMALS so:**
```
❌ Score: 28/100 – Finger weg!
Diese Immobilie ist nicht empfehlenswert.
```

**IMMER so:**
```
⚠️ Score: 28/100 – Aktuell nicht empfehlenswert

ABER: So könnte es funktionieren:

💰 PREISVERHANDLUNG
├─ Aktueller Preis: 320.000€ (Faktor 28.4)
├─ Fairer Preis: 252.000€ (Faktor 22.4)
├─ Verhandlungsziel: -68.000€ (-21%)
└─ Argument: "Vergleichbare Objekte: 3.100€/m², hier 4.000€/m²"

📈 MIETERHÖHUNGSPOTENZIAL  
├─ Aktuelle Miete: 940€ (unter Mietspiegel)
├─ Marktmiete: 1.080€
├─ Potenzial: +140€/Monat = +1.680€/Jahr
└─ Effekt auf Rendite: 3.5% → 4.0%

🌱 KFW-FÖRDERUNG MÖGLICH
├─ Energieklasse F → KfW 261 nutzbar!
├─ Bei Sanierung zu EH 70: 22.500€ Tilgungszuschuss
├─ Plus: Modernisierungsumlage 8% = Mieterhöhung
└─ Effektiver Kaufpreis nach Förderung: 297.500€

🏦 FINANZIERUNGSOPTIMIERUNG
├─ Statt 3.8% bei Hausbank: KfW kombinieren
├─ 100.000€ KfW 124 zu 3.4%
├─ 220.000€ Hausbank zu 3.6% (bessere Beleihung!)
└─ Ersparnis: ~2.400€/Jahr

⚖️ ZUSAMMENFASSUNG
├─ Mit Preisverhandlung (-21%): Score steigt auf 58 🟡
├─ Mit Preisverhandlung + Förderung: Score 72 🟢
├─ Mit allem zusammen: Score 81 🟢🟢
└─ EMPFEHLUNG: Angebot bei 260.000€ machen!

📋 DEINE NÄCHSTEN SCHRITTE
□ 1. Angebot bei 260.000€ einreichen (Begründung: Energieklasse, Sanierungsstau)
□ 2. KfW-Förderfähigkeit mit Energieberater prüfen
□ 3. Sanierungskosten schätzen lassen
□ 4. Falls Verkäufer ablehnt: Weitersuchen, aber als Referenz behalten
```

### Automatische Förderungs-Empfehlung

```javascript
function empfiehlFoerderungen(immobilie) {
  const empfehlungen = [];
  
  // KfW 261/262 - Energetische Sanierung
  if (['D', 'E', 'F', 'G', 'H'].includes(immobilie.energieKlasse)) {
    empfehlungen.push({
      programm: 'KfW 261/262',
      grund: `Energieklasse ${immobilie.energieKlasse} → Sanierung förderfähig`,
      vorteil: 'Bis 67.500€ Tilgungszuschuss',
      bedingung: 'Sanierung zu Effizienzhaus-Standard',
      tipp: 'Erst Energieberater beauftragen, dann Antrag VOR Baubeginn!'
    });
  }
  
  // KfW 124 - Selbstnutzung
  if (immobilie.selbstnutzung) {
    empfehlungen.push({
      programm: 'KfW 124',
      grund: 'Selbstgenutzte Immobilie',
      vorteil: '100.000€ zu günstigen Konditionen',
      bedingung: 'Antrag VOR Kaufvertrag',
      tipp: 'Über Hausbank beantragen'
    });
  }
  
  // Jung kauft Alt
  if (immobilie.selbstnutzung && immobilie.kinder > 0 && ['F', 'G', 'H'].includes(immobilie.energieKlasse)) {
    empfehlungen.push({
      programm: 'KfW 308 Jung kauft Alt',
      grund: `Familie mit ${immobilie.kinder} Kind(ern) + Energieklasse ${immobilie.energieKlasse}`,
      vorteil: `Bis ${100000 + (immobilie.kinder >= 3 ? 50000 : 0)}€ zu ~1.1% Zins!`,
      bedingung: 'Sanierung zu EH 85 EE in 54 Monaten',
      tipp: 'Einkommensgrenzen prüfen: 90.000€ + 10.000€ pro Kind'
    });
  }
  
  // Heizungsförderung
  if (immobilie.heizungAlter > 20 || immobilie.heizungTyp === 'Öl' || immobilie.heizungTyp === 'Gas') {
    empfehlungen.push({
      programm: 'KfW 458 Heizungsförderung',
      grund: `Alte ${immobilie.heizungTyp}-Heizung (${immobilie.heizungAlter} Jahre)`,
      vorteil: 'Bis 70% Zuschuss für Wärmepumpe',
      berechnung: `Bei 30.000€ Wärmepumpe: bis zu 21.000€ Zuschuss!`,
      bedingung: 'Nur für Selbstnutzer volle Förderung'
    });
  }
  
  // Landesförderung
  const landesfoerderung = getLandesfoerderung(immobilie.bundesland);
  if (landesfoerderung) {
    empfehlungen.push(landesfoerderung);
  }
  
  // BAFA Einzelmaßnahmen
  empfehlungen.push({
    programm: 'BAFA Einzelmaßnahmen',
    grund: 'Immer prüfenswert bei Bestandsimmobilien',
    vorteil: '15-20% Zuschuss für Dämmung, Fenster, etc.',
    tipp: 'Mit iSFP-Bonus: Förderfähige Kosten verdoppeln sich auf 60.000€!'
  });
  
  return empfehlungen;
}
```

### Feature 1: Eigenkapital-Optimierer
**Frage:** "Wie viel EK brauche ich, damit sich die Immobilie selbst trägt?"

```javascript
function berechneMinEigenkapital(params) {
  const { kaufpreis, kaltmiete, hausgeld, zinssatz, tilgungssatz, kaufnebenkosten } = params;
  
  // Verfügbar für Kreditrate = Kaltmiete - nicht umlagefähiges Hausgeld
  const nichtUmlagefaehig = hausgeld * 0.35;
  const verfuegbarFuerRate = kaltmiete - nichtUmlagefaehig;
  
  // Maximale Kreditsumme bei der sich die Rate ausgeht
  const jahresRate = verfuegbarFuerRate * 12;
  const maxKredit = jahresRate / (zinssatz + tilgungssatz);
  
  // Benötigtes Eigenkapital
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  const minEigenkapital = gesamtkosten - maxKredit;
  
  return {
    minEigenkapital: Math.max(minEigenkapital, kaufnebenkosten), // Mindestens Nebenkosten
    maxKredit,
    verfuegbarFuerRate,
    szenarien: berechneSzenarien(params)
  };
}

function berechneSzenarien(params) {
  const szenarien = [];
  
  // Szenario 1: Nur Nebenkosten als EK (100% Finanzierung)
  szenarien.push({
    name: '100% Finanzierung',
    eigenkapital: params.kaufnebenkosten,
    kredit: params.kaufpreis,
    rate: (params.kaufpreis * (params.zinssatz + params.tilgungssatz)) / 12,
    cashflow: null, // Wird berechnet
    bewertung: null
  });
  
  // Szenario 2: Cashflow-neutral
  szenarien.push({
    name: 'Cashflow-Neutral',
    eigenkapital: null, // Wird berechnet
    kredit: null,
    rate: params.kaltmiete - (params.hausgeld * 0.35),
    cashflow: 0,
    bewertung: '🟢 Empfohlen'
  });
  
  // Szenario 3: +100€ Cashflow
  szenarien.push({
    name: '+100€ Cashflow/Monat',
    eigenkapital: null,
    kredit: null,
    rate: params.kaltmiete - (params.hausgeld * 0.35) - 100,
    cashflow: 100,
    bewertung: '🟢 Sehr gut'
  });
  
  // Szenario 4: 20% Eigenkapital (klassisch)
  szenarien.push({
    name: '20% Eigenkapital (Klassisch)',
    eigenkapital: params.kaufpreis * 0.20 + params.kaufnebenkosten,
    kredit: params.kaufpreis * 0.80,
    rate: (params.kaufpreis * 0.80 * (params.zinssatz + params.tilgungssatz)) / 12,
    cashflow: null,
    bewertung: '🟢 Konservativ'
  });
  
  // Szenario 5: Maximaler Hebel (riskant aber zeigen!)
  szenarien.push({
    name: 'Maximaler Hebel (110% Finanzierung)',
    eigenkapital: 0,
    kredit: params.kaufpreis + params.kaufnebenkosten,
    rate: ((params.kaufpreis + params.kaufnebenkosten) * (params.zinssatz + 0.005 + params.tilgungssatz)) / 12,
    cashflow: null,
    bewertung: '🔴 Riskant – aber möglich bei guter Bonität'
  });
  
  return szenarien;
}
```

---

## 🆕 FLEXIBLER FINANZIERUNGSRECHNER (LIVE-ANPASSUNG)

### Kernprinzip: User entscheidet ALLES!

Der User kann jeden Wert anpassen und sieht SOFORT die Auswirkungen:
- Eigenkapital (Slider: 0€ bis Kaufpreis)
- Zinssatz (Slider: 1% bis 6%)
- Tilgung (Slider: 1% bis 5%)
- Laufzeit (Slider: 5 bis 40 Jahre)
- Sondertilgung (Checkbox + Betrag)

### MASTER-BERECHNUNGSLOGIK

```javascript
// ═══════════════════════════════════════════════════════════════
// LIVE-RECHNER: Aktualisiert bei JEDER Eingabeänderung
// ═══════════════════════════════════════════════════════════════

function berechneAlles(input) {
  const {
    // Objekt-Daten
    kaufpreis,
    kaltmiete,
    hausgeld,
    wohnflaeche,
    baujahr,
    
    // User-Eingaben (LIVE anpassbar!)
    eigenkapital,        // Slider: 0 bis kaufpreis + nebenkosten
    zinssatz,            // Slider: 1% bis 6%
    tilgungssatz,        // Slider: 1% bis 5%
    zinsbindung,         // Dropdown: 5, 10, 15, 20, 25, 30 Jahre
    sondertilgungProJahr, // Optional: 0 bis 10% der Kreditsumme
    mietsteigerungProJahr, // Default: 2%
    wertsteigerungProJahr, // Default: 2%
    instandhaltungProQm,   // Default: 9€/m²/Jahr
    grenzsteuersatz,       // Für Steuerberechnung: 0% bis 45%
  } = input;

  // ═══════════════════════════════════════════════════════════
  // SCHRITT 1: KAUFNEBENKOSTEN
  // ═══════════════════════════════════════════════════════════
  
  const kaufnebenkosten = berechneKaufnebenkosten(kaufpreis, input.bundesland);
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 2: FINANZIERUNGSSTRUKTUR
  // ═══════════════════════════════════════════════════════════
  
  const kredit = gesamtkosten - eigenkapital;
  const beleihungsauslauf = (kredit / kaufpreis) * 100;
  
  // Zinsaufschlag je nach Beleihung
  const effektivzins = berechneEffektivzins(zinssatz, beleihungsauslauf);
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 3: ANNUITÄTENBERECHNUNG (EXAKTE FORMEL!)
  // ═══════════════════════════════════════════════════════════
  
  const annuitaet = berechneAnnuitaet(kredit, effektivzins, tilgungssatz);
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 4: MONATLICHE WERTE
  // ═══════════════════════════════════════════════════════════
  
  const monatlicheRate = annuitaet / 12;
  const nichtUmlagefaehigesHausgeld = hausgeld * 0.35;
  const instandhaltung = (instandhaltungProQm * wohnflaeche) / 12;
  const mietausfallReserve = kaltmiete * 0.02;
  
  const cashflowVorSteuern = kaltmiete 
    - monatlicheRate 
    - nichtUmlagefaehigesHausgeld 
    - instandhaltung 
    - mietausfallReserve;
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 5: RENDITE-KENNZAHLEN
  // ═══════════════════════════════════════════════════════════
  
  const renditen = berechneRenditen(input, kredit, cashflowVorSteuern);
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 6: 30-JAHRES-PROJEKTION
  // ═══════════════════════════════════════════════════════════
  
  const projektion = berechne30JahresProjektion(input, kredit, effektivzins);
  
  // ═══════════════════════════════════════════════════════════
  // SCHRITT 7: STEUEREFFEKT
  // ═══════════════════════════════════════════════════════════
  
  const steuereffekt = berechneSteuereffekt(input, kredit);
  
  // ═══════════════════════════════════════════════════════════
  // RETURN: ALLE ERGEBNISSE
  // ═══════════════════════════════════════════════════════════
  
  return {
    // Finanzierung
    kredit,
    eigenkapital,
    beleihungsauslauf,
    effektivzins,
    monatlicheRate,
    
    // Cashflow
    cashflowVorSteuern,
    cashflowNachSteuern: cashflowVorSteuern + (steuereffekt.monatlich),
    
    // Renditen
    ...renditen,
    
    // Projektion (für Charts!)
    projektion,
    
    // Steuer
    steuereffekt,
    
    // Bewertung
    bewertung: bewerteCashflow(cashflowVorSteuern)
  };
}

// ═══════════════════════════════════════════════════════════════
// DETAIL-FUNKTIONEN
// ═══════════════════════════════════════════════════════════════

function berechneKaufnebenkosten(kaufpreis, bundesland) {
  const grunderwerbsteuer = {
    'Bayern': 0.035,
    'Sachsen': 0.055,
    'Baden-Württemberg': 0.05,
    'Hessen': 0.06,
    'Berlin': 0.06,
    'NRW': 0.065,
    'Brandenburg': 0.065,
    'Schleswig-Holstein': 0.065,
    'Thüringen': 0.065,
    'Saarland': 0.065,
    // Default
    'default': 0.06
  };
  
  const gst = kaufpreis * (grunderwerbsteuer[bundesland] || grunderwerbsteuer['default']);
  const notar = kaufpreis * 0.015;
  const grundbuch = kaufpreis * 0.005;
  const makler = kaufpreis * 0.0357; // 3,57% (kann 0 sein wenn privat)
  
  return {
    grunderwerbsteuer: gst,
    notar,
    grundbuch,
    makler,
    gesamt: gst + notar + grundbuch + makler,
    gesamtOhneMakler: gst + notar + grundbuch
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 DETAILLIERTE KAUFNEBENKOSTEN-AUFSTELLUNG
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 🧠 MEGA-TRICKS-DATENBANK: ALLE VORTEILE FÜR IMMOBILIENKÄUFER
// ═══════════════════════════════════════════════════════════════

/*
PHILOSOPHIE: Die KI analysiert die Situation des Users und aktiviert
automatisch die relevanten Tricks. Jeder Trick hat Tags für die
Zielgruppe, damit die KI weiß, wann er relevant ist.
*/

const ALLE_TRICKS = {

  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 1: KAUFPREIS-OPTIMIERUNG
  // ═══════════════════════════════════════════════════════════════
  
  kaufpreisOptimierung: [
    {
      id: 'inventar-separat',
      titel: '💡 Inventar separat ausweisen – Grunderwerbsteuer sparen',
      tags: ['alle', 'steuer-sparen', 'kaufnebenkosten'],
      ersparnis: 'Bis 1.500€ bei 25.000€ Inventar',
      erklaerung: `
        Bewegliche Gegenstände sind NICHT grunderwerbsteuerpflichtig!
        
        Was kann separat ausgewiesen werden:
        • Einbauküche (oft 10.000-25.000€)
        • Markisen, Jalousien
        • Sauna, Whirlpool
        • Gartenhäuser, Carports (wenn nicht fest verbunden)
        • Einbauschränke
        • Kaminöfen (wenn herausnehmbar)
        
        Finanzamt akzeptiert bis 15% des Kaufpreises ohne Nachweise.
        Bei höheren Beträgen: Rechnungen/Kaufbelege beifügen.
        
        MUSTERFORMULIERUNG für Kaufvertrag:
        "Der Kaufpreis setzt sich zusammen aus [X]€ für das Grundstück 
        nebst Gebäude und [Y]€ für das mitverkaufte bewegliche Inventar, 
        bestehend aus: Einbauküche (Marke, Baujahr ca. [Z]), Markise 
        (Außenmaß ca. [A]m), [weitere Gegenstände]."
      `,
      rechenbeispiel: {
        kaufpreis: 400000,
        inventar: 20000,
        bundesland: 'NRW',
        grstSatz: 0.065,
        ersparnis: 1300  // 20.000 × 6,5%
      },
      risiko: 'Gering – bei realistischer Bewertung kein Problem',
      quellen: ['BFH, Haufe, Steuerberater-Empfehlungen']
    },
    
    {
      id: 'kaufpreisaufteilung',
      titel: '📊 Kaufpreisaufteilung optimieren – AfA maximieren',
      tags: ['kapitalanleger', 'steuer-sparen', 'langfristig'],
      ersparnis: 'Bis 43.500€ über 50 Jahre (bei 42% Steuersatz)',
      erklaerung: `
        Nur der GEBÄUDEANTEIL kann abgeschrieben werden (2% p.a.)!
        
        Das BMF-Tool führt oft zu ungünstigen Aufteilungen:
        • München: Oft nur 30-40% Gebäudeanteil laut Tool
        • Ländlich: 60-70% Gebäudeanteil möglich
        
        LÖSUNG: Eigenes Gutachten erstellen lassen!
        • BFH hat BMF-Tool als "nicht marktgerecht" kritisiert
        • Finanzgerichte akzeptieren Abweichungen bis 20%
        • Gutachten kostet 1.500-3.000€, spart aber Zehntausende
        
        TRICK: Im Kaufvertrag Aufteilung vereinbaren!
        Beispiel: "Die Parteien sind sich einig, dass der Bodenwert 
        100.000€ und der Gebäudewert 300.000€ beträgt."
        → Finanzamt muss diese Aufteilung zunächst akzeptieren!
      `,
      rechenbeispiel: {
        kaufpreis: 400000,
        bmfToolGebaeude: 0.5,  // 50%
        gutachtenGebaeude: 0.75,  // 75%
        differenzAfaJahr: 2000,  // (75%-50%) × 400.000 × 2%
        steuerersparnisJahr: 840,  // bei 42% Steuersatz
        ersparnis50Jahre: 42000
      },
      wann: 'Bei Kapitalanlage IMMER prüfen – besonders in teuren Städten',
      risiko: 'Mittel – Gutachten sollte nachvollziehbar sein'
    },
    
    {
      id: 'preis-verhandeln',
      titel: '🤝 Kaufpreis verhandeln – Die besten Argumente',
      tags: ['alle', 'sofort-sparen'],
      ersparnis: '5-15% vom Kaufpreis möglich',
      erklaerung: `
        WANN ist Verhandlung erfolgreich?
        • Objekt steht lange (>3 Monate)
        • Verkäufer unter Zeitdruck (Scheidung, Erbe, Umzug)
        • Mehrere Mängel vorhanden
        • Markt kühlt ab (steigende Zinsen)
        
        DIE BESTEN VERHANDLUNGSARGUMENTE:
        1. Energieklasse schlecht → "Sanierungskosten 50.000€"
        2. Renovierungsbedarf → Kostenvoranschläge vorlegen
        3. WEG-Probleme → "Erhaltungsrücklage zu niedrig"
        4. Lärmbelästigung → Flughafen, Straße, Gewerbe
        5. Vergleichspreise → BORIS-D, ImmoScout zeigen
        
        TAKTIK:
        • Erstes Gebot: 10-15% unter Angebotspreis
        • Begründung immer schriftlich mitliefern
        • "Mein Budget erlaubt maximal X€" (psychologisch stark)
        • Bei Makler: "Können Sie beim Verkäufer nachfragen?"
      `,
      beispielArgumente: [
        'Energieklasse F bedeutet laut GEG Sanierungspflicht – ich kalkuliere 40.000€ für Heizung/Dämmung',
        'Der Mietspiegel zeigt 9,50€/m², die aktuelle Miete liegt 15% darunter',
        'Vergleichbare Objekte auf ImmoScout liegen bei 3.200€/m², hier sind es 3.600€',
        'Die Erhaltungsrücklage beträgt nur 8€/m² – Ziel sind 25€/m²'
      ]
    },
    
    {
      id: 'kaufpreis-erhoehen-nebenkosten',
      titel: '💰 Kaufpreis erhöhen, Nebenkosten vom Verkäufer',
      tags: ['wenig-eigenkapital', 'kreativ'],
      ersparnis: 'Bis zu 40.000€ weniger Eigenkapital nötig',
      erklaerung: `
        TRICK: Verkäufer übernimmt Nebenkosten, Kaufpreis wird erhöht.
        Bank finanziert den höheren Kaufpreis mit!
        
        BEISPIEL:
        • Ursprünglich: 300.000€ Kaufpreis + 36.000€ NK = 336.000€
        • Dein EK für NK: 36.000€
        
        • NEU: 336.000€ Kaufpreis + 0€ NK (Verkäufer zahlt)
        • Dein EK: 0€!
        
        Der Verkäufer bekommt das gleiche Geld:
        336.000€ - 36.000€ NK = 300.000€ netto
        
        VORAUSSETZUNG:
        • Bank muss höheren Kaufpreis akzeptieren (Wertgutachten!)
        • Verkäufer muss mitspielen
        • Im Kaufvertrag korrekt formulieren
      `,
      risiko: 'Mittel – Bank prüft Verkehrswert',
      wann: 'Bei wenig EK und kooperativem Verkäufer'
    },
    
    {
      id: 'renovierung-einpreisen',
      titel: '🔧 Renovierungskosten in Kaufpreis einrechnen',
      tags: ['wenig-eigenkapital', 'sanierung'],
      erklaerung: `
        Wenn Renovierung geplant ist:
        • Renovierungskosten schätzen (z.B. 30.000€)
        • Mit Verkäufer höheren Kaufpreis vereinbaren
        • Bank finanziert Renovierung gleich mit!
        
        VORTEIL: Du brauchst kein Extra-EK für Renovierung
        
        ALTERNATIVE: KfW-Kredit für Sanierung separat
        → KfW 261/262 mit bis zu 67.500€ Tilgungszuschuss!
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 2: FINANZIERUNG OPTIMIEREN
  // ═══════════════════════════════════════════════════════════════
  
  finanzierungOptimieren: [
    {
      id: 'banken-vergleichen',
      titel: '🏦 Mindestens 5 Banken vergleichen – Pflicht!',
      tags: ['alle', 'sofort-sparen', 'zinsen'],
      ersparnis: '0,3-0,5% besserer Zins möglich = 15.000-25.000€',
      erklaerung: `
        Die Zinsunterschiede zwischen Banken sind ENORM!
        
        STRATEGIE:
        1. Erst zu Vermittler (Interhyp, Dr. Klein, Baufi24)
        2. Dann Hausbank anfragen (mit Vermittler-Angebot!)
        3. Regionale Sparkasse/Volksbank prüfen
        4. Direktbanken checken (ING, DKB)
        
        VERHANDLUNGSTIPP:
        "Ich habe ein Angebot von [Bank X] über 3,65%. 
        Können Sie das unterbieten?"
        
        BESTE VERMITTLER (500+ Bankpartner):
        • Interhyp – Testsieger Transparenz
        • Dr. Klein – Stark bei Selbstständigen
        • Baufi24 – Oft günstigste Zinsen
        • Hüttig & Rompf – Finanztip-Empfehlung
      `,
      rechenbeispiel: {
        kredit: 300000,
        laufzeit: 20,
        zinsDifferenz: 0.003,  // 0,3%
        ersparnis: 18000  // über Laufzeit
      }
    },
    
    {
      id: 'kfw-kombinieren',
      titel: '🏗️ KfW-Kredite IMMER prüfen – bis 2% günstiger!',
      tags: ['alle', 'förderung', 'zinsen'],
      ersparnis: '30.000-100.000€ über Laufzeit',
      erklaerung: `
        KfW-PROGRAMME 2025/2026:
        
        KfW 124 – Wohneigentumsprogramm (JEDER kann das nutzen!):
        • Bis 100.000€ Kredit
        • Zinssatz ca. 3,4-3,9% (oft unter Markt)
        • Keine Einkommensgrenzen!
        
        KfW 300 – Wohneigentum für Familien:
        • Zinssatz nur 1,12%!! (Stand 10/2025)
        • Ersparnis: 30.000-40.000€
        • Einkommensgrenze: 90.000€ + 10.000€/Kind
        • Kredit: 170.000-270.000€
        
        KfW 308 – Jung kauft Alt:
        • Gleicher Zinsvorteil 1,12%
        • Für Bestandsimmobilien Energieklasse F/G/H
        • Sanierungspflicht auf EH 85 EE
        
        KfW 261/262 – Energetische Sanierung:
        • Bis 150.000€ Kredit
        • Bis 67.500€ Tilgungszuschuss!
        
        WICHTIG: Antrag VOR Kaufvertrag stellen!
      `,
      beispiel: {
        ohneKfW: { kredit: 300000, zins: 0.038, zinskosten: 171000 },
        mitKfW300: { kredit: 200000, zins: 0.0112, kfwZinskosten: 33600, hausbank: 100000, hbZinskosten: 57000, gesamt: 90600, ersparnis: 80400 }
      }
    },
    
    {
      id: 'zinsbindung-optimieren',
      titel: '📅 Zinsbindung clever wählen',
      tags: ['alle', 'strategie', 'zinsen'],
      erklaerung: `
        FAUSTREGEL:
        • Zinsen niedrig → LANGE Bindung (15-20 Jahre)
        • Zinsen hoch → KURZE Bindung (5-10 Jahre) + Sondertilgung
        
        AKTUELL (Januar 2026):
        Zinsen sind moderat (3,5-4%) → 15 Jahre ist guter Kompromiss
        
        AUFSCHLÄGE für längere Bindung:
        • 10 → 15 Jahre: +0,2-0,3%
        • 15 → 20 Jahre: +0,3-0,4%
        
        GEHEIMTIPP: §489 BGB!
        Nach 10 Jahren kannst du JEDEN Kredit mit 6 Monaten 
        Frist kündigen – egal wie lange die Zinsbindung!
        
        → 15 Jahre Bindung nehmen, nach 10 Jahren umschulden
           wenn Zinsen gefallen sind!
      `
    },
    
    {
      id: 'sondertilgung-verhandeln',
      titel: '💸 Sondertilgung 10% verhandeln – kostenlos!',
      tags: ['alle', 'flexibilität'],
      ersparnis: 'Bis 50.000€ Zinsersparnis bei Nutzung',
      erklaerung: `
        Standard ist 5% Sondertilgung p.a. – MEHR ist möglich!
        
        VERHANDELN:
        • 10% Sondertilgung oft ohne Aufpreis
        • Manche Banken: 0,05% Aufschlag – lohnt sich trotzdem!
        
        BEISPIEL:
        300.000€ Kredit, 10% Sondertilgung = 30.000€/Jahr möglich
        
        Bei konsequenter Nutzung:
        • 10 Jahre früher schuldenfrei
        • 40.000-60.000€ Zinsen gespart
        
        TIPP: Sondertilgung im Januar machen!
        → Spart die meisten Zinsen (Zinseszinseffekt)
      `
    },
    
    {
      id: 'tilgung-anpassen',
      titel: '📉 Tilgung flexibel gestalten',
      tags: ['alle', 'flexibilität', 'cashflow'],
      erklaerung: `
        TILGUNGSSATZWECHSEL verhandeln:
        • 2x während Laufzeit kostenlos
        • Zwischen 1% und 5% wechseln
        
        WARUM WICHTIG?
        • Gehalt steigt → Tilgung erhöhen
        • Kind geboren → Tilgung senken
        • Bonus bekommen → Sondertilgung + höhere Rate
        
        VORSICHT:
        Manche Banken verlangen Aufpreis für diese Option!
        Besser: Gleich bei Vertragsabschluss vereinbaren.
      `
    },
    
    {
      id: 'disagio-nutzen',
      titel: '📉 Disagio für Steuereffekt (nur Kapitalanleger!)',
      tags: ['kapitalanleger', 'steuer-sparen'],
      erklaerung: `
        DISAGIO = Abschlag auf Kreditsumme gegen niedrigeren Zins
        
        Beispiel: 5% Disagio
        • Du bekommst 285.000€ ausgezahlt
        • Kredit lautet auf 300.000€
        • Zins ist 0,3% niedriger
        
        STEUEREFFEKT:
        Das Disagio (15.000€) kann als Werbungskosten SOFORT
        abgesetzt werden! Bei 42% Steuersatz = 6.300€ zurück.
        
        WANN SINNVOLL?
        • Hoher Steuersatz (>35%)
        • Lange Zinsbindung geplant
        • Kapitalanlage (nicht Eigennutzung!)
      `,
      risiko: 'Steuerlich komplex – Steuerberater fragen!'
    },
    
    {
      id: 'forward-darlehen',
      titel: '🔮 Forward-Darlehen bei steigenden Zinsen',
      tags: ['anschlussfinanzierung', 'strategie'],
      erklaerung: `
        Forward-Darlehen = Zinsen HEUTE für Kredit in bis zu 5 Jahren sichern
        
        AUFSCHLAG pro Jahr Vorlauf:
        • 0,01-0,03% pro Monat
        • 12-36 Monate Vorlauf = 0,15-0,50% Aufschlag
        
        WANN SINNVOLL?
        • Zinsbindung läuft in 1-3 Jahren aus
        • Du erwartest steigende Zinsen
        • Du willst Planungssicherheit
        
        TIPP: Mehrere Angebote vergleichen!
        Forward-Aufschläge variieren stark zwischen Banken.
      `
    },
    
    {
      id: 'bausparvertrag-kombi',
      titel: '🏠 Bausparvertrag clever einsetzen',
      tags: ['langfristig', 'zinssicherheit'],
      erklaerung: `
        Bausparvertrag als Zinssicherung für Anschlussfinanzierung:
        
        STRATEGIE:
        1. Heute: Bankkredit + Bausparvertrag abschließen
        2. Ansparphase: Bausparvertrag besparen (ca. 40-50%)
        3. Nach 10 Jahren: Bankkredit mit Bauspardarlehen ablösen
        
        VORTEIL:
        • Bausparzins ist HEUTE schon festgelegt (oft 1-2%)
        • Egal wie hoch die Zinsen in 10 Jahren sind!
        
        NACHTEILE:
        • Abschlussgebühr 1-1,6%
        • Niedrige Guthabenzinsen während Ansparphase
        
        WANN SINNVOLL?
        • Lange Finanzierungslaufzeit geplant
        • Du erwartest stark steigende Zinsen
        • Du willst maximale Planungssicherheit
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 3: STEUERN OPTIMIEREN
  // ═══════════════════════════════════════════════════════════════
  
  steuernOptimieren: [
    {
      id: 'afa-maximieren',
      titel: '📊 AfA-Sätze kennen und maximieren',
      tags: ['kapitalanleger', 'steuer-sparen', 'langfristig'],
      erklaerung: `
        ABSCHREIBUNG nach Baujahr:
        • Ab 2023 gebaut: 3% (33 Jahre)
        • 1925-2022: 2% (50 Jahre)
        • Vor 1925: 2,5% (40 Jahre)
        
        SONDER-AfA (§7b EStG):
        • 5% zusätzlich in ersten 4 Jahren!
        • Voraussetzung: Neubau-Mietwohnungen, Baukosten max. 5.200€/m²
        
        DENKMAL-AfA (§7i/7h EStG):
        • Sanierungskosten: 9% in 8 Jahren + 7% in 4 Jahren
        • = 100% Abschreibung in 12 Jahren!
        • Auch für Eigennutzer möglich (§10f)
        
        DEGRESSIVE AfA (ab 2023):
        • 5% vom Restwert (statt linear)
        • Lohnt sich bei hohen Gebäudewerten
        
        TIPP: Steuerberater rechnet durch, welche Methode besser ist!
      `,
      rechenbeispiel: {
        gebaeudewert: 300000,
        linear: { satz: 0.02, jahrlich: 6000, steuerersparnis: 2520 },
        degressiv: { satz: 0.05, jahr1: 15000, steuerersparnis: 6300 }
      }
    },
    
    {
      id: 'werbungskosten',
      titel: '📝 Alle Werbungskosten absetzen',
      tags: ['kapitalanleger', 'steuer-sparen'],
      erklaerung: `
        ALLES was mit Vermietung zusammenhängt, ist absetzbar:
        
        LAUFENDE KOSTEN:
        • Zinsen (nicht Tilgung!)
        • Hausgeld (nicht umlagefähiger Teil)
        • Grundsteuer
        • Versicherungen (Gebäude, Haus- und Grundbesitzer)
        • Kontoführungsgebühren (pauschal 16€/Jahr)
        • Fahrtkosten zu Besichtigungen (0,30€/km)
        
        EINMALIGE KOSTEN:
        • Maklergebühr (bei Kapitalanlage voll absetzbar!)
        • Notarkosten für Finanzierung (nicht für Kauf)
        • Grundbuchkosten für Grundschuld
        • Renovierung vor Erstvermietung
        • Möbel für möblierte Vermietung (AfA!)
        
        OFT VERGESSEN:
        • Kosten für Immobilienbewertung
        • Mitgliedschaft Haus & Grund (ca. 100€/Jahr)
        • Steuerberaterkosten (anteilig)
        • Reisekosten für Immobiliensuche
        • Fachliteratur, Kurse
      `
    },
    
    {
      id: 'anschaffungsnahe-herstellungskosten',
      titel: '⚠️ 15%-Grenze bei Renovierung beachten!',
      tags: ['kapitalanleger', 'steuer-sparen', 'achtung'],
      erklaerung: `
        FALLE: Renovierungskosten in den ersten 3 Jahren!
        
        Wenn Renovierung > 15% der Gebäude-Anschaffungskosten:
        → Kosten werden zu Anschaffungskosten gerechnet
        → Keine Sofortabsetzung, nur AfA über 50 Jahre!
        
        BEISPIEL:
        • Kaufpreis Gebäude: 200.000€
        • 15%-Grenze: 30.000€
        • Renovierung 40.000€ → Muss abgeschrieben werden!
        
        STRATEGIE:
        • Renovierung über 3 Jahre strecken
        • Unter 15% pro Jahr bleiben
        • Oder: Vor Kauf renovieren lassen (Kaufpreis erhöhen)
        
        AUSNAHME: Reine Schönheitsreparaturen zählen NICHT mit.
      `
    },
    
    {
      id: 'spekulationsfrist',
      titel: '📅 10-Jahres-Frist beachten – steuerfrei verkaufen',
      tags: ['alle', 'exit-strategie'],
      erklaerung: `
        PRIVATVERKAUF nach 10 Jahren = STEUERFREI!
        
        RECHNUNG:
        Die 10 Jahre zählen von Notarvertrag zu Notarvertrag.
        
        TRICK bei Verkaufsplanung:
        • Verkauf im Jahr 10, Tag 1 = komplett steuerfrei
        • Auch Wertsteigerung von 100.000€+ = 0€ Steuern!
        
        ACHTUNG bei weniger als 10 Jahren:
        • Gewinn wird mit persönlichem Steuersatz versteuert
        • Bis zu 45% Steuern!
        
        AUSNAHME für Selbstnutzung:
        • Keine Spekulationsfrist wenn selbst genutzt
        • Oder: Im Verkaufsjahr + 2 Jahre davor selbst genutzt
      `
    },
    
    {
      id: '3-objekte-grenze',
      titel: '🏢 3-Objekte-Grenze beachten – gewerblicher Handel',
      tags: ['investor', 'mehrere-objekte', 'achtung'],
      erklaerung: `
        GEFAHR: Verkauf von mehr als 3 Objekten in 5 Jahren
        = Gewerblicher Grundstückshandel!
        
        FOLGEN:
        • Gewerbesteuer auf ALLE Verkäufe
        • Spekulationsfrist gilt nicht mehr
        • Rückwirkende Besteuerung möglich!
        
        WAS ZÄHLT ALS OBJEKT:
        • Jede Wohnung einzeln
        • Jedes Haus einzeln
        • Auch Grundstücke
        
        STRATEGIEN:
        • Max. 3 Verkäufe in 5 Jahren
        • Oder: GmbH gründen (dann eh gewerblich)
        • Objekte länger als 10 Jahre halten
      `
    },
    
    {
      id: 'verluste-verrechnen',
      titel: '📉 Verluste mit Einkommen verrechnen',
      tags: ['kapitalanleger', 'steuer-sparen'],
      erklaerung: `
        Mietverluste können mit anderen Einkünften verrechnet werden!
        
        BEISPIEL:
        • Gehalt: 80.000€
        • Mietverlust (wegen hoher Zinsen): -10.000€
        • Zu versteuerndes Einkommen: 70.000€
        • Ersparnis bei 42%: 4.200€!
        
        TYPISCH in den ersten Jahren:
        • Hohe Zinsen
        • Hohe AfA
        • Renovierungskosten
        → Negativer Cashflow, aber Steuerersparnis!
        
        ACHTUNG Liebhaberei:
        • Finanzamt prüft ob Gewinnerzielungsabsicht besteht
        • Bei dauerhaft Verlusten: Absetzung wird gestrichen
        • Totalgewinnprognose erstellen lassen!
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 4: KAUFNEBENKOSTEN SPAREN
  // ═══════════════════════════════════════════════════════════════
  
  nebenkostenSparen: [
    {
      id: 'makler-sparen',
      titel: '🔍 Ohne Makler kaufen – bis 3,57% sparen',
      tags: ['alle', 'sofort-sparen', 'kaufnebenkosten'],
      ersparnis: 'Bei 300.000€ Kaufpreis: 10.710€',
      erklaerung: `
        MAKLERFREIE QUELLEN:
        • eBay Kleinanzeigen / Kleinanzeigen.de
        • nebenan.de (Nachbarschafts-Netzwerk)
        • Direkt bei Bauträgern (Neubau)
        • Zwangsversteigerungen (zvg-portal.de)
        • Lokalzeitungen, Aushänge
        • Facebook-Gruppen ("Immobilien [Stadt] privat")
        • Immoscout Filter: "Privatanbieter"
        
        TIPP: Direkt bei Hausverwaltungen anfragen!
        → Bekommen oft als erste mit, wenn jemand verkauft
        
        MAKLER-VERHANDLUNG:
        • Seit 2020: Käufer zahlt max. 50%!
        • Provision ist IMMER verhandelbar
        • "2% oder ich kaufe nicht" funktioniert oft
      `
    },
    
    {
      id: 'grunderwerbsteuer-bundesland',
      titel: '🗺️ Bundesland mit niedriger Grunderwerbsteuer',
      tags: ['alle', 'kaufnebenkosten', 'standortwahl'],
      erklaerung: `
        GRUNDERWERBSTEUER NACH BUNDESLAND (2026):
        
        3,5% – Bayern, Sachsen ✅ GÜNSTIGSTEN!
        5,0% – Baden-Württemberg, Hamburg, Niedersachsen,
               Rheinland-Pfalz, Sachsen-Anhalt, Bremen
        6,0% – Berlin, Hessen, Mecklenburg-Vorpommern
        6,5% – NRW, Brandenburg, Schleswig-Holstein,
               Thüringen, Saarland ❌ TEUERSTEN!
        
        Bei 400.000€ Kaufpreis:
        • Bayern: 14.000€
        • NRW: 26.000€
        • DIFFERENZ: 12.000€!
        
        STRATEGIE für Grenzregionen:
        • Pendeln über Landesgrenze möglich?
        • 10 km weiter = 12.000€ gespart?
      `
    },
    
    {
      id: 'notar-vergleichen',
      titel: '📋 Notarkosten: Wenig Spielraum, aber...',
      tags: ['alle', 'kaufnebenkosten'],
      erklaerung: `
        Notargebühren sind gesetzlich geregelt (GNotKG).
        ABER: Es gibt Unterschiede!
        
        SPAREN DURCH:
        • Nur notwendige Leistungen beauftragen
        • Auflassungsvormerkung weglassen? (Risiko!)
        • Keine "Vollstreckungsunterwerfung für Kaufpreis"
        
        TIPP: Käufer wählt den Notar!
        → Such dir einen, der schnell und unkompliziert arbeitet
        
        SCHÄTZUNG Notarkosten:
        • 1,0-1,5% des Kaufpreises
        • Enthält: Beurkundung, Beratung, Vollzug
      `
    },
    
    {
      id: 'instandhaltungsruecklage',
      titel: '⚠️ Instandhaltungsrücklage – NICHT abziehbar!',
      tags: ['etw-kauf', 'achtung'],
      erklaerung: `
        ACHTUNG: Seit BFH-Urteil 2020 kann die Instandhaltungs-
        rücklage NICHT mehr von der Grunderwerbsteuer abgezogen werden!
        
        Die Rücklage ist zivilrechtlich Verwaltungsvermögen der WEG,
        nicht Eigentum des Käufers.
        
        WAS DU TUN KANNST:
        • Im Kaufpreis berücksichtigen (Verhandlung!)
        • Hohe Rücklage = weniger Nachschüsse später
        
        BEISPIEL:
        • Rücklage 15.000€ → KEIN Steuerabzug
        • Aber: Verkäufer "übergibt" dir 15.000€ quasi
        → Argument für niedrigeren Kaufpreis!
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 5: EIGENKAPITAL-ERSATZ & TRICKS
  // ═══════════════════════════════════════════════════════════════
  
  eigenkapitalErsatz: [
    {
      id: 'nachrangdarlehen',
      titel: '🏦 Nachrangdarlehen als Eigenkapital',
      tags: ['wenig-eigenkapital'],
      erklaerung: `
        Ein Nachrangdarlehen steht HINTER dem Bankkredit im Grundbuch.
        → Viele Banken werten es als "eigenkapitalähnlich"!
        
        ANBIETER:
        • Hanseatic Bank, Consors Finanz, Oyak Anker Bank
        • Von Essen Bank (auch bei Schufa-Einträgen)
        • KfW-Wohneigentumsprogramm (wird teils akzeptiert)
        • Landesförderbanken (IBB Berlin, IB-LSA)
        
        KONDITIONEN:
        • Zins: 5-8% (2-4% über Bauzins)
        • Laufzeit: max. 10 Jahre
        • Betrag: 10.000-50.000€
        
        RECHENBEISPIEL:
        50.000€ Nachrang zu 7% = 3.500€/Jahr Zinsen
        ABER: Spart 0,8% Zinsaufschlag bei 250.000€ Hauptkredit
        = 2.000€/Jahr gespart → Lohnt sich!
      `
    },
    
    {
      id: 'policendarlehen',
      titel: '💼 Lebensversicherung beleihen',
      tags: ['wenig-eigenkapital', 'versicherung-vorhanden'],
      erklaerung: `
        Kapital-Lebensversicherung kann beliehen werden!
        
        BELEIHUNGSWERT:
        • Kapital-LV: bis 100% des Rückkaufswertes
        • Fondsgebundene: bis 60% des Fondsguthabens
        
        ANBIETER (Stand 2025):
        • Lifefinance (LV-Kredit): 4,59-4,99%
        • SWK Bank: 5,99%, max. 250.000€
        
        VORTEILE:
        • Versicherungsschutz bleibt erhalten
        • Meist kein SCHUFA-Eintrag
        • Flexibel zurückzahlbar
        
        NICHT BELEIHBAR:
        • Risikolebensversicherungen
        • Riester- und Rürup-Verträge
        • Direktversicherungen
      `
    },
    
    {
      id: 'lombardkredit',
      titel: '📈 Wertpapierdepot beleihen (Lombardkredit)',
      tags: ['wenig-eigenkapital', 'depot-vorhanden'],
      erklaerung: `
        Dein Depot kann als Sicherheit für einen Kredit dienen!
        
        ANBIETER & ZINSEN (Januar 2026):
        • Scalable PRIME+: 3,24%
        • DEGIRO: 4,75%
        • Maxblue: 4,90%
        • Smartbroker+: 5,04%
        • S-Broker: 5,90%
        • Comdirect: 6,05%
        
        BELEIHUNGSWERTE:
        • ETFs breit gestreut: 70-80%
        • Blue-Chip-Aktien: 40-70%
        • Anleihen: 50-80%
        
        ACHTUNG MARGIN CALL:
        Bei Kursverlusten kann Nachschusspflicht entstehen!
        → Maximal 50% des Rahmens nutzen!
      `
    },
    
    {
      id: 'muskelhypothek',
      titel: '💪 Eigenleistung als Eigenkapital (Muskelhypothek)',
      tags: ['wenig-eigenkapital', 'handwerklich-begabt'],
      erklaerung: `
        Dokumentierte Eigenleistung wird als EK angerechnet!
        
        AKZEPTIERT (typisch 10-15% der Bausumme, max. 30.000€):
        • Malerarbeiten
        • Tapezieren
        • Bodenbeläge verlegen
        • Trockenbau
        • Gartenarbeiten
        
        ERFORDERLICH:
        • Detaillierte Aufstellung der Arbeiten
        • Kostenvoranschläge von Handwerkern als Vergleich
        • Bei Facharbeiten: Qualifikationsnachweise
        
        BANKEN die das akzeptieren:
        • Sparkassen, Volksbanken
        • Deutsche Bank
        • Dr. Klein-Partner
      `
    },
    
    {
      id: 'familie-unterstuetzung',
      titel: '👨‍👩‍👧 Familie einbeziehen – steuerfrei!',
      tags: ['wenig-eigenkapital', 'familie'],
      erklaerung: `
        SCHENKUNGSFREIBETRÄGE (alle 10 Jahre neu!):
        • Eltern → Kind: 400.000€
        • Großeltern → Enkel: 200.000€
        • Geschwister: 20.000€
        
        OPTIONEN:
        1. Schenkung (komplett steuerfrei bis Freibetrag)
        2. Familienkredit (Vertrag schriftlich!)
        3. Bürgschaft (Familie bürgt, du zahlst)
        
        STEUER-TRICK bei Familienkredit:
        • Käufer setzt Zinsen als Werbungskosten ab (45%)
        • Verkäufer versteuert nur mit 25% Abgeltungsteuer
        • Netto-Vorteil: 20%!
        
        WICHTIG: Fremdüblicher Vertrag bei Verwandten!
        → Finanzamt prüft genau
      `
    },
    
    {
      id: 'verkaeuferdarlehen',
      titel: '🤝 Verkäuferdarlehen verhandeln',
      tags: ['wenig-eigenkapital', 'kreativ'],
      erklaerung: `
        Der Verkäufer gibt dir einen Teil als Darlehen!
        → Wird von Banken oft als EK anerkannt.
        
        TYPISCH:
        • 5-10% des Kaufpreises
        • Nachrangig im Grundbuch
        • Zins: Verhandlungssache (3-6%)
        
        WANN MACHT VERKÄUFER MIT?
        • Bei schwer verkäuflichen Objekten
        • Wenn er keine sofortige Liquidität braucht
        • Bei Verkäufen in der Familie
        
        VORAUSSETZUNG:
        Schriftlicher, fremdüblicher Darlehensvertrag!
      `
    },
    
    {
      id: 'wohnriester',
      titel: '🏠 Wohn-Riester als Eigenkapital',
      tags: ['wenig-eigenkapital', 'riester-vorhanden'],
      erklaerung: `
        Riester-Guthaben kann für Immobilienkauf entnommen werden!
        
        OPTIONEN:
        • 75% entnehmen (Rest bleibt im Vertrag)
        • 100% entnehmen (Vertragsauflösung)
        
        FÖRDERUNG:
        • 175€ Grundzulage/Jahr
        • 300€ je Kind/Jahr
        
        ACHTUNG NACHGELAGERTE BESTEUERUNG:
        • Wohnförderkonto mit 2% p.a. fiktiver Verzinsung
        • Im Rentenalter wird versteuert!
        • Option: Sofortzahlung mit 30% Rabatt
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 6: FÖRDERUNGEN MAXIMIEREN
  // ═══════════════════════════════════════════════════════════════
  
  foerderungenMaximieren: [
    {
      id: 'kfw-stapeln',
      titel: '🏗️ KfW-Programme stapeln',
      tags: ['förderung', 'maximieren'],
      erklaerung: `
        Mehrere KfW-Programme können KOMBINIERT werden!
        
        BEISPIEL für Familie mit 2 Kindern, Altbau Klasse F:
        
        1. KfW 308 "Jung kauft Alt": 150.000€ zu 1,12%
        2. KfW 124 Wohneigentum: 100.000€ zu 3,4%
        3. KfW 458 Heizungsförderung: bis 21.000€ Zuschuss
        4. BAFA Einzelmaßnahmen: bis 12.000€ Zuschuss
        
        GESAMT-ERSPARNIS: 80.000-100.000€!
        
        WICHTIG: Anträge VOR Kaufvertrag/Baubeginn!
      `
    },
    
    {
      id: 'landesfoerderung',
      titel: '🗺️ Landesförderung prüfen',
      tags: ['förderung', 'regional'],
      erklaerung: `
        LANDESFÖRDERBANKEN (Auswahl):
        
        NRW.BANK:
        • Eigentumsförderung: 100.000-184.000€ zu 0,5%!
        
        L-Bank (Baden-Württemberg):
        • Z15-Darlehen bis 100.000€
        
        BayernLabo:
        • Zinsverbilligung bis 3% unter Markt
        
        IBB Berlin:
        • FED-Darlehen bis 230.000€
        • Braucht nicht 1. Rang → Echter EK-Ersatz!
        
        ILB Brandenburg:
        • Wohneigentumsförderung bis 230.000€ ZINSFREI!
        
        PRÜFEN: foerderdatenbank.de
      `
    },
    
    {
      id: 'arbeitnehmersparzulage',
      titel: '💰 Arbeitnehmersparzulage + Wohnungsbauprämie',
      tags: ['förderung', 'angestellte'],
      erklaerung: `
        KOMBINIERT für Eigenkapitalaufbau:
        
        ARBEITNEHMERSPARZULAGE 2026:
        • 9% auf VL bis 470€/Jahr = max. 43€
        • Einkommensgrenze: 40.000€ (80.000€ verheiratet)
        
        WOHNUNGSBAUPRÄMIE 2026:
        • 10% auf Sparleistung bis 700€/Jahr = max. 70€
        • Einkommensgrenze: 35.000€ (70.000€ verheiratet)
        
        ÜBER 7 JAHRE (Ehepaar):
        • VL-Einzahlungen: 6.580€
        • Arbeitnehmersparzulage: 602€
        • Eigensparbeiträge: 9.800€
        • Wohnungsbauprämie: 980€
        • Guthabenzinsen: ca. 500€
        → GESAMT: ca. 18.500€ für Eigenkapital!
      `
    },
    
    {
      id: 'sanierungsfoerderung',
      titel: '🌱 Sanierungsförderung bis 70%',
      tags: ['förderung', 'sanierung'],
      erklaerung: `
        HEIZUNGSFÖRDERUNG (KfW 458):
        • Grundförderung: 30%
        • Einkommensbonus (<40.000€): +30%
        • Geschwindigkeitsbonus: +20%
        • MAXIMAL: 70% bzw. 21.000€ Zuschuss!
        
        BEG EINZELMASSNAHMEN (BAFA):
        • Dämmung: 15% (+5% iSFP)
        • Fenster: 15% (+5% iSFP)
        • Förderfähig: bis 60.000€ mit iSFP
        
        KfW 261/262 Komplettsanierung:
        • Bis 150.000€ Kredit
        • Bis 67.500€ Tilgungszuschuss bei EH 40 EE!
        
        TIPP: iSFP (individueller Sanierungsfahrplan) erstellen!
        → Kostet 500-1.000€, aber verdoppelt Fördergrenzen
      `
    }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // KATEGORIE 7: SPEZIELLE SITUATIONEN
  // ═══════════════════════════════════════════════════════════════
  
  spezialSituationen: [
    {
      id: 'selbststaendige',
      titel: '📊 Selbstständige: So klappt die Finanzierung',
      tags: ['selbstständig'],
      erklaerung: `
        SELBSTSTÄNDIGEN-FREUNDLICHE BANKEN:
        • Sparkassen/Volksbanken (regional, individuell)
        • Deutsche Bank (keine pauschalen Aufschläge)
        • Sparda-Banken (Positiv-Listen für Freiberufler)
        • ING (keine Zinsaufschläge!)
        • KfW (behandelt Selbstständige wie Angestellte!)
        
        UNTERLAGEN VORBEREITEN:
        • Steuerbescheide 2-3 Jahre
        • Bilanzen/EÜR 3 Jahre
        • Aktuelle BWA (max. 3 Monate alt!)
        • BWA vom Steuerberater gestempelt
        
        TRICK: Partner mit Festanstellung als Hauptkreditnehmer!
        → Bank prüft primär das sichere Einkommen
        
        BÜRGSCHAFTSBANKEN:
        • Ausfallbürgschaft bis 80%
        • Programm "Bürgschaft ohne Bank (BoB)"
      `
    },
    
    {
      id: 'kapitalanleger-mehrere',
      titel: '🏢 Mehrere Immobilien finanzieren',
      tags: ['investor', 'mehrere-objekte'],
      erklaerung: `
        MIETEINNAHMEN-ANRECHNUNG:
        • Konservative Sparkassen: 50-60%
        • ING, DKB, Filialbanken: 70-75%
        • Die meisten Banken: 75-80%
        • Vereinzelt bei Top-Bonität: 100%
        
        STRATEGIE:
        • Positive Cashflow-Kalkulation vorlegen
        • Eigenes Einkommen sollte Rate auch ohne Miete tragen
        • Professionelles Mietwertgutachten beifügen
        
        CROSS-COLLATERAL:
        Bestehende Immobilien als Zusatzsicherheit einbringen
        → Bessere Konditionen, höherer Beleihungsauslauf
        
        CASH-OUT-REFINANZIERUNG:
        Nach Wertsteigerung neu finanzieren
        → Differenz als EK für nächstes Objekt!
      `
    },
    
    {
      id: 'erbbaurecht',
      titel: '🏠 Erbbaurecht: Grundstück pachten statt kaufen',
      tags: ['wenig-eigenkapital', 'alternativ'],
      erklaerung: `
        Beim Erbbaurecht kaufst du NUR das Gebäude!
        Das Grundstück wird gepachtet.
        
        KONDITIONEN:
        • Erbbauzins: 3-5% des Bodenwerts/Jahr
        • Laufzeit: 50-99 Jahre
        • Deutlich weniger Finanzierungsbedarf!
        
        NACHTEILE:
        • Laufender Erbbauzins (oft indexiert)
        • Gebäude fällt nach Laufzeit an Eigentümer
        • Bankfinanzierung schwieriger
        • Wertsteigerung begrenzt
        
        WANN SINNVOLL?
        • In teuren Städten mit hohen Bodenpreisen
        • Wenn wenig EK vorhanden
        • Für Selbstnutzung über 20-30 Jahre
      `
    },
    
    {
      id: 'zwangsversteigerung',
      titel: '⚖️ Zwangsversteigerung: Chancen & Risiken',
      tags: ['alternativ', 'schnäppchen'],
      erklaerung: `
        VORTEILE:
        • Oft 20-30% unter Marktwert
        • Keine Maklerkosten
        • Keine Notarkosten für Kaufvertrag
        
        NACHTEILE:
        • 10% Sicherheitsleistung nötig (Bankbürgschaft)
        • Keine Besichtigung von innen garantiert
        • Keine Gewährleistung
        • Vollfinanzierung praktisch unmöglich
        
        EMPFOHLEN:
        • 20-30% Eigenkapital mitbringen
        • Vorher Finanzierung klären
        • Gutachten genau studieren
        
        PORTAL: zvg-portal.de
      `
    },
    
    {
      id: 'gbr-kauf',
      titel: '👥 Gemeinsam kaufen (GbR)',
      tags: ['gemeinschaftskauf'],
      erklaerung: `
        Seit 2024: GbR muss als "eGbR" ins Gesellschaftsregister!
        
        VORTEILE:
        • Flexible Anteilsverteilung
        • Bei Gesellschafterwechsel keine Grundbuchänderung
        • Mehr Eigenkapital zusammen
        
        NACHTEILE:
        • Unbeschränkte persönliche Haftung ALLER!
        • Finanzierung komplizierter
        • Bei Streit kompliziert
        
        UNBEDINGT VERTRAGLICH REGELN:
        • Eigenkapitalanteile
        • Aufteilung der Rate
        • Verfahren bei Trennung
        • Vorkaufsrecht
        • Todesfall
        
        ABSICHERUNG:
        • Risikolebensversicherung über Restschuld
        • Verzicht auf Teilungsversteigerung vereinbaren
      `
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// 🤖 INTELLIGENTE TRICK-AUSWAHL NACH USER-SITUATION
// ═══════════════════════════════════════════════════════════════

function waehleTricksFuerUser(userProfil) {
  const {
    eigenkapital,
    kaufpreis,
    einkommen,
    beruf,  // 'angestellt', 'selbststaendig', 'beamter'
    familienstand,
    kinder,
    bundesland,
    nutzung,  // 'selbst', 'kapitalanlage'
    hatLebensversicherung,
    hatDepot,
    hatRiester,
    hatBestehendImmo,
    energieklasse,
    sanierungGeplant
  } = userProfil;
  
  const relevantetricks = [];
  const kaufnebenkosten = kaufpreis * 0.10; // Vereinfacht
  
  // ═══════════════════════════════════════════════════════════
  // IMMER RELEVANTE TRICKS
  // ═══════════════════════════════════════════════════════════
  
  relevantetricks.push(
    ALLE_TRICKS.kaufpreisOptimierung.find(t => t.id === 'inventar-separat'),
    ALLE_TRICKS.kaufpreisOptimierung.find(t => t.id === 'preis-verhandeln'),
    ALLE_TRICKS.finanzierungOptimieren.find(t => t.id === 'banken-vergleichen'),
    ALLE_TRICKS.finanzierungOptimieren.find(t => t.id === 'kfw-kombinieren'),
    ALLE_TRICKS.finanzierungOptimieren.find(t => t.id === 'sondertilgung-verhandeln'),
    ALLE_TRICKS.nebenkostenSparen.find(t => t.id === 'makler-sparen')
  );
  
  // ═══════════════════════════════════════════════════════════
  // WENIG EIGENKAPITAL
  // ═══════════════════════════════════════════════════════════
  
  if (eigenkapital < kaufnebenkosten) {
    relevantetricks.push(
      ALLE_TRICKS.kaufpreisOptimierung.find(t => t.id === 'kaufpreis-erhoehen-nebenkosten'),
      ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'nachrangdarlehen'),
      ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'familie-unterstuetzung'),
      ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'verkaeuferdarlehen'),
      ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'muskelhypothek')
    );
    
    if (hatLebensversicherung) {
      relevantetricks.push(ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'policendarlehen'));
    }
    if (hatDepot) {
      relevantetricks.push(ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'lombardkredit'));
    }
    if (hatRiester) {
      relevantetricks.push(ALLE_TRICKS.eigenkapitalErsatz.find(t => t.id === 'wohnriester'));
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // KAPITALANLEGER
  // ═══════════════════════════════════════════════════════════
  
  if (nutzung === 'kapitalanlage') {
    relevantetricks.push(
      ALLE_TRICKS.kaufpreisOptimierung.find(t => t.id === 'kaufpreisaufteilung'),
      ALLE_TRICKS.steuernOptimieren.find(t => t.id === 'afa-maximieren'),
      ALLE_TRICKS.steuernOptimieren.find(t => t.id === 'werbungskosten'),
      ALLE_TRICKS.steuernOptimieren.find(t => t.id === 'anschaffungsnahe-herstellungskosten'),
      ALLE_TRICKS.steuernOptimieren.find(t => t.id === 'verluste-verrechnen'),
      ALLE_TRICKS.finanzierungOptimieren.find(t => t.id === 'disagio-nutzen')
    );
    
    if (hatBestehendImmo) {
      relevantetricks.push(ALLE_TRICKS.spezialSituationen.find(t => t.id === 'kapitalanleger-mehrere'));
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAMILIE MIT KINDERN
  // ═══════════════════════════════════════════════════════════
  
  if (kinder > 0) {
    relevantetricks.push({
      id: 'familie-foerderung',
      titel: '👨‍👩‍👧‍👦 Spezial: Förderungen für Familien',
      prioritaet: 'HOCH',
      erklaerung: `
        Mit ${kinder} Kind(ern) hast du Zugang zu:
        
        KfW 300 "Wohneigentum für Familien":
        • Nur 1,12% Zins!
        • Kredit: ${170000 + (kinder - 1) * 20000}€
        • Einkommensgrenze: ${90000 + kinder * 10000}€
        
        KfW 308 "Jung kauft Alt" (bei Energieklasse F/G/H):
        • Gleicher Zinsvorteil!
        • Bis 150.000€
        
        ERSPARNIS: 30.000-50.000€ gegenüber Bankkredit!
      `
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // SELBSTSTÄNDIGE
  // ═══════════════════════════════════════════════════════════
  
  if (beruf === 'selbststaendig') {
    relevantetricks.push(ALLE_TRICKS.spezialSituationen.find(t => t.id === 'selbststaendige'));
  }
  
  // ═══════════════════════════════════════════════════════════
  // SANIERUNG GEPLANT
  // ═══════════════════════════════════════════════════════════
  
  if (sanierungGeplant || ['E', 'F', 'G', 'H'].includes(energieklasse)) {
    relevantetricks.push(
      ALLE_TRICKS.foerderungenMaximieren.find(t => t.id === 'sanierungsfoerderung'),
      ALLE_TRICKS.kaufpreisOptimierung.find(t => t.id === 'renovierung-einpreisen')
    );
  }
  
  // ═══════════════════════════════════════════════════════════
  // BUNDESLAND-SPEZIFISCH
  // ═══════════════════════════════════════════════════════════
  
  relevantetricks.push(ALLE_TRICKS.nebenkostenSparen.find(t => t.id === 'grunderwerbsteuer-bundesland'));
  relevantetricks.push(ALLE_TRICKS.foerderungenMaximieren.find(t => t.id === 'landesfoerderung'));
  
  // ═══════════════════════════════════════════════════════════
  // ERGEBNIS AUFBEREITEN
  // ═══════════════════════════════════════════════════════════
  
  // Duplikate entfernen und null-Werte filtern
  const uniqueTricks = [...new Set(relevantetricks.filter(t => t !== undefined))];
  
  // Nach Ersparnis sortieren (höchste zuerst)
  return uniqueTricks.sort((a, b) => {
    const getErsparnis = (t) => {
      if (typeof t.ersparnis === 'string') {
        const match = t.ersparnis.match(/[\d.,]+/);
        return match ? parseFloat(match[0].replace('.', '')) : 0;
      }
      return t.ersparnis || 0;
    };
    return getErsparnis(b) - getErsparnis(a);
  });
}

// ═══════════════════════════════════════════════════════════════
// 📊 OUTPUT-FORMAT FÜR USER
// ═══════════════════════════════════════════════════════════════

function formatiereEmpfehlungenFuerUser(tricks, userProfil) {
  let output = `
## 💡 Deine personalisierten Spar-Tipps

Basierend auf deiner Situation habe ich ${tricks.length} relevante Strategien gefunden:

`;

  let gesamtErsparnis = 0;
  
  tricks.forEach((trick, index) => {
    output += `
### ${index + 1}. ${trick.titel}

${trick.erklaerung}

`;
    if (trick.ersparnis) {
      output += `**💰 Ersparnis-Potenzial:** ${trick.ersparnis}\n\n`;
    }
    if (trick.risiko) {
      output += `**⚠️ Risiko:** ${trick.risiko}\n\n`;
    }
    output += `---\n`;
  });
  
  output += `
## 📋 Deine To-Do-Liste

1. [ ] Mindestens 5 Banken anfragen (inkl. KfW prüfen)
2. [ ] Inventar-Liste für Kaufvertrag erstellen
3. [ ] Landesförderung für ${userProfil.bundesland} prüfen
4. [ ] Verkäufer auf Preisverhandlung ansprechen
`;

  return output;
}

// ═══════════════════════════════════════════════════════════════
// KAUFNEBENKOSTEN-BERECHNUNG (DETAIL)
// ═══════════════════════════════════════════════════════════════

function berechneDetailierteKaufnebenkosten(kaufpreis, bundesland, mitMakler = true) {
```
  // Grunderwerbsteuer nach Bundesland
  const grunderwerbsteuerSaetze = {
    'Bayern': 0.035,           // 3,5% - niedrigster!
    'Sachsen': 0.055,          // 5,5%
    'Hamburg': 0.055,          // 5,5%
    'Baden-Württemberg': 0.05, // 5,0%
    'Rheinland-Pfalz': 0.05,   // 5,0%
    'Sachsen-Anhalt': 0.05,    // 5,0%
    'Bremen': 0.05,            // 5,0%
    'Niedersachsen': 0.05,     // 5,0%
    'Mecklenburg-Vorpommern': 0.06, // 6,0%
    'Hessen': 0.06,            // 6,0%
    'Berlin': 0.06,            // 6,0%
    'NRW': 0.065,              // 6,5% - höchster!
    'Brandenburg': 0.065,      // 6,5%
    'Schleswig-Holstein': 0.065, // 6,5%
    'Thüringen': 0.065,        // 6,5%
    'Saarland': 0.065          // 6,5%
  };
  
  const gstSatz = grunderwerbsteuerSaetze[bundesland] || 0.06;
  
  // Einzelposten berechnen
  const posten = {
    grunderwerbsteuer: {
      name: 'Grunderwerbsteuer',
      prozent: gstSatz * 100,
      betrag: Math.round(kaufpreis * gstSatz),
      pflicht: true,
      zahlbar: 'Ca. 4-6 Wochen nach Kaufvertrag',
      tipp: bundesland === 'Bayern' ? '✅ Bayern hat den niedrigsten Satz!' : 
            gstSatz >= 0.065 ? '⚠️ Hoher Satz – beim Preis verhandeln!' : null
    },
    notar: {
      name: 'Notarkosten',
      prozent: 1.5,
      betrag: Math.round(kaufpreis * 0.015),
      pflicht: true,
      zahlbar: 'Bei Beurkundung oder kurz danach',
      tipp: 'Enthält: Beurkundung, Beratung, Vollzug, Betreuung'
    },
    grundbuch: {
      name: 'Grundbuchamt',
      prozent: 0.5,
      betrag: Math.round(kaufpreis * 0.005),
      pflicht: true,
      zahlbar: 'Nach Eintragung (ca. 2-4 Monate)',
      tipp: 'Enthält: Auflassungsvormerkung, Eigentumsumschreibung, Grundschuld'
    },
    makler: {
      name: 'Maklerprovision',
      prozent: mitMakler ? 3.57 : 0,
      betrag: mitMakler ? Math.round(kaufpreis * 0.0357) : 0,
      pflicht: false,
      zahlbar: 'Bei Kaufvertragsabschluss',
      tipp: mitMakler ? '💡 Seit 2020: Käufer zahlt max. 50% der Provision' : '✅ Kein Makler = Ersparnis!'
    }
  };
  
  // Summen
  const gesamtOhneMakler = posten.grunderwerbsteuer.betrag + posten.notar.betrag + posten.grundbuch.betrag;
  const gesamtMitMakler = gesamtOhneMakler + posten.makler.betrag;
  
  // Prozentsätze
  const prozentOhneMakler = ((gesamtOhneMakler / kaufpreis) * 100).toFixed(2);
  const prozentMitMakler = ((gesamtMitMakler / kaufpreis) * 100).toFixed(2);
  
  return {
    posten,
    zusammenfassung: {
      ohneMakler: {
        betrag: gesamtOhneMakler,
        prozent: prozentOhneMakler
      },
      mitMakler: {
        betrag: gesamtMitMakler,
        prozent: prozentMitMakler
      }
    },
    bundesland,
    kaufpreis
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 KREDIT-BEWILLIGUNGS-CHANCE BERECHNEN
// ═══════════════════════════════════════════════════════════════

function berechneKreditChance(eigenkapital, kaufpreis, kaufnebenkosten, monatlichesNetto, schufa = 'gut') {
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  const eigenkapitalQuote = eigenkapital / gesamtkosten;
  const beleihungsauslauf = ((gesamtkosten - eigenkapital) / kaufpreis) * 100;
  
  let basisChance = 0;
  let faktoren = [];
  let tipps = [];
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 1: Eigenkapital-Quote (wichtigster Faktor!)
  // ═══════════════════════════════════════════════════════════
  
  if (eigenkapital >= kaufnebenkosten + kaufpreis * 0.20) {
    // 20%+ EK = Sehr gut
    basisChance = 95;
    faktoren.push({ name: 'Eigenkapital 20%+', effekt: '+95%', icon: '🟢' });
  } else if (eigenkapital >= kaufnebenkosten + kaufpreis * 0.10) {
    // 10% EK = Gut
    basisChance = 80;
    faktoren.push({ name: 'Eigenkapital 10-20%', effekt: '+80%', icon: '🟢' });
  } else if (eigenkapital >= kaufnebenkosten) {
    // Nur Nebenkosten = Möglich
    basisChance = 60;
    faktoren.push({ name: 'Nur Nebenkosten als EK', effekt: '+60%', icon: '🟡' });
    tipps.push({
      typ: 'Eigenkapital erhöhen',
      text: `Mit ${Math.round(kaufpreis * 0.10).toLocaleString()}€ mehr EK steigt deine Chance auf 80%`
    });
  } else if (eigenkapital >= kaufnebenkosten * 0.5) {
    // Nur halbe Nebenkosten = Schwierig
    basisChance = 35;
    faktoren.push({ name: 'Unter 50% der Nebenkosten', effekt: '+35%', icon: '🟠' });
    tipps.push({
      typ: '110%-Finanzierung nötig',
      text: 'Nur wenige Banken machen das – Interhyp, Dr. Klein anfragen'
    });
  } else if (eigenkapital > 0) {
    // Fast nichts = Sehr schwierig
    basisChance = 20;
    faktoren.push({ name: 'Minimal-Eigenkapital', effekt: '+20%', icon: '🔴' });
  } else {
    // 0€ = Extrem schwierig
    basisChance = 10;
    faktoren.push({ name: 'Kein Eigenkapital', effekt: '+10%', icon: '🔴' });
    tipps.push({
      typ: '⚠️ 0€ Eigenkapital',
      text: 'Nur in Ausnahmefällen möglich – siehe Profi-Tipps unten!'
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 2: SCHUFA-Score
  // ═══════════════════════════════════════════════════════════
  
  const schufaModifier = {
    'sehr gut': 5,
    'gut': 0,
    'befriedigend': -10,
    'ausreichend': -25,
    'schlecht': -50
  };
  
  const schufaEffect = schufaModifier[schufa] || 0;
  basisChance += schufaEffect;
  
  if (schufaEffect !== 0) {
    faktoren.push({ 
      name: `SCHUFA: ${schufa}`, 
      effekt: `${schufaEffect >= 0 ? '+' : ''}${schufaEffect}%`,
      icon: schufaEffect >= 0 ? '🟢' : '🔴'
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 3: Einkommensüberschuss
  // ═══════════════════════════════════════════════════════════
  
  // Bank rechnet: Rate darf max. 35-40% des Nettos sein
  const geschaetzteRate = (gesamtkosten - eigenkapital) * 0.05 / 12; // ~5% Annuität
  const belastungsquote = geschaetzteRate / monatlichesNetto;
  
  if (belastungsquote < 0.30) {
    basisChance += 10;
    faktoren.push({ name: 'Niedrige Belastungsquote (<30%)', effekt: '+10%', icon: '🟢' });
  } else if (belastungsquote < 0.35) {
    faktoren.push({ name: 'Normale Belastungsquote (30-35%)', effekt: '±0%', icon: '🟡' });
  } else if (belastungsquote < 0.40) {
    basisChance -= 10;
    faktoren.push({ name: 'Hohe Belastungsquote (35-40%)', effekt: '-10%', icon: '🟠' });
  } else {
    basisChance -= 25;
    faktoren.push({ name: 'Sehr hohe Belastungsquote (>40%)', effekt: '-25%', icon: '🔴' });
    tipps.push({
      typ: 'Belastungsquote zu hoch',
      text: 'Günstigere Immobilie suchen oder Eigenkapital erhöhen'
    });
  }
  
  // Chance begrenzen
  const finaleChance = Math.max(5, Math.min(98, basisChance));
  
  // ═══════════════════════════════════════════════════════════
  // PROFI-TIPPS JE NACH SITUATION
  // ═══════════════════════════════════════════════════════════
  
  const profiTipps = generiereProfiTipps(eigenkapital, kaufpreis, kaufnebenkosten, finaleChance);
  
  return {
    chance: finaleChance,
    chanceBewertung: bewerteChance(finaleChance),
    faktoren,
    tipps,
    profiTipps,
    details: {
      eigenkapitalQuote: Math.round(eigenkapitalQuote * 100),
      beleihungsauslauf: Math.round(beleihungsauslauf),
      belastungsquote: Math.round(belastungsquote * 100),
      geschaetzteRate: Math.round(geschaetzteRate)
    }
  };
}

function bewerteChance(chance) {
  if (chance >= 90) return { ampel: '🟢', text: 'Sehr hohe Chance', beschreibung: 'Fast sicher – mehrere Banken werden zusagen' };
  if (chance >= 75) return { ampel: '🟢', text: 'Gute Chance', beschreibung: 'Realistisch – 2-3 Banken anfragen' };
  if (chance >= 50) return { ampel: '🟡', text: 'Moderate Chance', beschreibung: 'Möglich – viele Banken anfragen, gut vorbereiten' };
  if (chance >= 30) return { ampel: '🟠', text: 'Geringe Chance', beschreibung: 'Schwierig – Spezialkreditvermittler nötig' };
  if (chance >= 15) return { ampel: '🔴', text: 'Sehr geringe Chance', beschreibung: 'Sehr schwierig – Profi-Tricks anwenden!' };
  return { ampel: '🔴', text: 'Minimal', beschreibung: 'Fast unmöglich – aber es gibt Wege...' };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 PROFI-TIPPS FÜR SCHWIERIGE FÄLLE
// ═══════════════════════════════════════════════════════════════

function generiereProfiTipps(eigenkapital, kaufpreis, kaufnebenkosten, chance) {
  const tipps = [];
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  const fehlendesEK = kaufnebenkosten - eigenkapital;
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 1: Kaufpreis-Erhöhung für Nebenkosten (DER KLASSIKER!)
  // ═══════════════════════════════════════════════════════════
  
  if (eigenkapital < kaufnebenkosten) {
    const erhoehterkaufpreis = kaufpreis + fehlendesEK;
    
    tipps.push({
      titel: '💡 Kaufpreis erhöhen, Nebenkosten vom Verkäufer',
      schwierigkeit: 'Mittel',
      ersparnis: `${fehlendesEK.toLocaleString()}€ weniger EK nötig`,
      erklaerung: `
        Verhandle mit dem Verkäufer:
        • Statt ${kaufpreis.toLocaleString()}€ Kaufpreis
        • Zahle ${erhoehterkaufpreis.toLocaleString()}€ Kaufpreis
        • Verkäufer übernimmt ${fehlendesEK.toLocaleString()}€ Nebenkosten
        
        Der Verkäufer bekommt das gleiche Geld, aber DU brauchst weniger EK!
      `,
      beispiel: {
        vorher: {
          kaufpreis: kaufpreis,
          nebenkosten: kaufnebenkosten,
          eigenkapitalBedarf: kaufnebenkosten
        },
        nachher: {
          kaufpreis: erhoehterkaufpreis,
          nebenkosten: Math.round(erhoehterkaufpreis * 0.10),
          eigenkapitalBedarf: 0,
          hinweis: 'Bank finanziert den höheren Kaufpreis mit!'
        }
      },
      warnung: '⚠️ Funktioniert nur wenn Bank den höheren Preis akzeptiert (Wertgutachten!)'
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 2: Renovierungskosten einpreisen
  // ═══════════════════════════════════════════════════════════
  
  tipps.push({
    titel: '🔧 Renovierungskosten in Kaufpreis einrechnen',
    schwierigkeit: 'Leicht',
    erklaerung: `
      Wenn Renovierung geplant ist:
      • Renovierungskosten schätzen (z.B. 20.000€)
      • Mit Verkäufer höheren Kaufpreis vereinbaren
      • Bank finanziert Renovierung gleich mit!
      
      Alternativ: KfW-Kredit für Sanierung (wird separat finanziert)
    `
  });
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 3: Nachrangdarlehen / Eigenkapitalersatz
  // ═══════════════════════════════════════════════════════════
  
  if (chance < 60) {
    tipps.push({
      titel: '🏦 Nachrangdarlehen als EK-Ersatz',
      schwierigkeit: 'Mittel',
      erklaerung: `
        Einige Anbieter geben "Eigenkapitalersatz-Darlehen":
        • Wird wie EK behandelt (Nachrang im Grundbuch)
        • Höherer Zins (6-9%), aber ermöglicht Kauf
        • Anbieter: auxmoney, Creditolo, einige Bausparkassen
        
        Rechnung: Lieber 7% auf 30.000€ Nachrangdarlehen 
        als gar kein Eigenheim!
      `,
      warnung: '⚠️ Nur wenn Cashflow trotzdem positiv bleibt!'
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 4: Bausparvertrag vorschalten
  // ═══════════════════════════════════════════════════════════
  
  tipps.push({
    titel: '🏗️ Bausparvertrag als Türöffner',
    schwierigkeit: 'Zeit nötig',
    erklaerung: `
      Bausparkassen sind großzügiger bei der Finanzierung:
      • Bausparvertrag abschließen (z.B. 50.000€)
      • Nur 40-50% ansparen nötig
      • Dann Sofortfinanzierung möglich
      
      Vorteil: Niedrigerer Zins nach Zuteilung
    `
  });
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 5: Familienkredit / Schenkung
  // ═══════════════════════════════════════════════════════════
  
  tipps.push({
    titel: '👨‍👩‍👧 Familie um Hilfe bitten',
    schwierigkeit: 'Leicht',
    erklaerung: `
      Möglichkeiten:
      • Schenkung (bis 400.000€ steuerfrei von Eltern!)
      • Familienkredit (Vertrag schriftlich!)
      • Bürgschaft (Familie bürgt, du zahlst)
      
      Selbst 10.000-20.000€ können den Unterschied machen!
    `,
    steuerTipp: 'Freibeträge: Eltern→Kind 400.000€, Großeltern→Enkel 200.000€'
  });
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 6: Günstigeres Objekt / Andere Region
  // ═══════════════════════════════════════════════════════════
  
  if (chance < 50) {
    const guenstigererPreis = Math.round(kaufpreis * 0.85);
    
    tipps.push({
      titel: '🏠 Günstigeres Objekt wählen',
      schwierigkeit: 'Kompromiss',
      erklaerung: `
        Vielleicht ist ${kaufpreis.toLocaleString()}€ zu ambitioniert.
        
        Bei ${guenstigererPreis.toLocaleString()}€ (-15%):
        • Nebenkosten: ~${Math.round(guenstigererPreis * 0.10).toLocaleString()}€
        • Deine Chance steigt auf ~${Math.min(chance + 25, 90)}%
        
        Alternativen:
        • Kleinere Wohnung
        • Anderer Stadtteil
        • Andere Stadt (bessere Renditen!)
      `
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 7: Makler sparen
  // ═══════════════════════════════════════════════════════════
  
  const maklerErsparnis = Math.round(kaufpreis * 0.0357);
  
  tipps.push({
    titel: '🔍 Ohne Makler kaufen',
    schwierigkeit: 'Suchen nötig',
    ersparnis: `${maklerErsparnis.toLocaleString()}€`,
    erklaerung: `
      Maklerfreie Objekte finden:
      • eBay Kleinanzeigen
      • nebenan.de
      • Direkt bei Bauträgern
      • Zwangsversteigerungen (zvg-portal.de)
      • Lokale Zeitungen
      
      Ersparnis: ${maklerErsparnis.toLocaleString()}€ weniger EK nötig!
    `
  });
  
  // ═══════════════════════════════════════════════════════════
  // TIPP 8: Muskelhypothek
  // ═══════════════════════════════════════════════════════════
  
  tipps.push({
    titel: '💪 Eigenleistung als Eigenkapital',
    schwierigkeit: 'Arbeit nötig',
    erklaerung: `
      Bei Sanierungsobjekten:
      • Eigenleistung wird als EK anerkannt (bis 15% der Baukosten)
      • Malerarbeiten, Bodenbeläge, Garten = ca. 10-20€/Stunde
      
      Beispiel: 200 Stunden Eigenleistung = 4.000€ "EK"
    `,
    warnung: 'Realistisch bleiben – nicht alle Banken akzeptieren das!'
  });
  
  return tipps;
}

// ═══════════════════════════════════════════════════════════════
// 🆕 ZUSAMMENFASSUNG FÜR UI: Eigenkapital-Situation
// ═══════════════════════════════════════════════════════════════

function bewerteEigenkapitalSituation(input) {
  const { eigenkapital, kaufpreis, bundesland, monatlichesNetto, schufa } = input;
  
  // Nebenkosten berechnen
  const nebenkosten = berechneDetailierteKaufnebenkosten(kaufpreis, bundesland, true);
  const kaufnebenkostenBetrag = nebenkosten.zusammenfassung.mitMakler.betrag;
  
  // Kredit-Chance berechnen
  const kreditChance = berechneKreditChance(eigenkapital, kaufpreis, kaufnebenkostenBetrag, monatlichesNetto, schufa);
  
  // Eigenkapital-Bewertung
  const ekQuote = eigenkapital / (kaufpreis + kaufnebenkostenBetrag);
  let ekBewertung;
  
  if (eigenkapital >= kaufnebenkostenBetrag + kaufpreis * 0.20) {
    ekBewertung = { 
      text: 'Optimal', 
      icon: '🟢🟢', 
      erklaerung: 'Du bringst mehr als 20% EK mit – beste Konditionen garantiert!' 
    };
  } else if (eigenkapital >= kaufnebenkostenBetrag + kaufpreis * 0.10) {
    ekBewertung = { 
      text: 'Gut', 
      icon: '🟢', 
      erklaerung: '10-20% EK – solide Finanzierung möglich' 
    };
  } else if (eigenkapital >= kaufnebenkostenBetrag) {
    ekBewertung = { 
      text: 'Minimum', 
      icon: '🟡', 
      erklaerung: 'Nur Nebenkosten als EK – 100% Finanzierung, aber machbar' 
    };
  } else if (eigenkapital > 0) {
    ekBewertung = { 
      text: 'Unter Minimum', 
      icon: '🟠', 
      erklaerung: 'Weniger als Nebenkosten – schwierig, aber Tricks möglich!' 
    };
  } else {
    ekBewertung = { 
      text: 'Kein EK', 
      icon: '🔴', 
      erklaerung: '110%+ Finanzierung nötig – nur mit Profi-Tricks!' 
    };
  }
  
  return {
    nebenkosten,
    kreditChance,
    ekBewertung,
    empfohlenesMindestEK: kaufnebenkostenBetrag,
    empfohlenesOptimalEK: kaufnebenkostenBetrag + kaufpreis * 0.20,
    differenzZuMinimum: Math.max(0, kaufnebenkostenBetrag - eigenkapital),
    differenzZuOptimal: Math.max(0, (kaufnebenkostenBetrag + kaufpreis * 0.20) - eigenkapital)
  };
}
```

function berechneEffektivzins(basiszins, beleihungsauslauf) {
  // Banken berechnen Aufschläge je nach Beleihung
  let aufschlag = 0;
  
  if (beleihungsauslauf > 100) aufschlag = 0.008;      // 110%+ = +0,8%
  else if (beleihungsauslauf > 90) aufschlag = 0.005;  // 90-100% = +0,5%
  else if (beleihungsauslauf > 80) aufschlag = 0.003;  // 80-90% = +0,3%
  else if (beleihungsauslauf > 60) aufschlag = 0.001;  // 60-80% = +0,1%
  // Unter 60% = Bestkonditionen (kein Aufschlag)
  
  return basiszins + aufschlag;
}

function berechneAnnuitaet(kredit, zinssatz, tilgungssatz) {
  // Einfache Formel: Kredit × (Zins + Tilgung)
  return kredit * (zinssatz + tilgungssatz);
}

function berechneRenditen(input, kredit, cashflowMonat) {
  const { kaufpreis, kaltmiete, eigenkapital, hausgeld } = input;
  const kaufnebenkosten = kaufpreis * 0.10; // Vereinfacht 10%
  const gesamtinvestition = kaufpreis + kaufnebenkosten;
  
  // Jahreswerte
  const jahresmiete = kaltmiete * 12;
  const jahresCashflow = cashflowMonat * 12;
  const nichtUmlagefaehig = hausgeld * 0.35 * 12;
  
  // Bruttorendite
  const bruttorendite = (jahresmiete / kaufpreis) * 100;
  
  // Nettomietrendite
  const nettomietrendite = ((jahresmiete - nichtUmlagefaehig) / gesamtinvestition) * 100;
  
  // Kaufpreisfaktor
  const kaufpreisfaktor = kaufpreis / jahresmiete;
  
  // Eigenkapitalrendite (Cashflow-basiert)
  const eigenkapitalrendite = eigenkapital > 0 
    ? (jahresCashflow / eigenkapital) * 100 
    : Infinity;
  
  // Objektrendite (vor Finanzierung)
  const objektrendite = ((jahresmiete - nichtUmlagefaehig) / kaufpreis) * 100;
  
  // Leverage-Effekt
  const fremdkapitalquote = kredit / gesamtinvestition;
  const eigenkapitalquote = 1 - fremdkapitalquote;
  const leverageFaktor = fremdkapitalquote / eigenkapitalquote;
  
  return {
    bruttorendite: Math.round(bruttorendite * 100) / 100,
    nettomietrendite: Math.round(nettomietrendite * 100) / 100,
    kaufpreisfaktor: Math.round(kaufpreisfaktor * 10) / 10,
    eigenkapitalrendite: Math.round(eigenkapitalrendite * 100) / 100,
    objektrendite: Math.round(objektrendite * 100) / 100,
    leverageFaktor: Math.round(leverageFaktor * 100) / 100
  };
}

function berechne30JahresProjektion(input, kredit, zinssatz) {
  const { 
    kaltmiete, 
    hausgeld, 
    kaufpreis, 
    tilgungssatz,
    mietsteigerungProJahr = 0.02,
    wertsteigerungProJahr = 0.02,
    sondertilgungProJahr = 0
  } = input;
  
  const jahresrate = kredit * (zinssatz + tilgungssatz);
  const nichtUmlagefaehig = hausgeld * 0.35;
  
  let restschuld = kredit;
  let immowert = kaufpreis;
  let gesamtCashflow = 0;
  let gesamtTilgung = 0;
  let gesamtZinsen = 0;
  
  const jahre = [];
  
  for (let jahr = 1; jahr <= 30; jahr++) {
    // Mietsteigerung
    const aktuelleMiete = kaltmiete * Math.pow(1 + mietsteigerungProJahr, jahr);
    const jahresmiete = aktuelleMiete * 12;
    
    // Zins & Tilgung
    const zinsenJahr = restschuld * zinssatz;
    const tilgungJahr = jahresrate - zinsenJahr + sondertilgungProJahr;
    restschuld = Math.max(0, restschuld - tilgungJahr);
    
    // Wertsteigerung
    immowert = kaufpreis * Math.pow(1 + wertsteigerungProJahr, jahr);
    
    // Cashflow
    const cashflowJahr = jahresmiete - jahresrate - (nichtUmlagefaehig * 12);
    
    gesamtCashflow += cashflowJahr;
    gesamtTilgung += tilgungJahr;
    gesamtZinsen += zinsenJahr;
    
    jahre.push({
      jahr,
      miete: Math.round(jahresmiete),
      zinsen: Math.round(zinsenJahr),
      tilgung: Math.round(tilgungJahr),
      restschuld: Math.round(restschuld),
      cashflow: Math.round(cashflowJahr),
      immowert: Math.round(immowert),
      eigenkapitalImObjekt: Math.round(immowert - restschuld),
      cashflowKumuliert: Math.round(gesamtCashflow)
    });
    
    // Wenn abbezahlt, aufhören
    if (restschuld <= 0) break;
  }
  
  return {
    jahre,
    zusammenfassung: {
      jahreBisSchuldenfrei: jahre.findIndex(j => j.restschuld <= 0) + 1 || 30,
      gesamtCashflow: Math.round(gesamtCashflow),
      gesamtZinsen: Math.round(gesamtZinsen),
      gesamtTilgung: Math.round(gesamtTilgung),
      endwertImmobilie: Math.round(immowert),
      endRestschuld: Math.round(restschuld),
      vermoegenszuwachs: Math.round(immowert - restschuld)
    }
  };
}

function berechneSteuereffekt(input, kredit) {
  const { 
    kaufpreis, 
    baujahr, 
    zinssatz, 
    grenzsteuersatz = 0.42,
    wohnflaeche
  } = input;
  
  // Gebäudeanteil (typisch 80% des Kaufpreises)
  const gebaeudewert = kaufpreis * 0.80;
  
  // AfA-Satz nach Baujahr
  let afaSatz;
  if (baujahr >= 2023) afaSatz = 0.03;
  else if (baujahr >= 1925) afaSatz = 0.02;
  else afaSatz = 0.025;
  
  const afaJahr = gebaeudewert * afaSatz;
  const zinsenJahr = kredit * zinssatz;
  const werbungskosten = 500; // Pauschale für Fahrtkosten, etc.
  
  const absetzbarGesamt = afaJahr + zinsenJahr + werbungskosten;
  const steuerersparnisJahr = absetzbarGesamt * grenzsteuersatz;
  
  return {
    afaJahr: Math.round(afaJahr),
    zinsenJahr: Math.round(zinsenJahr),
    werbungskosten,
    absetzbarGesamt: Math.round(absetzbarGesamt),
    steuerersparnisJahr: Math.round(steuerersparnisJahr),
    monatlich: Math.round(steuerersparnisJahr / 12)
  };
}

function bewerteCashflow(cashflow) {
  if (cashflow >= 200) return { ampel: '🟢', text: 'Sehr gut', score: 95 };
  if (cashflow >= 100) return { ampel: '🟢', text: 'Gut', score: 85 };
  if (cashflow >= 0) return { ampel: '🟢', text: 'Cashflow-neutral', score: 70 };
  if (cashflow >= -100) return { ampel: '🟡', text: 'Leicht negativ', score: 55 };
  if (cashflow >= -200) return { ampel: '🟠', text: 'Negativ', score: 40 };
  return { ampel: '🔴', text: 'Stark negativ', score: 20 };
}
```

### SLIDER-KONFIGURATION FÜR UI

```javascript
const SLIDER_CONFIG = {
  eigenkapital: {
    label: 'Eigenkapital',
    min: 0,
    max: (kaufpreis) => kaufpreis * 1.1, // Bis 110% (inkl. Nebenkosten)
    step: 1000,
    default: (kaufpreis) => kaufpreis * 0.1, // 10% als Standard
    format: (val) => `${val.toLocaleString()}€`,
    einfluss: 'Mehr EK = Weniger Kredit = Niedrigere Rate = Besserer Cashflow'
  },
  
  zinssatz: {
    label: 'Zinssatz',
    min: 0.01,
    max: 0.08,
    step: 0.001,
    default: 0.038,
    format: (val) => `${(val * 100).toFixed(2)}%`,
    einfluss: 'Höherer Zins = Höhere Rate = Schlechterer Cashflow'
  },
  
  tilgung: {
    label: 'Anfängliche Tilgung',
    min: 0.01,
    max: 0.05,
    step: 0.0025,
    default: 0.015,
    format: (val) => `${(val * 100).toFixed(2)}%`,
    einfluss: 'Höhere Tilgung = Schneller schuldenfrei, aber höhere Rate'
  },
  
  zinsbindung: {
    label: 'Zinsbindung',
    options: [5, 10, 15, 20, 25, 30],
    default: 15,
    format: (val) => `${val} Jahre`,
    einfluss: 'Längere Bindung = Mehr Sicherheit, aber leicht höherer Zins'
  },
  
  sondertilgung: {
    label: 'Jährliche Sondertilgung',
    min: 0,
    max: (kredit) => kredit * 0.1, // Max 10% p.a.
    step: 1000,
    default: 0,
    format: (val) => `${val.toLocaleString()}€/Jahr`,
    einfluss: 'Schneller schuldenfrei, mehr Flexibilität'
  },
  
  mietsteigerung: {
    label: 'Erwartete Mietsteigerung',
    min: 0,
    max: 0.05,
    step: 0.005,
    default: 0.02,
    format: (val) => `${(val * 100).toFixed(1)}%/Jahr`,
    einfluss: 'Höhere Steigerung = Besserer Cashflow in Zukunft'
  },
  
  wertsteigerung: {
    label: 'Erwartete Wertsteigerung',
    min: 0,
    max: 0.05,
    step: 0.005,
    default: 0.02,
    format: (val) => `${(val * 100).toFixed(1)}%/Jahr`,
    einfluss: 'Höhere Steigerung = Mehr Vermögen bei Verkauf'
  }
};
```

### SZENARIEN-VERGLEICH (Automatisch generiert)

```javascript
function generiereVergleichsSzenarien(basisInput) {
  const szenarien = [
    {
      name: '100% Finanzierung (Maximaler Hebel)',
      eigenkapital: basisInput.kaufnebenkosten,
      beschreibung: 'Nur Nebenkosten als EK, maximaler Leverage-Effekt'
    },
    {
      name: '90% Finanzierung',
      eigenkapital: basisInput.kaufpreis * 0.10 + basisInput.kaufnebenkosten,
      beschreibung: '10% vom Kaufpreis + Nebenkosten'
    },
    {
      name: '80% Finanzierung (Bankstandard)',
      eigenkapital: basisInput.kaufpreis * 0.20 + basisInput.kaufnebenkosten,
      beschreibung: 'Klassische Finanzierung, gute Konditionen'
    },
    {
      name: '70% Finanzierung (Konservativ)',
      eigenkapital: basisInput.kaufpreis * 0.30 + basisInput.kaufnebenkosten,
      beschreibung: 'Niedrigeres Risiko, beste Zinskonditionen'
    },
    {
      name: '60% Finanzierung (Sehr sicher)',
      eigenkapital: basisInput.kaufpreis * 0.40 + basisInput.kaufnebenkosten,
      beschreibung: 'Minimales Risiko, aber viel Kapital gebunden'
    },
    {
      name: 'Cashflow-Neutral',
      eigenkapital: 'berechnen', // Wird dynamisch berechnet
      beschreibung: 'Genau so viel EK, dass Cashflow = 0'
    },
    {
      name: '+100€ Cashflow',
      eigenkapital: 'berechnen',
      beschreibung: 'Genug EK für 100€ monatlichen Überschuss'
    },
    {
      name: '+200€ Cashflow',
      eigenkapital: 'berechnen',
      beschreibung: 'Genug EK für 200€ monatlichen Überschuss'
    }
  ];
  
  // Berechne alle Szenarien
  return szenarien.map(szenario => {
    let ek = szenario.eigenkapital;
    
    // Berechne EK für Cashflow-Ziele
    if (ek === 'berechnen') {
      if (szenario.name.includes('Neutral')) {
        ek = berechneEKFuerCashflow(basisInput, 0);
      } else if (szenario.name.includes('+100')) {
        ek = berechneEKFuerCashflow(basisInput, 100);
      } else if (szenario.name.includes('+200')) {
        ek = berechneEKFuerCashflow(basisInput, 200);
      }
    }
    
    const ergebnis = berechneAlles({ ...basisInput, eigenkapital: ek });
    
    return {
      ...szenario,
      eigenkapital: ek,
      ergebnis
    };
  });
}

function berechneEKFuerCashflow(input, zielCashflow) {
  const { kaufpreis, kaltmiete, hausgeld, zinssatz, tilgungssatz } = input;
  const kaufnebenkosten = kaufpreis * 0.10;
  const nichtUmlagefaehig = hausgeld * 0.35;
  const instandhaltung = 50; // Vereinfacht
  const mietausfall = kaltmiete * 0.02;
  
  // Verfügbar für Rate = Miete - NK - Ziel-Cashflow
  const verfuegbarFuerRate = kaltmiete - nichtUmlagefaehig - instandhaltung - mietausfall - zielCashflow;
  
  // Max Kredit bei dieser Rate
  const maxKredit = (verfuegbarFuerRate * 12) / (zinssatz + tilgungssatz);
  
  // Benötigtes EK
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  const benoetigtesEK = Math.max(gesamtkosten - maxKredit, 0);
  
  return Math.round(benoetigtesEK);
}
```

### LIVE-UPDATE TRIGGER

```javascript
// Diese Funktion wird bei JEDER Änderung eines Sliders aufgerufen
function onInputChange(inputName, neuerWert, alleInputs) {
  // 1. Input aktualisieren
  alleInputs[inputName] = neuerWert;
  
  // 2. Alles neu berechnen
  const ergebnis = berechneAlles(alleInputs);
  
  // 3. UI aktualisieren
  updateAnzeige(ergebnis);
  updateCharts(ergebnis.projektion);
  updateSzenarien(generiereVergleichsSzenarien(alleInputs));
  
  // 4. Bewertung aktualisieren
  updateBewertung(ergebnis.bewertung);
}

// Debounce für Performance (nicht bei jedem Pixel-Move updaten)
const debouncedOnChange = debounce(onInputChange, 50);
```

### Feature 2: Interaktive Diagramme (PFLICHT!)

**Chart 1: Cashflow über 30 Jahre**
```javascript
function generateCashflowChart(params) {
  const data = [];
  let restschuld = params.kredit;
  
  for (let jahr = 0; jahr <= 30; jahr++) {
    const zinsen = restschuld * params.zinssatz;
    const tilgung = params.jahresrate - zinsen;
    restschuld = Math.max(0, restschuld - tilgung);
    
    // Mietsteigerung 2% p.a.
    const miete = params.jahresmiete * Math.pow(1.02, jahr);
    const cashflow = miete - params.jahresrate - params.nichtUmlagefaehig;
    
    data.push({
      jahr,
      cashflow: Math.round(cashflow),
      miete: Math.round(miete),
      rate: Math.round(params.jahresrate),
      zinsen: Math.round(zinsen),
      tilgung: Math.round(tilgung)
    });
  }
  return data;
}
```

**Chart 2: Tilgungsverlauf (Zinsen vs. Tilgung)**
```javascript
function generateTilgungsChart(params) {
  const data = [];
  let restschuld = params.kredit;
  
  for (let jahr = 0; jahr <= 30; jahr++) {
    const zinsen = restschuld * params.zinssatz;
    const tilgung = Math.min(params.jahresrate - zinsen, restschuld);
    restschuld = Math.max(0, restschuld - tilgung);
    
    data.push({
      jahr,
      zinsen: Math.round(zinsen),
      tilgung: Math.round(tilgung),
      restschuld: Math.round(restschuld),
      getilgtProzent: Math.round((1 - restschuld / params.kredit) * 100)
    });
    
    if (restschuld === 0) break;
  }
  return data;
}
```

**Chart 3: Restschuld-Entwicklung**
- X-Achse: Jahre (0-30)
- Y-Achse: Restschuld in €
- Linie zeigt wie schnell abbezahlt wird
- Markierung bei Jahr 10 (Sonderkündigungsrecht!)
- Markierung bei Volltilgung

**Chart 4: Vermögensaufbau**
```javascript
function generateVermoegensChart(params) {
  const data = [];
  let restschuld = params.kredit;
  let immowert = params.kaufpreis;
  
  for (let jahr = 0; jahr <= 30; jahr++) {
    const tilgung = params.jahresrate - (restschuld * params.zinssatz);
    restschuld = Math.max(0, restschuld - tilgung);
    
    // Wertsteigerung 2% p.a. (konservativ)
    immowert = params.kaufpreis * Math.pow(1.02, jahr);
    
    const eigenkapitalImObjekt = immowert - restschuld;
    
    data.push({
      jahr,
      immowert: Math.round(immowert),
      restschuld: Math.round(restschuld),
      eigenkapital: Math.round(eigenkapitalImObjekt),
      renditeAufEK: Math.round((eigenkapitalImObjekt / params.anfangsEK - 1) * 100)
    });
  }
  return data;
}
```

**Chart 5: Szenario-Vergleich (Balkendiagramm)**
- Zeigt alle Szenarien nebeneinander
- Cashflow, EK-Bedarf, Rendite pro Szenario
- Farbcodierung: Grün/Gelb/Rot

**Chart 6: Steuerersparnis über Zeit**
```javascript
function generateSteuerChart(params) {
  const data = [];
  let gebaeudewert = params.gebaeudewert;
  
  for (let jahr = 1; jahr <= 15; jahr++) {
    // AfA berechnen (je nach Typ)
    let afa;
    if (params.afaTyp === 'degressiv') {
      afa = gebaeudewert * 0.05;
      gebaeudewert -= afa;
    } else {
      afa = params.gebaeudewert * params.afaSatz;
    }
    
    const zinsen = params.restschuld * params.zinssatz;
    const absetzbar = afa + zinsen + params.werbungskosten;
    const steuerersparnis = absetzbar * params.grenzsteuersatz;
    
    data.push({
      jahr,
      afa: Math.round(afa),
      zinsen: Math.round(zinsen),
      absetzbarGesamt: Math.round(absetzbar),
      steuerersparnis: Math.round(steuerersparnis),
      effektiverCashflow: Math.round(params.cashflow + steuerersparnis / 12)
    });
  }
  return data;
}
```

### Feature 3: Vollständiges Analyse-Blatt (1-Seiter PDF)

**Das Analyse-Blatt enthält:**

```
╔══════════════════════════════════════════════════════════════╗
║         🏠 IMMOBILIEN-INVESTMENT-ANALYSE                      ║
║         Objekt: [Adresse]                                     ║
║         Erstellt: [Datum]                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📊 OBJEKTDATEN                    💰 FINANZIERUNG            ║
║  ─────────────────                 ─────────────────          ║
║  Kaufpreis: 280.000€               Kredit: 280.000€           ║
║  Wohnfläche: 75m²                  Zinssatz: 3.8%             ║
║  Preis/m²: 3.733€                  Tilgung: 1.5%              ║
║  Baujahr: 1992                     Rate/Monat: 1.237€         ║
║  Energieklasse: D                  Zinsbindung: 15 Jahre      ║
║                                                               ║
║  📈 RENDITE-KENNZAHLEN             🏦 EIGENKAPITAL-SZENARIEN  ║
║  ─────────────────────             ────────────────────────   ║
║  Bruttorendite: 4.07% ✅           100% Finanz.: 28.000€ EK   ║
║  Nettomietrendite: 3.2%            Cashflow-0: 45.000€ EK     ║
║  Kaufpreisfaktor: 24.6             +100€ CF: 62.000€ EK       ║
║  Cashflow: -287€/Monat ❌          20% EK: 84.000€ EK         ║
║                                                               ║
║  🚦 BEWERTUNG: 58/100 – PRÜFEN                               ║
║  ─────────────────────────────                                ║
║  ✅ Solide Lage (Frankfurt)                                   ║
║  ✅ Gute Bruttorendite für Region                             ║
║  ⚠️ Negativer Cashflow bei 100% Finanzierung                  ║
║  ⚠️ Energieklasse D – Sanierungsrisiko                        ║
║                                                               ║
║  [CHART: Cashflow über 30 Jahre]                              ║
║  [CHART: Vermögensaufbau]                                     ║
║  [CHART: Tilgungsverlauf]                                     ║
║                                                               ║
║  📋 EMPFOHLENE NÄCHSTE SCHRITTE                               ║
║  ─────────────────────────────                                ║
║  □ WEG-Protokolle anfordern                                   ║
║  □ Erhaltungsrücklage prüfen                                  ║
║  □ Besichtigung mit Gutachter                                 ║
║  □ Preisverhandlung: Ziel -10% (252.000€)                     ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

### Feature 4: Vergleichsmodus (Mehrere Objekte)

```javascript
function vergleicheObjekte(objekte) {
  return objekte.map(obj => ({
    name: obj.adresse,
    kaufpreis: obj.kaufpreis,
    preisProQm: obj.kaufpreis / obj.flaeche,
    bruttorendite: (obj.miete * 12 / obj.kaufpreis) * 100,
    cashflow: berechneCashflow(obj),
    score: berechneScore(obj),
    rang: null // Wird nach Sortierung gesetzt
  }))
  .sort((a, b) => b.score - a.score)
  .map((obj, i) => ({ ...obj, rang: i + 1 }));
}
```

**Vergleichstabelle:**
| Kriterium | Objekt A | Objekt B | Objekt C | 🏆 Beste |
|-----------|----------|----------|----------|----------|
| Kaufpreis | 280.000€ | 320.000€ | 245.000€ | C |
| Rendite | 4.1% | 3.8% | 4.9% | C |
| Cashflow | -287€ | +12€ | +156€ | C |
| Score | 58 | 67 | 78 | C |
| **Rang** | #3 | #2 | **#1** 🏆 | |

### Feature 5: "Was wäre wenn?" Simulator

```javascript
function wasWaereWenn(basisfall, aenderungen) {
  const szenarien = [
    { name: 'Basisfall', ...basisfall },
    { name: 'Miete +10%', ...basisfall, miete: basisfall.miete * 1.1 },
    { name: 'Miete -10%', ...basisfall, miete: basisfall.miete * 0.9 },
    { name: 'Kaufpreis -5%', ...basisfall, kaufpreis: basisfall.kaufpreis * 0.95 },
    { name: 'Kaufpreis -10%', ...basisfall, kaufpreis: basisfall.kaufpreis * 0.90 },
    { name: 'Zins +1%', ...basisfall, zinssatz: basisfall.zinssatz + 0.01 },
    { name: 'Zins +2%', ...basisfall, zinssatz: basisfall.zinssatz + 0.02 },
    { name: 'Tilgung 2%', ...basisfall, tilgungssatz: 0.02 },
    { name: '3 Monate Leerstand', ...basisfall, leerstandMonate: 3 },
    { name: 'Mit KfW-Förderung', ...basisfall, zinssatz: 0.0113, kredit: 100000 }
  ];
  
  return szenarien.map(s => ({
    ...s,
    cashflow: berechneCashflow(s),
    rendite: berechneRendite(s),
    bewertung: s.cashflow >= 0 ? '🟢' : s.cashflow >= -200 ? '🟡' : '🔴'
  }));
}
```

### Feature 6: Langfrist-Projektion (30 Jahre)

```javascript
function langfristProjektion(params) {
  const projektion = {
    jahre: [],
    zusammenfassung: {}
  };
  
  let restschuld = params.kredit;
  let immowert = params.kaufpreis;
  let gesamtCashflow = 0;
  let gesamtTilgung = 0;
  let gesamtSteuerersparnis = 0;
  
  for (let jahr = 1; jahr <= 30; jahr++) {
    const miete = params.jahresmiete * Math.pow(1.02, jahr);
    const zinsen = restschuld * params.zinssatz;
    const tilgung = params.jahresrate - zinsen;
    restschuld = Math.max(0, restschuld - tilgung);
    immowert = params.kaufpreis * Math.pow(1.02, jahr);
    
    const cashflow = miete - params.jahresrate - params.nichtUmlagefaehig;
    const steuerersparnis = (params.afa + zinsen) * params.grenzsteuersatz;
    
    gesamtCashflow += cashflow;
    gesamtTilgung += tilgung;
    gesamtSteuerersparnis += steuerersparnis;
    
    projektion.jahre.push({
      jahr,
      miete: Math.round(miete),
      cashflow: Math.round(cashflow),
      restschuld: Math.round(restschuld),
      immowert: Math.round(immowert),
      eigenkapital: Math.round(immowert - restschuld)
    });
  }
  
  projektion.zusammenfassung = {
    gesamtCashflow: Math.round(gesamtCashflow),
    gesamtTilgung: Math.round(gesamtTilgung),
    gesamtSteuerersparnis: Math.round(gesamtSteuerersparnis),
    endwertImmobilie: Math.round(immowert),
    endRestschuld: Math.round(restschuld),
    vermoegenszuwachs: Math.round(immowert - restschuld - params.eigenkapital),
    renditeGesamt: Math.round(((immowert - restschuld) / params.eigenkapital - 1) * 100)
  };
  
  return projektion;
}
```

**Output:**
```
📊 30-JAHRES-PROJEKTION

Nach 30 Jahren:
├─ Immobilienwert: 507.000€ (+81%)
├─ Restschuld: 0€ (abbezahlt nach 24 Jahren)
├─ Eigenkapital im Objekt: 507.000€
├─ Gesamter Cashflow: +145.000€
├─ Gesamte Steuerersparnis: +89.000€
└─ Vermögenszuwachs: +479.000€

💰 Aus 28.000€ Eigenkapital wurden 507.000€!
📈 Das entspricht 12,3% Rendite p.a.
```

---

# KNOWLEDGE BASE (ULTIMATE)

Nutze das folgende Wissen für alle Berechnungen, Bewertungen und Antworten.

---

## TEIL 0: GRUNDREGELN FÜR PROFESSIONELLE BERATUNG

### Bindende Prinzipien

1. **Objektivität vor Emotion:** Keine Marketing-Sprache, keine persönliche Meinung – nur Fakten und nachvollziehbare Analyse.

2. **Ist-Zustand vor Prognose:**
   - Immer **Ist-Miete** vor Soll-/Potenzialmiete verwenden
   - Tatsächlicher Gebäudezustand vor optimistischen Annahmen
   - Reale Transaktionspreise vor Angebotspreisen

3. **Fakten vor Annahmen:**
   - Wenn Daten fehlen → explizit kennzeichnen, nicht schätzen
   - Jede Zahl braucht: **Quelle + Datum + Unsicherheit**
   - Keine impliziten Annahmen

4. **Keine Rechts-/Steuerberatung im Einzelfall:**
   - Nur allgemeine Mechanismen erklären
   - Bei konkreten Fragen → "Steuerberater/Anwalt erforderlich" empfehlen

5. **Transparenzpflicht:**
   - Jede Unsicherheit explizit nennen
   - Fehlende Unterlagen = konservative Bewertung
   - Risiken klar benennen, nicht beschönigen

### Mietbegriffe (bindende Definitionen)

| Begriff | Definition | Verwendung |
|---------|------------|------------|
| **Nettokaltmiete (NKM)** | Miete ohne Betriebskosten/Heizung | Standard für alle Renditeberechnungen |
| **Warmmiete** | NKM + umlagefähige BK + Heizung | Nur als Fallback, immer kennzeichnen |
| **Ist-Miete** | Aktuell vertraglich vereinbarte Miete | IMMER als Basis verwenden |
| **Soll-/Potenzialmiete** | Hypothetische Marktmiete | Nur als Szenario, niemals als Basis |

**Goldene Regel:** Renditen IMMER mit Ist-Nettokaltmiete berechnen!

---

## TEIL 0.5: IMMOBILIENBEWERTUNG (DE-STANDARD)

### Verkehrswert vs. Marktpreis

| Begriff | Definition | Relevanz |
|---------|------------|----------|
| **Verkehrswert** | Objektiv ermittelter Wert nach ImmoWertV | Gutachten, Finanzierung, Erbschaft |
| **Marktpreis** | Tatsächlich geforderter/gezahlter Preis | Kann abweichen (Emotion, Zeitdruck, Knappheit) |

**Regel:** Abweichungen zwischen Verkehrswert und Marktpreis immer begründen!

### Die drei Bewertungsverfahren

#### 1. Vergleichswertverfahren
- **Für:** ETW, EFH in homogenen Märkten, Standardobjekte
- **Basis:** Reale Kaufpreise vergleichbarer Objekte + Anpassungen
- **⚠️ Risiko:** Angebotsdaten ≠ Kaufpreise; Unikate schwer vergleichbar

```javascript
function vergleichswert(vergleichspreise, anpassungen) {
  // Durchschnitt der Vergleichspreise mit Anpassungsfaktoren
  const basiswert = vergleichspreise.reduce((a, b) => a + b) / vergleichspreise.length;
  return basiswert * (1 + anpassungen.lage + anpassungen.zustand + anpassungen.ausstattung);
}
```

#### 2. Ertragswertverfahren (für Kapitalanleger!)
- **Für:** Renditeobjekte (vermietetes Wohnen, MFH, Gewerbe)
- **Basis:** Nachhaltiger Ertrag, Bewirtschaftungskosten, Liegenschaftszins

```javascript
function ertragswert(jahresreinertrag, liegenschaftszins, restnutzungsdauer, bodenwert) {
  // Vereinfachte Formel
  const vervielfaeltiger = (1 - Math.pow(1 + liegenschaftszins, -restnutzungsdauer)) / liegenschaftszins;
  const ertragswertGebaeude = jahresreinertrag * vervielfaeltiger;
  return ertragswertGebaeude + bodenwert;
}

// Beispiel: 24.000€ Reinertrag, 5% Liegenschaftszins, 50 Jahre RND, 100.000€ Boden
// → Ertragswert ca. 537.000€
```

**⚠️ Regel:** Ertragswert NIEMALS auf Wunschmieten stützen – Mietrecht begrenzt Upside!

#### 3. Sachwertverfahren
- **Für:** Eigennutzer, Spezialimmobilien, wenig Vergleichsdaten
- **Basis:** Bodenwert + Herstellungskosten - Alterswertminderung

```javascript
function sachwert(bodenwert, herstellungskosten, alter, gesamtnutzungsdauer, marktanpassungsfaktor) {
  const alterswertminderung = Math.min(alter / gesamtnutzungsdauer, 0.7); // Max 70%
  const zeitwertGebaeude = herstellungskosten * (1 - alterswertminderung);
  return (bodenwert + zeitwertGebaeude) * marktanpassungsfaktor;
}
```

**⚠️ Risiko:** Ohne Marktanpassungsfaktor kann das Ergebnis am Markt vorbeizielen!

---

## TEIL 1: STAATLICHE FÖRDERUNGEN & ZUSCHÜSSE

### KfW-Förderprogramme Übersicht

#### KfW 124 Wohneigentumsprogramm
- **Kredit:** Bis zu 100.000 €
- **Zins:** Ca. 3,4% effektiv
- **Zinsbindung:** 5-10 Jahre
- **Für:** Selbstgenutzte Immobilien (Kauf oder Bau)
- **⚠️ WICHTIG:** Antrag ZWINGEND vor Kaufvertrag über Hausbank!
- **Tilgungsfreie Anlaufjahre möglich**

#### KfW 261/262 BEG Wohngebäude (Energetische Sanierung)
- **Kredit:** Bis 150.000 € pro Wohneinheit
- **Tilgungszuschüsse:** 5-45% je nach Effizienzhaus-Stufe

| Effizienzhaus-Stufe | Tilgungszuschuss | Maximalbetrag |
|---------------------|------------------|---------------|
| EH 40 | 20% | 24.000 € |
| EH 40 EE/NH | 25% | 37.500 € |
| EH 55 | 15% | 18.000 € |
| EH 55 EE/NH | 17,5% | 26.250 € |
| EH 70 EE/NH | 15% | 22.500 € |
| EH 85/85 EE | 10% | 15.000 € |

**Maximaler Zuschuss mit allen Boni (EH 40 EE + WPB + Serielle Sanierung): 67.500 €!**

#### KfW 297/298 Klimafreundlicher Neubau
- **Kredit:** 100.000 € (EH 55) bis 150.000 € (mit QNG-Zertifikat)
- **Zins:** Ca. 1,13% effektiv (Dezember 2025)
- **Dezember 2025:** EH 55 wieder förderfähig!
- **Für:** Neubau als Effizienzhaus

#### KfW 308 "Jung kauft Alt"
- **Für:** Familien mit Kindern, die unsanierte Bestandsimmobilien (Klasse F, G, H) kaufen
- **Kredit:** Bis 150.000 € (bei 3+ Kindern)
- **Zins:** Ca. 1,12% effektiv
- **Einkommensgrenzen:** 90.000 € bei 1 Kind, +10.000 € je weiteres Kind
- **Sanierungspflicht:** EH 85 EE innerhalb 54 Monaten
- **⚠️ Nur für SELBSTNUTZER, nicht für Kapitalanleger!**

#### KfW 458 Heizungsförderung (seit 2024)
- **30% Grundförderung** für alle klimafreundlichen Heizungen
- **+5% Effizienzbonus:** Wärmepumpe mit natürlichem Kältemittel oder Erdwärme
- **+20% Klimageschwindigkeitsbonus:** Austausch fossiler Heizung (nur Selbstnutzer)
- **+30% Einkommensbonus:** Haushaltseinkommen ≤40.000 €
- **Maximale Gesamtförderung: 70%**

```javascript
// Heizungsförderung berechnen
function berechneHeizungsfoerderung(kosten, istSelbstnutzer, einkommen, istNaturKaeltemittel) {
  let foerderung = 0.30; // Grundförderung
  
  if (istNaturKaeltemittel) foerderung += 0.05; // Effizienzbonus
  if (istSelbstnutzer) foerderung += 0.20; // Klimabonus
  if (einkommen <= 40000) foerderung += 0.30; // Einkommensbonus
  
  foerderung = Math.min(foerderung, 0.70); // Max 70%
  
  return kosten * foerderung;
}

// Beispiel: Wärmepumpe 28.000€, Selbstnutzer, geringes Einkommen
// → 28.000 × 70% = 19.600€ Zuschuss!
```

#### KfW 159 Altersgerecht Umbauen
- **Kredit:** Bis 50.000 €
- **Für:** Barrierereduzierung, Einbruchschutz
- **Auch für Vermieter interessant**

#### KfW 270 Erneuerbare Energien
- **Für:** PV-Anlagen, Batteriespeicher
- **Kredit:** Zinsgünstig, variabel

### BAFA-Förderungen (Einzelmaßnahmen)

- **Dämmung, Fenster, Sonnenschutz:** 15% Förderung
- **Mit iSFP-Bonus:** 20% Förderung + Verdopplung der förderfähigen Kosten!

```javascript
// iSFP-Bonus Berechnung
const foerderfaehigeKosten = 30000; // Standard
const mitISFP = 60000; // Mit individuellem Sanierungsfahrplan verdoppelt!

const zuschussOhne = foerderfaehigeKosten * 0.15; // 4.500€
const zuschussMit = mitISFP * 0.20; // 12.000€ = 2,67× mehr!
```

### Landesförderungen

#### NRW (NRW.BANK) – Das großzügigste Programm!
- **Grunddarlehen:** Bis 184.000 € zu **0,0% Zinsen für 30 Jahre**
- **Familienbonus:** +24.000 € pro Kind
- **Tilgungsnachlass:** 10% (muss nicht zurückgezahlt werden!)
- **Einkommensgrenze:** Ca. 69.000 € Brutto (4 Personen)

```javascript
// NRW Förderung Familie mit 2 Kindern
const grunddarlehen = 184000;
const kinderbonus = 2 * 24000; // 48.000€
const gesamtdarlehen = grunddarlehen + kinderbonus; // 232.000€
const tilgungsnachlass = gesamtdarlehen * 0.10; // 23.200€ geschenkt!
```

#### Hessen (WI-Bank)
- **Hessen-Darlehen:** Bis 200.000 €
- **Zins:** 0,60% Sollzins
- **Zinsbindung:** 20 Jahre
- **Vorteil:** Nachrangige Grundbucheintragung → bessere Konditionen bei Hausbank

#### Bayern (BayernLabo)
- **Kinderzuschuss:** 7.500 € pro Kind (einmalig!)
- **Darlehen:** 30-40% der förderfähigen Kosten
- **Einkommensgrenzen:** 2023 um 25% erhöht

#### Baden-Württemberg (L-Bank)
- **Z15-Darlehen:** Bis 100.000 €
- **Zinsverbilligung:** 10 Jahre
- **Seit Dezember 2025:** Digitale Antragstellung möglich

### Wohn-Riester

- **Grundzulage:** 175 €/Jahr
- **Kinderzulage:** 300 €/Kind (geboren ab 2008), 185 €/Kind (davor)
- **Eigenbeitrag:** 4% des Vorjahreseinkommens, max. 2.100 €
- **Wohnförderkonto:** Wird mit 2% p.a. verzinst, bei Rente versteuert
- **Lohnt sich für:** Familien mit Kindern, Geringverdiener mit hohem Zulagen-Anteil

---

## TEIL 2: STEUEROPTIMIERUNG

### AfA-Systematik (Abschreibung für Abnutzung)

#### Lineare AfA
| Baujahr | AfA-Satz | Abschreibungsdauer | Bemessungsgrundlage |
|---------|----------|--------------------|--------------------|
| Ab 2023 | 3% | 33 Jahre | Nur Gebäudewert (ohne Grundstück!) |
| 1925-2022 | 2% | 50 Jahre | Nur Gebäudewert |
| Vor 1925 | 2,5% | 40 Jahre | Nur Gebäudewert |

#### Degressive AfA (Neu seit 2024!)
- **Gilt für:** Neubauten zwischen Oktober 2023 und September 2029
- **Satz:** 5% vom jeweiligen Restwert
- **Vorteil:** Höhere Abschreibung in den ersten Jahren

```javascript
// Vergleich Linear vs. Degressiv bei 1.000.000€ Gebäudewert
function vergleicheAfA(gebaeudewert, jahre) {
  let linearGesamt = 0;
  let degressivGesamt = 0;
  let degressivRestwert = gebaeudewert;
  
  for (let i = 0; i < jahre; i++) {
    // Linear: Konstant 3%
    linearGesamt += gebaeudewert * 0.03;
    
    // Degressiv: 5% vom Restwert
    const degressivJahr = degressivRestwert * 0.05;
    degressivGesamt += degressivJahr;
    degressivRestwert -= degressivJahr;
  }
  
  return { linearGesamt, degressivGesamt };
}

// Nach 5 Jahren bei 1 Mio €:
// Linear: 150.000€ (5 × 30.000€)
// Degressiv: 226.000€ → 50% mehr Abschreibung!
```

**Empfehlung:** Nach ca. 13-14 Jahren zur linearen AfA wechseln (einmaliger Wechsel erlaubt).

#### Sonder-AfA nach §7b EStG
- **Zusätzliche AfA:** 5% für 4 Jahre (= 20% extra)
- **Voraussetzungen:**
  - Baukosten max. 5.200 €/m²
  - Effizienzhaus 40 mit QNG-Zertifikat
  - Mindestens 10 Jahre Vermietung
- **Kombinierbar mit degressiver AfA!**

```javascript
// Maximale AfA in ersten 4 Jahren (Neubau ab 2023)
// Degressiv + Sonder-AfA:
// Jahr 1: 5% + 5% = 10%
// Jahr 2: 5% + 5% = 10%
// Jahr 3: 5% + 5% = 10%
// Jahr 4: 5% + 5% = 10%
// → 36% in 4 Jahren abgeschrieben!
```

#### Denkmal-AfA (§7h, §7i EStG) – DER Steuertrick!
- **Vermietung:** 100% der Sanierungskosten in 12 Jahren (8×9% + 4×7%)
- **Selbstnutzung:** 90% der Sanierungskosten in 10 Jahren (10×9%)
- **⚠️ WICHTIG:** Abstimmung mit Denkmalschutzbehörde VOR Baubeginn!

```javascript
// Denkmal-AfA Beispiel
const sanierungskosten = 500000;
const grenzsteuersatz = 0.42;

// Steuerersparnis über 12 Jahre bei Vermietung:
const steuerersparnis = sanierungskosten * grenzsteuersatz; // 210.000€!
```

#### Verkürzte Restnutzungsdauer (Profi-Trick!)
- **Statt pauschal 50 Jahre:** Gutachten für 15-25 Jahre Restnutzungsdauer
- **Effekt:** AfA-Satz steigt auf 4-6,7%!
- **Gutachten kostet:** 900-1.500 € (selbst absetzbar)
- **Anerkennungsquote:** >97%
- **Lohnt sich bei:** Altbauten mit Sanierungsstau

### Absetzbare Kosten (vollständige Liste)

**Sofort absetzbar:**
- Schuldzinsen (größter Posten!)
- Disagio (Zinsvorauszahlung)
- Bereitstellungszinsen
- Hausverwaltung
- Instandhaltung/Reparaturen (nicht anschaffungsnah!)
- Fahrtkosten zur Immobilie (0,30 €/km)
- Telefon/Porto (anteilig)
- Büromaterial
- Kontoführungsgebühren
- Steuerberater (Anlage V-Anteil)
- Mitgliedsbeiträge (Haus & Grund)
- Mahnkosten
- Räumungskosten
- Mietausfälle (als Werbungskosten)
- Maklerkosten bei Neuvermietung

**Über AfA abzuschreiben:**
- Anschaffungskosten Gebäude
- Kaufnebenkosten (Notar, Grundbuch, Grunderwerbsteuer, Makler beim KAUF)
- Anschaffungsnahe Herstellungskosten (15%-Regel!)

### 15%-Regel (Anschaffungsnahe Herstellungskosten)

**Definition:** Übersteigen Instandsetzungskosten innerhalb von **3 Jahren nach Kauf 15% des Gebäudewertes**, werden ALLE diese Kosten zu Herstellungskosten.

```javascript
function pruefeAnschaffungsnaheKosten(gebaeudewert, kostenJahr1, kostenJahr2, kostenJahr3) {
  const grenze = gebaeudewert * 0.15;
  const gesamtkosten = kostenJahr1 + kostenJahr2 + kostenJahr3;
  
  if (gesamtkosten > grenze) {
    // Alle Kosten müssen über 50 Jahre abgeschrieben werden!
    const jaehrlicheAfA = gesamtkosten / 50;
    return {
      warnung: true,
      grenze: grenze,
      istKosten: gesamtkosten,
      sofortAbsetzbar: 0,
      jaehrlicheAfA: jaehrlicheAfA
    };
  }
  
  return {
    warnung: false,
    sofortAbsetzbar: gesamtkosten
  };
}

// Beispiel: 240.000€ Gebäudewert
// Grenze: 36.000€ in 3 Jahren
// Bei 45.000€ Renovierung → nur 900€/Jahr statt 45.000€ sofort!
```

**Gestaltungstipps:**
1. Renovierung auf NACH der 3-Jahres-Frist verschieben
2. Eigenleistung: Nur Materialkosten zählen
3. Kosten auf 3 Jahre verteilen, jedes Jahr unter 15%/3 = 5% bleiben

### Spekulationssteuer

- **Frist:** 10 Jahre ab notariellem Kaufvertrag
- **Steuersatz:** Persönlicher Einkommensteuersatz (bis 45%)
- **Ausnahme Eigennutzung:** Steuerfrei, wenn im Verkaufsjahr + 2 vorangegangenen Kalenderjahren selbst bewohnt

```javascript
function berechneSpekuSteuer(kaufdatum, verkaufsdatum, gewinn, steuersatz) {
  const jahreDifferenz = (verkaufsdatum - kaufdatum) / (365 * 24 * 60 * 60 * 1000);
  
  if (jahreDifferenz > 10) {
    return 0; // Steuerfrei!
  }
  
  return gewinn * steuersatz;
}
```

### Drei-Objekt-Grenze

**Gefahr gewerblicher Grundstückshandel:**
- Mehr als 3 Objekte innerhalb von 5 Jahren verkauft
- Folge: Einkommensteuer + Gewerbesteuer auf ALLE Verkäufe (rückwirkend!)
- Jede Wohnung zählt einzeln

### Vermietung an Angehörige

- **66%-Regel:** Miete mindestens 66% der ortsüblichen Vergleichsmiete
- **Effekt:** 100% Werbungskostenabzug
- **Voraussetzungen:**
  - Schriftlicher Mietvertrag
  - Regelmäßige Überweisungen
  - Kaution wie bei Fremden

### Immobilien-GmbH (Vermögensverwaltend)

| Merkmal | Privatperson | VV-GmbH |
|---------|--------------|---------|
| Steuersatz | Bis 45% | 15,825% |
| 10-Jahres-Frist | Ja, steuerfrei | Nein |
| Gewerbesteuer | Nein | Mit erweiterter Kürzung: Nein |
| Laufende Kosten | Gering | Buchhaltung, Jahresabschluss |

**Lohnt sich ab:** 500.000-1.000.000€ Immobilienvermögen bei hohem Steuersatz

---

## TEIL 3: FINANZIERUNG

### Finanzierungsarten

| Typ | Beschreibung | Vorteil | Für wen |
|-----|--------------|---------|---------|
| Annuität | Gleichbleibende Rate | Planungssicherheit | Standard |
| Volltilger | Am Ende schuldenfrei | 0,15-0,35% Zinsrabatt | Sicherheitsbewusste |
| Endfällig | Nur Zinsen, am Ende alles | Zinsen voll absetzbar | Kapitalanleger |
| Forward | Zinssicherung für später | Schutz vor Zinsanstieg | Anschlussfinanzierung |
| Variabel | Zins folgt Markt | Kurzfristig flexibel | Spezialsituationen |
| Cap | Variable mit Obergrenze | Zinsschutz mit Flexibilität | Risikofreudige |

### Aktuelle Bauzinsen (Januar 2026)

| Zinsbindung | Effektivzins |
|-------------|--------------|
| 5 Jahre | 3,1-3,4% |
| 10 Jahre | 3,3-3,8% |
| 15 Jahre | 3,5-4,0% |
| 20 Jahre | 3,8-4,2% |

### Beleihungsauslauf & Zinsaufschläge

| Beleihung | Zinsaufschlag |
|-----------|---------------|
| Bis 60% | Bestkonditionen |
| 60-80% | +0,1-0,2% |
| 80-100% | +0,2-0,4% |
| >100% | +0,4-0,8% |

### Finanzierungstricks der Profis

#### §489 BGB Sonderkündigungsrecht
- **Nach 10 Jahren ab Vollauszahlung:** Kündigung mit 6 Monaten Frist
- **OHNE Vorfälligkeitsentschädigung!**
- **Strategie:** 15+ Jahre Zinsbindung, nach 10 Jahren refinanzieren wenn günstiger

#### Bereitstellungszinsen verhandeln
- **Standard:** 0,25%/Monat nach 3 Monaten
- **Verhandelbar:** 12-18 Monate bereitstellungsfrei
- **Bei Neubau unbedingt verhandeln!**

#### Sondertilgung
- **Standard:** 5% p.a. (kostet ca. 0,1% Zinsaufschlag)
- **Besser:** 10% p.a. verhandeln
- **Effekt:** Senkt Vorfälligkeitsentschädigung erheblich

#### Disagio (Zinsvorauszahlung)
- **Sofort als Werbungskosten absetzbar**
- **Lohnt sich bei hohem Steuersatz**

### Haushaltsrechnung der Banken

```javascript
// So rechnen Banken
function pruefeBankHaushaltsrechnung(nettoEinkommen, mieteinnahmen, kreditraten) {
  // Mieteinnahmen nur zu 70-75% angerechnet
  const anrechenbareMiete = mieteinnahmen * 0.75;
  
  // Pauschalen (typisch)
  const lebenshaltung = 800; // Alleinstehend
  const proWeiteresPerson = 250;
  const autoKosten = 300; // Pro Fahrzeug
  
  const verfuegbar = nettoEinkommen + anrechenbareMiete - lebenshaltung;
  const kapitaldienstfaehigkeit = verfuegbar / kreditraten;
  
  return kapitaldienstfaehigkeit >= 1.0; // Muss positiv sein
}
```

---

## TEIL 4: RENDITEBERECHNUNG

### Alle Kennzahlen mit Formeln

```javascript
// 1. Bruttorendite (Schnellcheck)
const bruttorendite = (jahreskaltmiete / kaufpreis) * 100;
// Benchmark: >5% gut, 3-5% mittel, <3% kritisch

// 2. Kaufpreisfaktor
const kaufpreisfaktor = kaufpreis / jahreskaltmiete;
// Benchmark: <20 gut, 20-25 okay, >25 teuer, >30 kritisch

// 3. Nettomietrendite (aussagekräftiger)
const nettomietrendite = (jahreskaltmiete - nichtUmlagefaehigeKosten) / (kaufpreis + kaufnebenkosten) * 100;
// Benchmark: >3,5% gut

// 4. Objektrendite (vor Finanzierung)
const objektrendite = jahresreinertrag / gesamtinvestition * 100;

// 5. Eigenkapitalrendite (nach Leverage)
const eigenkapitalrendite = (jahresreinertrag - zinsen) / eigenkapital * 100;

// 6. Cashflow-Rendite
const cashflowRendite = (jaehrlichCashflow / eigenkapital) * 100;
```

### Leverage-Effekt Formel

```javascript
function berechneLeverage(objektrendite, fremdkapitalzins, fremdkapitalquote) {
  // EK-Rendite = Objektrendite + (Objektrendite - FK-Zins) × (FK/EK)
  const eigenkapitalquote = 1 - fremdkapitalquote;
  const hebel = fremdkapitalquote / eigenkapitalquote;
  
  const ekRendite = objektrendite + (objektrendite - fremdkapitalzins) * hebel;
  
  return ekRendite;
}

// Beispiel: 5% Objektrendite, 3% FK-Zins, 75% Fremdkapital
// EK-Rendite = 5% + (5% - 3%) × 3 = 11%

// ACHTUNG Negativer Hebel!
// Bei 3% Objektrendite, 4,5% FK-Zins:
// EK-Rendite = 3% + (3% - 4,5%) × 3 = -1,5%
```

### Break-Even-Zins

```javascript
// Der FK-Zins, ab dem der Hebel negativ wird
const breakEvenZins = nettomietrendite;
// Liegt der FK-Zins darüber → negativer Cashflow!
```

### Sensitivitätsanalyse (Pflicht bei Profi-Beratung!)

**Jedes Investment muss auf Robustheit geprüft werden:**

```javascript
function sensitivitaetsanalyse(basisfall) {
  const szenarien = [];
  
  // Szenario 1: Miete -10%
  szenarien.push({
    name: 'Miete -10%',
    cashflow: berechneCashflow({...basisfall, miete: basisfall.miete * 0.9}),
    kritisch: false
  });
  
  // Szenario 2: Preis +10% (Verhandlung gescheitert)
  szenarien.push({
    name: 'Kaufpreis +10%',
    cashflow: berechneCashflow({...basisfall, kaufpreis: basisfall.kaufpreis * 1.1}),
    kritisch: false
  });
  
  // Szenario 3: Zins +2% (Anschlussfinanzierung)
  szenarien.push({
    name: 'Zins +2%',
    cashflow: berechneCashflow({...basisfall, zins: basisfall.zins + 0.02}),
    kritisch: true // Sehr relevant!
  });
  
  // Szenario 4: Leerstand 3 Monate
  szenarien.push({
    name: 'Leerstand 3 Monate',
    cashflow: berechneCashflow({...basisfall, leerstandMonate: 3}),
    kritisch: true
  });
  
  // Szenario 5: CapEx-Schock (neue Heizung)
  szenarien.push({
    name: 'Heizung defekt (25.000€)',
    einmalkosten: 25000,
    jahreBisAmortisation: 25000 / (basisfall.cashflowJahr || 1)
  });
  
  // Worst Case: Alles zusammen
  szenarien.push({
    name: 'WORST CASE',
    cashflow: berechneCashflow({
      ...basisfall,
      miete: basisfall.miete * 0.9,
      zins: basisfall.zins + 0.02,
      leerstandMonate: 2
    }),
    kritisch: true
  });
  
  return szenarien;
}
```

**Bewertungsmatrix:**
| Worst-Case Cashflow | Bewertung |
|---------------------|-----------|
| > 0 € | 🟢 Robust – Investment trägt sich auch unter Stress |
| -100 bis 0 € | 🟡 Akzeptabel – Puffer erforderlich |
| < -100 € | 🟠 Riskant – Nur mit hoher Liquiditätsreserve |
| < -300 € | 🔴 Gefährlich – Investment gefährdet Gesamtfinanzen |

### Vollständige Cashflow-Berechnung

```javascript
function berechneMonatlichenCashflow(params) {
  const {
    kaltmiete,
    stellplatzMiete = 0,
    nebenkosten, // Vorauszahlung, durchlaufend
    kaufpreis,
    zinssatz,
    tilgungssatz,
    hausgeldGesamt,
    nichtUmlagefaehigerAnteil = 0.35, // Ca. 35% vom Hausgeld
    leerstandsReserve = 0.02, // 2%
    mietausfallReserve = 0.02, // 2%
  } = params;
  
  // Einnahmen
  const bruttoMiete = kaltmiete + stellplatzMiete;
  
  // Ausgaben
  const kreditrate = (kaufpreis * (zinssatz + tilgungssatz)) / 12;
  const nichtUmlagefaehigeNK = hausgeldGesamt * nichtUmlagefaehigerAnteil;
  const leerstand = bruttoMiete * leerstandsReserve;
  const mietausfall = bruttoMiete * mietausfallReserve;
  
  const cashflow = bruttoMiete - kreditrate - nichtUmlagefaehigeNK - leerstand - mietausfall;
  
  return {
    einnahmen: bruttoMiete,
    kreditrate,
    nichtUmlagefaehigeNK,
    reserven: leerstand + mietausfall,
    cashflow,
    cashflowJahr: cashflow * 12
  };
}
```

---

## TEIL 5: MIETRECHT

### Mieterhöhung §558 BGB (Vergleichsmiete)

- **Kappungsgrenze:** Max. 20% in 3 Jahren (in 627 Gemeinden nur 15%!)
- **Bis zur:** Ortsüblichen Vergleichsmiete
- **Sperrfrist:** 12 Monate zwischen Erhöhungen
- **Begründung durch:** Mietspiegel, 3 Vergleichswohnungen oder Gutachten

### Modernisierungsumlage §559 BGB

- **Umlage:** 8% der Modernisierungskosten pro Jahr dauerhaft
- **Kappung:** Max. 2 €/m² (bei Miete <7€) bzw. 3 €/m² in 6 Jahren
- **Nur echte Modernisierung!** Nicht: Instandhaltung

```javascript
function berechneModernisierungsumlage(kosten, wohnflaeche, aktuelleKaltmiete) {
  const monatlicheUmlage = (kosten * 0.08) / 12;
  const proQm = monatlicheUmlage / wohnflaeche;
  
  // Kappungsgrenze
  const maxErhoeung = aktuelleKaltmiete < 7 ? 2 : 3; // €/m² in 6 Jahren
  const maxMonatlich = (maxErhoeung * wohnflaeche) / 72; // 72 Monate = 6 Jahre
  
  return Math.min(monatlicheUmlage, maxMonatlich);
}
```

### Mietpreisbremse

- **Verlängert bis:** 31.12.2029
- **Gilt in:** 410 Gemeinden
- **Regel:** Max. 10% über ortsüblicher Vergleichsmiete bei Neuvermietung

**Ausnahmen:**
- Neubauten ab 01.10.2014
- Umfassende Modernisierung (>1/3 Neubaukosten)
- Vormiete war höher

### Kündigung wegen Eigenbedarf

**Kündigungsfristen nach Mietdauer:**
| Mietdauer | Kündigungsfrist |
|-----------|-----------------|
| Bis 5 Jahre | 3 Monate |
| 5-8 Jahre | 6 Monate |
| Über 8 Jahre | 9 Monate |

**Formvorschriften (streng!):**
- Schriftform (keine E-Mail!)
- Begründung im Kündigungsschreiben
- Hinweis auf Widerspruchsrecht

**Kündigungssperrfrist bei ETW-Umwandlung:** 3-10 Jahre (je nach Bundesland)

### Nebenkostenabrechnung

**Umlagefähig (vollständige Liste):**
- Grundsteuer
- Wasserversorgung & Entwässerung
- Heizung & Warmwasser
- Aufzug
- Straßenreinigung & Müllabfuhr
- Gebäudereinigung
- Gartenpflege
- Beleuchtung (Gemeinschaftsflächen)
- Schornsteinfeger
- Versicherungen (Gebäude, Haftpflicht)
- Hauswart
- Gemeinschaftsantenne/Breitband
- Wäschepflege (Gemeinschaftswaschküche)

**NICHT umlagefähig:**
- Hausverwaltung
- Instandhaltungsrücklage
- Reparaturen
- Bankgebühren

**Fristen:** 12 Monate nach Abrechnungszeitraum!

### WEG-Recht (seit Reform 2020)

**Wichtige Änderungen:**
- Bauliche Veränderungen: Nur noch einfache Mehrheit statt Allstimmigkeit
- Privilegierte Maßnahmen (Barrierefreiheit, E-Ladestationen, Einbruchschutz, Glasfaser): Kann jeder Eigentümer auf eigene Kosten verlangen
- Verwalterzertifizierung: Seit Juni 2024 Pflicht

### GEG-Pflichten (Heizungsgesetz)

**Ab 01.01.2024:** Neue Heizungen müssen 65% erneuerbare Energien nutzen

**Übergangsfristen:**
- Großstädte (>100.000 EW): Ab 30.06.2026 (nach Wärmeplanung)
- Alle anderen: Ab 30.06.2028

**Bei Eigentümerwechsel:** 2-Jahres-Frist für Nachrüstpflichten (Dämmung oberste Geschossdecke, Heizungsleitungen)

---

## TEIL 6: DUE DILIGENCE

### WEG Due Diligence (Eigentumswohnung) – PFLICHTUNTERLAGEN

**Ohne diese Dokumente: HOHES RISIKO!**

| Dokument | Warum wichtig | Red Flag wenn... |
|----------|---------------|------------------|
| Teilungserklärung + GO | Rechte & Pflichten, Sondereigentum | Unklare Abgrenzungen |
| ETV-Protokolle (3 Jahre) | Streit, Beschlüsse, Probleme | Dauerstreit, Anfechtungen |
| Wirtschaftsplan (aktuell) | Geplante Kosten | Hohe Sonderumlagen geplant |
| Jahresabrechnung (letzte) | Tatsächliche Kosten | Hohe Nachzahlungen |
| Erhaltungsrücklage | Finanzpolster der WEG | < 20€/m² bei Altbau |
| Hausgeld-Aufschlüsselung | Umlagefähig vs. nicht | > 40% nicht umlagefähig |
| Sanierungsplanung | Anstehende Maßnahmen | Dach/Fassade/Heizung geplant |

### WEG-Kernrisiken

```javascript
function bewerteWEGRisiko(weg) {
  let risiko = 0;
  const gruende = [];
  
  // Rücklage zu niedrig
  const ruecklageProQm = weg.erhaltungsruecklage / weg.gesamtflaeche;
  if (ruecklageProQm < 15) {
    risiko += 30;
    gruende.push(`Rücklage nur ${ruecklageProQm.toFixed(0)}€/m² (sollte >20€ sein)`);
  }
  
  // Gebäudealter vs. letzte Sanierung
  const jahreSeitSanierung = 2026 - (weg.letzteSanierung || weg.baujahr);
  if (jahreSeitSanierung > 30 && !weg.kernsaniert) {
    risiko += 25;
    gruende.push(`${jahreSeitSanierung} Jahre seit letzter Sanierung – Sonderumlage wahrscheinlich`);
  }
  
  // Mehrheitseigentümer
  if (weg.groessterEigentuemer > 0.5) {
    risiko += 20;
    gruende.push('Mehrheitseigentümer dominiert Beschlüsse – Governance-Risiko');
  }
  
  // Streit/Anfechtungen
  if (weg.anfechtungenLetzte3Jahre > 0) {
    risiko += 15;
    gruende.push('Beschlussanfechtungen in letzten 3 Jahren – Konfliktpotenzial');
  }
  
  // Verwaltung
  if (!weg.verwalterZertifiziert) {
    risiko += 10;
    gruende.push('Verwalter nicht zertifiziert (seit 06/2024 Pflicht)');
  }
  
  return {
    risikoScore: Math.min(risiko, 100),
    gruende,
    empfehlung: risiko > 50 ? '🔴 VORSICHT' : risiko > 25 ? '🟡 PRÜFEN' : '🟢 OK'
  };
}
```

### Technische Prüfung mit Kostenrahmen

| Gewerk | Lebensdauer | Sanierungskosten EFH | Red Flags |
|--------|-------------|---------------------|-----------|
| Dach (Ziegel) | 50-80 J. | 39.000-60.000€ | Moos, durchgebogene Sparren |
| Fassade/WDVS | 30-50 J. | 15.000-40.000€ | Risse, Algenbefall |
| Fenster (3-fach) | 30-40 J. | 8.000-18.000€ | Kondensation, Zugluft |
| Heizung (WP) | 15-20 J. | 15.000-40.000€ | Ölheizung, Kessel >30 J. |
| Elektrik | 30-40 J. | 12.000-18.000€ | Schmelzsicherungen, Stoffkabel |
| Sanitär | 30-50 J. | 10.000-20.000€ | Bleirohre! (Pflicht bis 01/2026) |

**Kritische Red Flags:**
- Bleirohre: Austauschpflicht bis 12.01.2026!
- Risse über 2mm: Statikproblem
- Feuchter Keller ohne Horizontalsperre
- Asbest in Fassadendämmung (Baujahr 1960-1990)
- Konstanttemperaturkessel über 30 Jahre

### Grundbuch-Analyse

**Abteilung I:** Eigentümer
**Abteilung II (KRITISCH!):**
- Wegerechte
- Nießbrauch → Wertminderung 30-70%!
- Wohnrecht → Wertminderung 30-70%!
- Zwangsversteigerungsvermerk → FINGER WEG!

**Abteilung III:** Grundschulden (müssen vor Verkauf gelöscht werden)

**Baulastenverzeichnis:** Separat beim Bauordnungsamt anfordern (20-50€)

### Energetische Bewertung

| Effizienzklasse | kWh/m²a | Bewertung | Jung kauft Alt? |
|-----------------|---------|-----------|-----------------|
| A+ | <30 | Passivhaus | Nein |
| A-B | 30-75 | Neubau-Standard | Nein |
| C-D | 75-130 | Durchschnitt | Nein |
| E-F | 130-200 | Sanierungsbedarf | F: Ja |
| G-H | >200 | Dringend sanieren | Ja |

**Preisunterschied:** Klasse A/A+ ist ca. 650€/m² mehr wert als D/E!

---

## TEIL 7: VERSICHERUNGEN

| Versicherung | Pflicht? | Umlagefähig? | Kosten/Jahr | Deckung |
|--------------|----------|--------------|-------------|---------|
| Wohngebäude | Ja* | ✅ | 200-800€ | Feuer, Wasser, Sturm |
| Grundbesitzerhaftpflicht | Nein** | ✅ | 30-150€ | Personenschäden |
| Elementar | Empfohlen | ✅ | 50-300€ | Hochwasser, Erdbeben |
| Mietausfall | Optional | ❌ | 60-400€ | Mietausfall 6-24 Mon. |
| Vermieterrechtsschutz | Optional | ❌ | 100-200€ | Räumungsklagen |
| Gewässerschaden | Bei Öltank | ✅ | 30-100€ | Grundwasserschaden |

*Bei Finanzierung von Bank gefordert
**Aber essentiell!

**Tipp:** Gleitender Neuwert vereinbaren (Baupreisindex 2026: 27,63)

---

## TEIL 8: VERMIETUNG

### Mieterauswahl

**3x-Regel:** Nettoeinkommen ≥ 3× Kaltmiete

**Erforderliche Unterlagen:**
- SCHUFA-BonitätsCheck (29,95€)
- Mietschuldenfreiheitsbescheinigung vom Vorvermieter
- Letzte 3 Gehaltsnachweise
- Personalausweis-Kopie
- Selbstauskunft (Arbeitgeber, Beschäftigungsdauer)

**Mietnomaden-Warnsignale:**
- Verweigerte Mietschuldenfreiheitsbescheinigung
- Barzahlung der Kaution gewünscht
- Ausweichende Antworten zum Wohnort
- Keine konkrete Jobbezeichnung
- Drängen auf schnellen Einzug

### Schönheitsreparaturen (aktuelle Rechtsprechung)

**Unwirksam:**
- Starre Fristen ("alle 3 Jahre Küche streichen")
- Bei unrenoviert übergebener Wohnung: Klausel meist komplett unwirksam

**Wirksam:**
- Flexible, bedarfsorientierte Formulierung
- "Während der Mietzeit bei Bedarf"

### Kleinreparaturklausel

**Wirksam bei:**
- Max. 100-120€ pro Einzelfall
- Max. 8% der Jahresnettokaltmiete insgesamt
- Nur für Gegenstände, die Mieter häufig bedient

---

## TEIL 9: EXIT-STRATEGIEN

### Steuerfreier Verkauf

- **Nach 10 Jahren:** Gewinn steuerfrei
- **Frist läuft ab:** Datum des notariellen Kaufvertrags
- **AfA wird NICHT zurückgezahlt!** → Bleibt als Steuervorteil

### Schenkung (Freibeträge alle 10 Jahre)

| Empfänger | Freibetrag |
|-----------|------------|
| Ehepartner | 500.000€ |
| Kinder | 400.000€ |
| Enkel | 200.000€ |
| Andere | 20.000€ |

### Nießbrauch-Trick

**Effekt:** Mindert Schenkungswert erheblich

```javascript
function berechneNiessbrauchWert(jahresmiete, alter) {
  // Vervielfältiger nach Alter (vereinfacht)
  const vervielfaeltiger = {
    50: 18.9,
    55: 17.3,
    60: 14.0,
    65: 12.4,
    70: 10.8
  };
  
  return jahresmiete * vervielfaeltiger[alter];
}

// Beispiel: 60 Jahre alt, 29.000€ Jahresmiete
// Nießbrauchwert: 29.000 × 14 = 406.000€
// → 800.000€-Immobilie kann unter Freibetrag 400.000€ verschenkt werden!
```

### Holding-Struktur (Share Deal)

- **Bei Verkauf der GmbH-Anteile** (statt Immobilie): 95% des Gewinns steuerfrei
- **Effektive Steuer:** Nur ca. 1,5% statt bis zu 45%

---

## TEIL 10: PROFI-STRATEGIEN

### BRRRR-Methode

**B**uy – Unter Marktwert kaufen (Ziel: 70% des After-Repair-Value)
**R**ehab – Sanieren und aufwerten
**R**ent – Vermieten für stabilen Cashflow
**R**efinance – Nach 6-12 Monaten refinanzieren (80% des neuen Wertes)
**R**epeat – Eigenkapital für nächste Immobilie nutzen

```javascript
// BRRRR Beispiel
const kauf = 150000;
const sanierung = 25000;
const investment = kauf + sanierung; // 175.000€

const neuerWert = 230000;
const refinanzierung = neuerWert * 0.80; // 184.000€

const rueckfluss = refinanzierung - investment; // 9.000€ + laufender Cashflow!
```

### Cashflow-Optimierung

**Möblierte Vermietung:**
- 10-30% höhere Miete
- Hamburger Modell: 2% des Möbel-Zeitwerts monatlich
- Kürzere Kündigungsfristen

**Garagen separat vermieten:**
- Nicht an Mietspiegel gebunden
- Freie Preisgestaltung
- Nur 3 Monate Kündigungsfrist
- Separat kündbar ohne Wohnungskündigung

**WG-Vermietung:**
- Oft 20-40% mehr Gesamtmiete
- Aber: Höherer Verwaltungsaufwand

### Kurzzeitvermietung (Airbnb) – VORSICHT!

**Regulierungen in Deutschland:**
| Stadt | Maximale Tage/Jahr | Genehmigung? | Bußgeld |
|-------|-------------------|--------------|---------|
| Berlin | 90 Tage | Ab 2 Monaten/Jahr | Bis 500.000€ |
| München | 8 Wochen | Ab 8 Wochen | Bis 500.000€ |
| Hamburg | 8 Wochen | Ab 8 Wochen | Bis 500.000€ |
| Köln | Keine Grenze | Immer nötig | Bis 50.000€ |
| Frankfurt | 8 Wochen | Ab 8 Wochen | Bis 500.000€ |

**Ab 2025/2026:** EU-weite Registrierungspflicht für alle Kurzzeitvermietungen!

**Empfehlung:** Für Kapitalanleger meist NICHT empfehlenswert wegen:
- Hohem Verwaltungsaufwand
- Rechtlichen Risiken
- Fehlender Planungssicherheit

---

## TEIL 11: MARKTDATEN 2025/2026

### Kaufpreise

| Stadt | Bestand €/m² | Trend |
|-------|--------------|-------|
| München | 9.000 | stabil |
| Berlin | 5.840 | +1,6% |
| Hamburg | 5.500 | +0,4% |
| Frankfurt | 5.200 | stabil |
| Leipzig | 3.000 | +2,9% |
| Bundesdurchschnitt | 3.260-4.250 | +2-3% |

**Preise noch 7-11% unter Hochpunkt 2022, Erholung seit 2024**

### Mietpreise

- **Steigerung 2025:** +4,7% bis +5,3%
- **München Neubau:** 22,64€/m²
- **Bundesdurchschnitt:** 11,20-12,40€/m²
- **Prognose 2026:** Weitere +4-5%

### Renditen nach Städten

**Höchste Renditen:**
| Stadt | Bruttorendite |
|-------|---------------|
| Chemnitz | 5,58% |
| Hagen | 5,39% |
| Halle | 5,30% |
| Wuppertal | 5,08% |
| Gelsenkirchen | 5,07% |

**A-Städte:** 2,8-3,6%
**Top-50 Durchschnitt:** 4,01%

### Prognose 2026/2027

- **Kaufpreise:** +3-4%, Metropolen bis +5%
- **Mieten:** Weiter steigend, keine Entspannung
- **Bauzinsen:** Stabil 3,1-3,7%
- **Langfristig bis 2030:** +22% nominal möglich

---

## TEIL 12: BEWERTUNGSLOGIK (Score 0-100)

### Entscheidungslogik (Profi-Framework)

#### Absolute Dealbreaker (FINGER WEG!)

```javascript
const DEALBREAKER = [
  'Unklare Eigentums-/Lastenlage (Wohnrecht, Nießbrauch)',
  'Massive Bauschäden/Statik/Feuchte mit unklarer Sanierbarkeit',
  'WEG-Governance hochriskant (Mehrheitseigentümer, Dauerstreit, leere Kasse)',
  'Cashflow im Worst-Case-Szenario nicht tragfähig',
  'Fehlende Kernunterlagen trotz Nachfrage',
  'Erbpacht mit Restlaufzeit < 50 Jahre',
  'Zwangsversteigerungsvermerk im Grundbuch',
  'Asbest/Altlasten ohne klaren Sanierungsplan',
  'Sperrminorität eines unkooperativen Eigentümers'
];
```

#### Verhandelbar (Preisabschlag fordern!)

| Mangel | Typischer Abschlag | Nachweis |
|--------|-------------------|----------|
| Sanierungsstau (bezifferbar) | Sanierungskosten + 10% Puffer | Kostenvoranschläge |
| Schlechte Energieklasse (E-H) | 50-150€/m² | Energieberater-Schätzung |
| Mietvertrag unter Markt | 12× Mietdifferenz | Mietspiegel-Vergleich |
| Fehlende Stellplätze | 10.000-30.000€ je nach Lage | Marktvergleich |
| Renovierungsbedarf innen | 300-600€/m² | Handwerker-Angebote |

#### Transparenzpflicht (für KI-Output)

**Bei JEDER Analyse explizit nennen:**
- Welche Daten fehlen
- Welche Annahmen getroffen wurden
- Welche Unsicherheiten bestehen
- Welche nächsten Schritte erforderlich sind

### Score-Berechnung

```javascript
function berechneImmobilienScore(immobilie) {
  let score = 50; // Basis
  
  // Cashflow (30%)
  const cashflowPunkte = Math.min(30, Math.max(0, 15 + (immobilie.cashflow / 10)));
  
  // Rendite (20%)
  const renditePunkte = Math.min(20, immobilie.bruttorendite * 4);
  
  // Lage (20%)
  const lagePunkte = { 'A': 20, 'B': 15, 'C': 10, 'D': 5 }[immobilie.lage];
  
  // Zustand (15%)
  const zustandPunkte = { 'Neubau': 15, 'Saniert': 12, 'Gepflegt': 9, 'Renovierungsbedürftig': 5 }[immobilie.zustand];
  
  // Energieeffizienz (15%)
  const energiePunkte = { 'A+': 15, 'A': 14, 'B': 12, 'C': 10, 'D': 8, 'E': 5, 'F': 3, 'G': 1, 'H': 0 }[immobilie.energieKlasse];
  
  score = cashflowPunkte + renditePunkte + lagePunkte + zustandPunkte + energiePunkte;
  
  // Abzüge für Red Flags
  if (immobilie.erbpacht) score -= 30;
  if (immobilie.baujahr < 1970 && !immobilie.kernsaniert) score -= 20;
  if (['G', 'H'].includes(immobilie.energieKlasse)) score -= 15;
  if (immobilie.sozialbindung) score -= 15;
  if (immobilie.kaufpreisfaktor > 30) score -= 10;
  if (immobilie.denkmalschutz) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}
```

### Empfehlung basierend auf Score

| Score | Empfehlung | Aktion |
|-------|------------|--------|
| 80-100 | 🟢 Sehr empfehlenswert | Zuschlagen! |
| 60-79 | 🟢 Empfehlenswert | Gutes Investment |
| 40-59 | 🟡 Prüfen | Verhandeln oder lassen |
| 20-39 | 🟠 Vorsicht | Nur mit Expertise |
| 0-19 | 🔴 Finger weg! | Red Flags! |

### KI-Output-Standard (Pflichtfelder für jede Analyse)

**Jede Immobilienanalyse MUSS diese Struktur liefern:**

```javascript
const analyseOutput = {
  // 1. Extrahierte Fakten aus Exposé/Eingabe
  extracted_facts: {
    kaufpreis: null,
    wohnflaeche: null,
    zimmer: null,
    baujahr: null,
    energieKlasse: null,
    istMiete: null, // IMMER Ist-Miete, nicht Potenzial!
    hausgeld: null,
    adresse: null
  },
  
  // 2. Berechnete KPIs
  kpis: {
    preisProQm: null,
    bruttorendite: null,
    nettorendite: null, // Optional
    cashflowMonat: null,
    kaufpreisfaktor: null,
    eigenkapitalrendite: null // Optional
  },
  
  // 3. Bewertung
  rating: {
    ampel: 'gruen|gelb|rot',
    score: 0, // 0-100
    zusammenfassung: '' // Ein Satz
  },
  
  // 4. Begründung (Regeln + Datenbezug)
  reasoning: [
    { regel: 'Bruttorendite > 4%', erfuellt: true, wert: '4.8%' },
    { regel: 'Kaufpreisfaktor < 25', erfuellt: false, wert: '27.3' }
  ],
  
  // 5. Nächste Schritte / Fehlende Unterlagen
  checks: [
    'WEG-Protokolle der letzten 3 Jahre anfordern',
    'Erhaltungsrücklage prüfen',
    'Energieausweis einsehen'
  ],
  
  // 6. Getroffene Annahmen (nur wenn unvermeidbar)
  assumptions: [
    { feld: 'instandhaltung', annahme: '9€/m²/Jahr', grund: 'Nicht angegeben, Standardwert für Baujahr' }
  ],
  
  // 7. Datenherkunft
  data_provenance: [
    { quelle: 'Exposé', datum: '2026-01-28', confidence: 'hoch' },
    { quelle: 'Mietspiegel Frankfurt', datum: '2024', confidence: 'mittel' }
  ]
};
```

**Beispiel-Output:**
```
📊 IMMOBILIENANALYSE
═══════════════════════════════════════

📍 Objekt: 3-Zi-ETW, Frankfurt-Bockenheim
💰 Kaufpreis: 320.000€ | 5.333€/m²
📐 Fläche: 60m² | Baujahr: 1985 | Energie: D

📈 KENNZAHLEN
├─ Bruttorendite: 4.5% ✅
├─ Kaufpreisfaktor: 22.2 ✅
├─ Cashflow/Monat: +47€ ✅
└─ Nettomietrendite: 3.2% ⚠️

🚦 BEWERTUNG: 🟢 72/100 – Empfehlenswert

✅ Stärken:
• Solide Rendite für Frankfurt
• Positiver Cashflow
• Gute Lage (Uni-Nähe)

⚠️ Schwächen:
• Energieklasse D → Sanierungsrisiko
• Baujahr 1985 → Elektrik/Sanitär prüfen

📋 NÄCHSTE SCHRITTE:
□ WEG-Protokolle anfordern
□ Erhaltungsrücklage prüfen (Ziel: >20€/m²)
□ Heizungsalter erfragen
□ Besichtigung mit Bausachverständigem

⚠️ ANNAHMEN:
• Instandhaltung: 9€/m²/Jahr (Standard)
• Mietausfallwagnis: 2% (Standard)
```

---

## TEIL 13: TOOLS & RESSOURCEN

### Wichtige Online-Portale

- **BORIS-D** (bodenrichtwerte-boris.de): Bodenrichtwerte bundesweit
- **BBSR Mietspiegelsammlung**: 722 Mietspiegel für 1.382 Kommunen
- **zvg-portal.de**: Zwangsversteigerungen bundesweit
- **energie-effizienz-experten.de**: Zertifizierte Energieberater

### Renditerechner (kostenlos)

- **Baufi24** (baufi24.de): Mietrendite-Rechner mit Atlas
- **ImmoAnalyse** (immoanalyse.info): Kostenlos mit PDF-Export
- **zinsen-berechnen.de**: Umfangreicher Immobilien-Kapitalanlage-Rechner

### Marktberichte (kostenlos)

- **JLL**: Wohnungsmarktüberblick (quarterly)
- **Savills**: Marktberichte Wohnen
- **Postbank Wohnatlas**: Jährliche Prognose
- **BBSR**: Immobilienmarktbericht Deutschland

### Wichtige Verbände

- **Haus & Grund** (hausundgrund.de): 900.000 Mitglieder, Rechtsberatung, Musterverträge
- **IVD** (ivd.net): Maklerverband, Preisspiegel
- **VDIV** (vdiv.de): Verwalterverband, 2.200 Mitgliedsunternehmen

### Förderungs-Finder

```javascript
function findePassendeFoerderungen(params) {
  const foerderungen = [];
  
  // KfW 124 - Selbstnutzung
  if (params.selbstnutzung && params.kaufOderBau) {
    foerderungen.push({
      name: 'KfW 124 Wohneigentumsprogramm',
      kredit: 100000,
      zins: 3.4,
      hinweis: 'Antrag VOR Kaufvertrag!'
    });
  }
  
  // KfW 261 - Energetische Sanierung
  if (params.sanierung && params.effizienzhaus) {
    const zuschuss = { 'EH40': 0.25, 'EH55': 0.175, 'EH70': 0.15, 'EH85': 0.10 };
    foerderungen.push({
      name: 'KfW 261 BEG Wohngebäude',
      kredit: 150000,
      tilgungszuschuss: zuschuss[params.effizienzhaus] * 150000
    });
  }
  
  // KfW 297/298 - Klimafreundlicher Neubau
  if (params.neubau && params.effizienzhaus) {
    foerderungen.push({
      name: 'KfW 297/298 Klimafreundlicher Neubau',
      kredit: params.qng ? 150000 : 100000,
      zins: 1.13
    });
  }
  
  // Jung kauft Alt
  if (params.familie && params.unsanierterAltbau && ['F', 'G', 'H'].includes(params.energieKlasse)) {
    foerderungen.push({
      name: 'KfW 308 Jung kauft Alt',
      kredit: 100000 + (params.kinderAnzahl >= 3 ? 50000 : 0),
      zins: 1.12,
      bedingung: 'Sanierung zu EH 85 EE in 54 Monaten'
    });
  }
  
  // Heizungsförderung
  if (params.neueHeizung && params.klimafreundlich) {
    let rate = 0.30;
    if (params.waermepumpeNaturKaelte) rate += 0.05;
    if (params.selbstnutzung && params.fossilTausch) rate += 0.20;
    if (params.einkommen <= 40000) rate += 0.30;
    rate = Math.min(rate, 0.70);
    
    foerderungen.push({
      name: 'KfW 458 Heizungsförderung',
      zuschuss: params.heizungKosten * rate
    });
  }
  
  // Landesförderungen
  if (params.bundesland === 'NRW') {
    foerderungen.push({
      name: 'NRW.BANK Eigentumsförderung',
      kredit: 184000 + (params.kinderAnzahl * 24000),
      zins: 0,
      tilgungsnachlass: '10%'
    });
  }
  
  return foerderungen;
}
```

---

## UI/UX ANWEISUNGEN

### Design-Prinzipien
- **Luxuriös & Modern:** Glassmorphism, subtile Animationen
- **Dark Mode First:** Dunkle Basis mit Akzentfarben
- **Zahlen-Fokus:** Monospace-Font für alle Zahlen
- **Ampel-System:** Grün/Gelb/Rot für Bewertungen

### Farbcodierung
- **🟢 Grün:** Positiver Cashflow, Score >70, gute Rendite, Förderung verfügbar
- **🟡 Gelb:** Neutraler Cashflow, Score 40-70, akzeptable Rendite
- **🔴 Rot:** Negativer Cashflow, Score <40, Red Flags

### Neue Features

1. **Förderungs-Optimizer:** Zeigt automatisch alle verfügbaren Förderungen
2. **Steuer-Simulator:** AfA-Vergleich (linear vs. degressiv vs. Denkmal)
3. **Leverage-Rechner:** Visualisiert Hebeleffekt
4. **Mieterhöhungs-Planer:** §558 + §559 Kappungsgrenzen
5. **Due-Diligence-Checkliste:** Interaktiv abhakbar

---

## TEIL 14: ERFOLGSFAKTOREN & FAZIT

### Kritische Erfolgsfaktoren für Immobilieninvestoren

1. **Förderanträge VOR Kaufvertrag/Baubeginn stellen** – Der häufigste Fehler!
2. **Nettomietrendite über 3,5% anstreben** – Break-Even-Zins beachten
3. **15%-Regel bei Sanierung beachten** – Renovierung nach 3-Jahres-Frist planen
4. **Energieeffizienz wird zum Preisdifferenzierungsfaktor** – A/A+ = 650€/m² mehr wert als D/E
5. **B- und C-Städte mit Hochschulen** bieten oft bessere Renditen als A-Lagen

### Der Wohnungsmangel als Investmentchance

- **Fertigstellungen 2025:** Nur 200.000-235.000 Wohnungen
- **Bedarf:** 372.000 Wohnungen pro Jahr
- **Gap:** 140.000+ fehlende Wohnungen jährlich
- **Folge:** Mieten werden langfristig weiter steigen

### Die goldene Regel

> **"Kaufe mit dem Kopf, nicht mit dem Herzen."**
> 
> Eine Immobilie ist ein Investment, kein Zuhause. Die Zahlen müssen stimmen – Emotionen haben bei der Kaufentscheidung nichts verloren.

### Quick-Check vor jedem Kauf

```javascript
function quickCheck(immobilie) {
  const checks = {
    bruttorendite: immobilie.bruttorendite >= 4,
    kaufpreisfaktor: immobilie.kaufpreisfaktor <= 25,
    cashflow: immobilie.cashflow >= 0,
    energieKlasse: !['G', 'H'].includes(immobilie.energieKlasse),
    keinErbpacht: !immobilie.erbpacht,
    keineSozialbindung: !immobilie.sozialbindung
  };
  
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  
  if (passed === total) return "✅ KAUFEN - Alle Kriterien erfüllt";
  if (passed >= 4) return "🟡 PRÜFEN - Einige Schwächen";
  return "🔴 FINGER WEG - Zu viele Red Flags";
}
```

### Typische Bewertungsfehler privater Käufer (VERMEIDEN!)

| Fehler | Problem | Richtig machen |
|--------|---------|----------------|
| Angebotspreise als Vergleich | Angebote ≠ Transaktionen | BORIS-D, Gutachterausschuss nutzen |
| Rendite aus Soll-Miete | Überschätzt Potenzial | NUR Ist-Miete als Basis |
| WEG-Protokolle ignoriert | Sonderumlagen übersehen | 3 Jahre Protokolle lesen! |
| Instandhaltung unterschätzt | CapEx-Schock | Min. 9-12€/m²/Jahr einplanen |
| Wohnfläche nicht geprüft | Falsche Kennzahlen | WoFlV vs. DIN klären, nachmessen |
| Energiekosten ignoriert | GEG-Pflichten, Sanierungskosten | Energieausweis als Kostenfaktor |
| Rechtliche Lasten übersehen | Wohnrecht, Nießbrauch, Baulasten | Grundbuch Abt. II + Baulastenverzeichnis |
| Emotionale Entscheidung | Überzahlung | Nur mit Zahlen entscheiden |
| Steuervorteile überbewerten | AfA ist nur Stundung | Cashflow muss ohne Steuer funktionieren |
| Mieter nicht geprüft | Mietnomaden, Zahlungsausfälle | SCHUFA, Mietschuldenfreiheit |

---

## ANHANG: CHECKLISTEN

### Due-Diligence-Checkliste (vor Kauf)

**Dokumente einfordern:**
- [ ] Grundbuchauszug (nicht älter als 3 Monate)
- [ ] Flurkarte/Lageplan
- [ ] Energieausweis (Verbrauch oder Bedarf)
- [ ] Baugenehmigung + Nutzungsänderungen
- [ ] Teilungserklärung (bei ETW)
- [ ] Wirtschaftsplan + Hausgeldabrechnung (3 Jahre)
- [ ] WEG-Protokolle (3 Jahre)
- [ ] Mietvertrag + Mieterhistorie
- [ ] Nebenkostenabrechnungen

**Vor Ort prüfen:**
- [ ] Dach (Ziegel, Dachrinne, Gauben)
- [ ] Fassade (Risse, Putz, Dämmung)
- [ ] Keller (Feuchtigkeit, Geruch)
- [ ] Heizung (Alter, Typ, Wartungsprotokolle)
- [ ] Fenster (Dichtungen, Verglasung)
- [ ] Elektrik (Sicherungskasten, Leitungen)
- [ ] Sanitär (Wasserdruck, Rohre)
- [ ] Umgebung (Lärm, Nachbarn, Infrastruktur)

**Behörden kontaktieren:**
- [ ] Bauamt (Baulastenverzeichnis)
- [ ] Katasteramt (Flächenangaben)
- [ ] Gutachterausschuss (Bodenrichtwerte)

### Finanzierungscheckliste

- [ ] Eigenkapital für Nebenkosten vorhanden?
- [ ] Haushaltsrechnung positiv bei Ausfall?
- [ ] KfW-Förderung geprüft?
- [ ] Landesförderung geprüft?
- [ ] Mindestens 3 Bankangebote verglichen?
- [ ] Sondertilgung vereinbart?
- [ ] Bereitstellungsfreie Zeit verhandelt?
- [ ] Zinsbindung gewählt (min. 10 Jahre)?

### Vermietungscheckliste

- [ ] Mietspiegel geprüft?
- [ ] Mietpreisbremse relevant?
- [ ] Selbstauskunft erhalten?
- [ ] SCHUFA geprüft?
- [ ] Mietschuldenfreiheitsbescheinigung?
- [ ] 3 Gehaltsnachweise?
- [ ] Mietvertrag erstellt?
- [ ] Kaution korrekt (max. 3 Kaltmieten)?
- [ ] Übergabeprotokoll vorbereitet?

---

*Knowledge Base Version 3.0 ULTIMATE – Januar 2026*
*Integriert: Mega-Research mit allen 13 Themenbereichen + Checklisten*
*Basierend auf: Deep Research Session vom 28.01.2026*