# Immobilien-Berater – Claude Code Projektanweisungen (ULTIMATE EDITION V3.0)

## 🏠 MIETSCHÄTZUNG BEI FEHLENDER MIETE (KRITISCH!)

### Wann greift das?
Wenn **Miete = 0** oder **keine Miete angegeben** ist (z.B. leerstehende/freie Immobilie).

### Was musst du tun?
1. **Recherchiere die ortsübliche Marktmiete** basierend auf:
   - Stadt/Stadtteil
   - Wohnfläche (m²)
   - Baujahr & Zustand
   - Ausstattung

2. **Berechne die geschätzte Miete:**
   ```
   Geschätzte Miete = Wohnfläche × Marktmiete/m²

   BEISPIEL (München, 80m², gute Lage):
   Marktmiete: ~18€/m²
   → Geschätzte Miete: 80 × 18 = 1.440€/Monat
   ```

3. **Nutze diese geschätzte Miete als Benchmark** für:
   - Cashflow-Berechnung
   - Rendite-Analyse
   - Investment-Bewertung
   - Kaufpreisfaktor

### Wichtig für die Analyse:
- **IMMER** dem User mitteilen, dass die Miete geschätzt wurde
- Die Schätzung basiert auf aktuellen Marktdaten
- Empfehle dem User, die lokale Vergleichsmiete zu prüfen
- Zeige die Berechnung: `X€/m² × Y m² = Z€/Monat`

### Marktmieten Orientierung (2025/2026):
```
München:        15-25€/m²  (Innenstadt bis 30€)
Hamburg:        12-18€/m²
Frankfurt:      13-20€/m²
Berlin:         10-16€/m²
Düsseldorf:     11-15€/m²
Köln:           10-14€/m²
Stuttgart:      12-17€/m²
Andere Großstädte: 8-12€/m²
Mittelstädte:    6-10€/m²
Ländlich:        5-8€/m²
```

---

## 💰 KAUFNEBENKOSTEN-BERECHNUNG (IMMER ANZEIGEN!)

### Warum wichtig?

**Kaufnebenkosten sind "verlorenes" Geld** – sie erhöhen deinen Kapitaleinsatz, aber nicht den Wert der Immobilie!

```
BEISPIEL:
Kaufpreis:      300.000€
+ Nebenkosten:   35.700€ (11,9%)
────────────────────────
TOTAL INVEST:   335.700€

Aber die Immobilie ist nur 300.000€ wert!
→ Du startest mit 35.700€ "Verlust" (auf dem Papier)
```

---

### 📊 KAUFNEBENKOSTEN NACH BUNDESLAND

```javascript
const GRUNDERWERBSTEUER = {
  // Stand 2025/2026
  'baden-wuerttemberg': 0.050,   // 5.0%
  'bayern': 0.035,               // 3.5% ← Günstigste!
  'berlin': 0.060,               // 6.0%
  'brandenburg': 0.065,          // 6.5% ← Teuerste!
  'bremen': 0.050,               // 5.0%
  'hamburg': 0.055,              // 5.5%
  'hessen': 0.060,               // 6.0%
  'mecklenburg-vorpommern': 0.060, // 6.0%
  'niedersachsen': 0.050,        // 5.0%
  'nordrhein-westfalen': 0.065,  // 6.5% ← Teuerste!
  'rheinland-pfalz': 0.050,      // 5.0%
  'saarland': 0.065,             // 6.5% ← Teuerste!
  'sachsen': 0.035,              // 3.5% ← Günstigste!
  'sachsen-anhalt': 0.050,       // 5.0%
  'schleswig-holstein': 0.065,   // 6.5% ← Teuerste!
  'thueringen': 0.050            // 5.0%
};

const NOTAR_UND_GRUNDBUCH = 0.02;  // ~2% (1.5% Notar + 0.5% Grundbuch)

const MAKLER = {
  'mit_makler': 0.0357,           // 3.57% inkl. MwSt (üblich: 50/50 Teilung)
  'ohne_makler': 0.00
};
```

---

### 🧮 NEBENKOSTEN-RECHNER

```javascript
function berechneKaufnebenkosten(kaufpreis, bundesland, mitMakler = true) {
  const bundeslandKey = bundesland.toLowerCase().replace(/[^a-z]/g, '').replace('ü', 'ue').replace('ö', 'oe');
  
  // Grunderwerbsteuer
  const grstSatz = GRUNDERWERBSTEUER[bundeslandKey] || 0.05;
  const grunderwerbsteuer = kaufpreis * grstSatz;
  
  // Notar + Grundbuch
  const notarGrundbuch = kaufpreis * NOTAR_UND_GRUNDBUCH;
  
  // Makler (optional)
  const maklerKosten = mitMakler ? kaufpreis * MAKLER['mit_makler'] : 0;
  
  // Summe
  const nebenkostenGesamt = grunderwerbsteuer + notarGrundbuch + maklerKosten;
  const nebenkostenProzent = (nebenkostenGesamt / kaufpreis) * 100;
  
  return {
    grunderwerbsteuer: {
      betrag: Math.round(grunderwerbsteuer),
      prozent: grstSatz * 100,
      bundesland: bundesland
    },
    notarGrundbuch: {
      betrag: Math.round(notarGrundbuch),
      prozent: NOTAR_UND_GRUNDBUCH * 100
    },
    makler: {
      betrag: Math.round(maklerKosten),
      prozent: mitMakler ? MAKLER['mit_makler'] * 100 : 0,
      vorhanden: mitMakler
    },
    gesamt: {
      betrag: Math.round(nebenkostenGesamt),
      prozent: Math.round(nebenkostenProzent * 10) / 10
    },
    gesamtinvestition: kaufpreis + Math.round(nebenkostenGesamt)
  };
}
```

---

### 📋 NEBENKOSTEN-ANZEIGE (IMMER ZEIGEN!)

```
═══════════════════════════════════════════════════════════════════════════════
💰 KAUFNEBENKOSTEN-ÜBERSICHT
═══════════════════════════════════════════════════════════════════════════════

Kaufpreis:                     300.000€

┌─────────────────────────────────────────────────────────────────────────────┐
│ NEBENKOSTEN                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Grunderwerbsteuer (Hamburg 5,5%):           16.500€                        │
│ Notar + Grundbuch (~2%):                     6.000€                        │
│ Makler (3,57%):                             10.710€                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ NEBENKOSTEN GESAMT:                         33.210€  (11,07%)              │
└─────────────────────────────────────────────────────────────────────────────┘

GESAMTINVESTITION:                           333.210€
═══════════════════════════════════════════════════════════════════════════════
```

---

## 📈 EIGENKAPITALRENDITE (ROI) - MIT NEBENKOSTEN!

### Warum ist das kritisch?

**Die meisten Rechner ignorieren Nebenkosten beim ROI – das ist FALSCH!**

```
❌ FALSCHE Berechnung:
Eigenkapital: 60.000€ (20% von 300.000€)
Cashflow: 3.600€/Jahr
→ "ROI": 3.600 / 60.000 = 6% 

✅ RICHTIGE Berechnung (mit Nebenkosten):
Eigenkapital: 60.000€
+ Nebenkosten selbst getragen: 33.210€
= ECHTES Eigenkapital: 93.210€
Cashflow: 3.600€/Jahr
→ ECHTER ROI: 3.600 / 93.210 = 3,86%

Der echte ROI ist 36% NIEDRIGER als der "schöne" ROI!
```

---

### 🔄 ZWEI SZENARIEN: Nebenkosten finanzieren vs. selbst zahlen

```javascript
function berechneEigenkapitalrendite(immobilie, finanzierung, optionen = {}) {
  const { 
    kaufpreis, 
    kaltmiete, 
    hausgeld, 
    nichtUmlagefaehig 
  } = immobilie;
  
  const {
    eigenkapitalProzent,
    zinssatz,
    tilgungssatz,
    bundesland,
    mitMakler
  } = finanzierung;
  
  const {
    nebenkostenFinanzieren = false,  // User-Wahl!
    betrachtungszeitraum = 10        // Jahre
  } = optionen;
  
  // ═══════════════════════════════════════════════════════════════════════
  // SCHRITT 1: Nebenkosten berechnen
  // ═══════════════════════════════════════════════════════════════════════
  
  const nebenkosten = berechneKaufnebenkosten(kaufpreis, bundesland, mitMakler);
  const nebenkostenBetrag = nebenkosten.gesamt.betrag;
  
  // ═══════════════════════════════════════════════════════════════════════
  // SCHRITT 2: Eigenkapital-Einsatz berechnen
  // ═══════════════════════════════════════════════════════════════════════
  
  const eigenkapitalKaufpreis = kaufpreis * eigenkapitalProzent;
  
  let eigenkapitalGesamt, darlehensSumme;
  
  if (nebenkostenFinanzieren) {
    // VARIANTE A: Nebenkosten werden mitfinanziert (110% Finanzierung)
    // → Eigenkapital = nur Anzahlung auf Kaufpreis
    // → Aber: Höherer Zinssatz! (+0.3-0.5%)
    eigenkapitalGesamt = eigenkapitalKaufpreis;
    darlehensSumme = kaufpreis - eigenkapitalKaufpreis + nebenkostenBetrag;
  } else {
    // VARIANTE B: Nebenkosten aus eigener Tasche (EMPFOHLEN!)
    // → Eigenkapital = Anzahlung + Nebenkosten
    // → Besserer Zinssatz, weniger Schulden
    eigenkapitalGesamt = eigenkapitalKaufpreis + nebenkostenBetrag;
    darlehensSumme = kaufpreis - eigenkapitalKaufpreis;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // SCHRITT 3: Monatliche Belastung berechnen
  // ═══════════════════════════════════════════════════════════════════════
  
  // Zinszuschlag wenn Nebenkosten finanziert werden
  const effektiverZins = nebenkostenFinanzieren 
    ? zinssatz + 0.004  // +0.4% Aufschlag bei 110% Finanzierung
    : zinssatz;
  
  const annuitaet = darlehensSumme * (effektiverZins + tilgungssatz);
  const monatlicheRate = annuitaet / 12;
  
  // ═══════════════════════════════════════════════════════════════════════
  // SCHRITT 4: Cashflow berechnen
  // ═══════════════════════════════════════════════════════════════════════
  
  const mieteinnahmenMonat = kaltmiete;
  const hausgeldMonat = hausgeld;
  const nichtUmlagefaehigMonat = nichtUmlagefaehig || hausgeld * 0.3;
  const instandhaltungMonat = immobilie.wohnflaeche * 1;  // 1€/m²/Monat Reserve
  
  const cashflowMonat = mieteinnahmenMonat - monatlicheRate - nichtUmlagefaehigMonat - instandhaltungMonat;
  const cashflowJahr = cashflowMonat * 12;
  
  // ═══════════════════════════════════════════════════════════════════════
  // SCHRITT 5: EIGENKAPITALRENDITE BERECHNEN
  // ═══════════════════════════════════════════════════════════════════════
  
  // A) Reine Cashflow-Rendite
  const cashflowRendite = (cashflowJahr / eigenkapitalGesamt) * 100;
  
  // B) + Tilgung (Equity Buildup)
  const tilgungJahr1 = darlehensSumme * tilgungssatz;
  const tilgungRendite = (tilgungJahr1 / eigenkapitalGesamt) * 100;
  
  // C) + Wertsteigerung (konservativ 1.5%/Jahr für Deutschland)
  const wertsteigerungJahr = kaufpreis * 0.015;
  const wertsteigerungRendite = (wertsteigerungJahr / eigenkapitalGesamt) * 100;
  
  // D) GESAMT-EIGENKAPITALRENDITE
  const gesamtRendite = cashflowRendite + tilgungRendite + wertsteigerungRendite;
  
  return {
    // Eingaben
    szenario: nebenkostenFinanzieren ? 'Nebenkosten finanziert' : 'Nebenkosten selbst gezahlt',
    
    // Kapitaleinsatz
    eigenkapital: {
      kaufpreisAnteil: Math.round(eigenkapitalKaufpreis),
      nebenkosten: nebenkostenFinanzieren ? 0 : nebenkostenBetrag,
      gesamt: Math.round(eigenkapitalGesamt),
      prozentVomKaufpreis: Math.round((eigenkapitalKaufpreis / kaufpreis) * 100),
      prozentVomGesamtinvest: Math.round((eigenkapitalGesamt / (kaufpreis + nebenkostenBetrag)) * 100)
    },
    
    // Finanzierung
    darlehen: {
      summe: Math.round(darlehensSumme),
      zinssatz: (effektiverZins * 100).toFixed(2),
      tilgungssatz: (tilgungssatz * 100).toFixed(2),
      monatlicheRate: Math.round(monatlicheRate),
      beleihungsauslauf: Math.round((darlehensSumme / kaufpreis) * 100)
    },
    
    // Cashflow
    cashflow: {
      monatlich: Math.round(cashflowMonat),
      jaehrlich: Math.round(cashflowJahr)
    },
    
    // EIGENKAPITALRENDITE (Das Wichtigste!)
    eigenkapitalRendite: {
      cashflowRendite: Math.round(cashflowRendite * 100) / 100,
      tilgungsRendite: Math.round(tilgungRendite * 100) / 100,
      wertsteigerungsRendite: Math.round(wertsteigerungRendite * 100) / 100,
      gesamtRendite: Math.round(gesamtRendite * 100) / 100,
      bewertung: bewerteEigenkapitalrendite(gesamtRendite)
    },
    
    // Vergleich der Szenarien
    vergleich: {
      ohneNebenkosten: nebenkostenFinanzieren ? null : 'Aktuelles Szenario',
      mitNebenkosten: nebenkostenFinanzieren ? 'Aktuelles Szenario' : null,
      hinweis: nebenkostenFinanzieren 
        ? '⚠️ Nebenkosten finanzieren = höherer Zins + mehr Schulden'
        : '✅ Nebenkosten selbst zahlen = bessere Konditionen'
    }
  };
}

function bewerteEigenkapitalrendite(rendite) {
  // ANGEPASST: ~10 Punkte positiver bewertet!
  if (rendite >= 10) return { ampel: '🟢🟢', text: 'Exzellent', beschreibung: 'Top-Investment!' };
  if (rendite >= 6) return { ampel: '🟢', text: 'Sehr gut', beschreibung: 'Überdurchschnittlich' };
  if (rendite >= 3) return { ampel: '🟡', text: 'Gut', beschreibung: 'Solide Rendite' };
  if (rendite >= 1) return { ampel: '🟠', text: 'Akzeptabel', beschreibung: 'Unter Durchschnitt' };
  if (rendite >= -2) return { ampel: '🔴', text: 'Schwach', beschreibung: 'Kaum Rendite' };
  return { ampel: '🔴🔴', text: 'Negativ', beschreibung: 'Verlustgeschäft!' };
}
```

---

### 📋 EIGENKAPITALRENDITE-ANZEIGE (BEIDE SZENARIEN!)

```
═══════════════════════════════════════════════════════════════════════════════
📈 EIGENKAPITALRENDITE (ROI) - VERGLEICH
═══════════════════════════════════════════════════════════════════════════════

Kaufpreis: 300.000€ | Nebenkosten: 33.210€ | Eigenkapital: 20%

┌─────────────────────────────────────────────────────────────────────────────┐
│ SZENARIO A: Nebenkosten SELBST zahlen (EMPFOHLEN! ✅)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dein Kapitaleinsatz:                                                        │
│   • Eigenkapital (20% von 300k):     60.000€                               │
│   • Nebenkosten selbst:              33.210€                               │
│   • GESAMT eingesetzt:               93.210€                               │
│                                                                             │
│ Darlehen: 240.000€ @ 3,80% + 2% Tilgung = 1.160€/Monat                     │
│ Beleihungsauslauf: 80% (gute Konditionen!)                                 │
│                                                                             │
│ EIGENKAPITALRENDITE:                                                        │
│   • Cashflow-Rendite:                +1,2%                                 │
│   • Tilgungs-Rendite:                +5,2%                                 │
│   • Wertsteigerungs-Rendite:         +4,8%                                 │
│   ─────────────────────────────────────────                                │
│   • GESAMT-RENDITE:                  +11,2% p.a. 🟢                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SZENARIO B: Nebenkosten MITFINANZIEREN (⚠️ Teurer!)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Dein Kapitaleinsatz:                                                        │
│   • Eigenkapital (20% von 300k):     60.000€                               │
│   • Nebenkosten selbst:                   0€                               │
│   • GESAMT eingesetzt:               60.000€                               │
│                                                                             │
│ Darlehen: 273.210€ @ 4,20% + 2% Tilgung = 1.412€/Monat                     │
│ Beleihungsauslauf: 91% (schlechtere Konditionen, +0,4% Zins!)              │
│                                                                             │
│ EIGENKAPITALRENDITE:                                                        │
│   • Cashflow-Rendite:                -2,8% (NEGATIV!)                      │
│   • Tilgungs-Rendite:                +9,1%                                 │
│   • Wertsteigerungs-Rendite:         +7,5%                                 │
│   ─────────────────────────────────────────                                │
│   • GESAMT-RENDITE:                  +13,8% p.a. 🟢                        │
│                                                                             │
│ ⚠️ ABER: Höheres Risiko! Negativer Cashflow = du zahlst drauf!            │
│    252€/Monat mehr Rate = 3.024€/Jahr aus eigener Tasche                  │
└─────────────────────────────────────────────────────────────────────────────┘

💡 EMPFEHLUNG:
Szenario A (Nebenkosten selbst) ist sicherer:
• Positiver Cashflow = kein monatliches Draufzahlen
• Niedrigerer Zins = weniger Gesamtkosten über Laufzeit
• 80% Beleihung = leichtere Anschlussfinanzierung

Szenario B nur wenn:
• Du SICHER bist, dass du die monatliche Belastung trägst
• Du auf schnelleren Vermögensaufbau setzt
• Du genug Reserve für Notfälle hast (min. 6 Monatsraten)

═══════════════════════════════════════════════════════════════════════════════
```

---

### 🔢 QUICK-REFERENCE: Nebenkosten nach Bundesland

| Bundesland | GrESt | + Notar/GB | + Makler | GESAMT |
|------------|-------|------------|----------|--------|
| Bayern | 3,5% | 2,0% | 3,57% | **9,07%** |
| Sachsen | 3,5% | 2,0% | 3,57% | **9,07%** |
| Baden-Württemberg | 5,0% | 2,0% | 3,57% | **10,57%** |
| Hamburg | 5,5% | 2,0% | 3,57% | **11,07%** |
| Berlin | 6,0% | 2,0% | 3,57% | **11,57%** |
| NRW | 6,5% | 2,0% | 3,57% | **12,07%** |
| Brandenburg | 6,5% | 2,0% | 3,57% | **12,07%** |
| Schleswig-Holstein | 6,5% | 2,0% | 3,57% | **12,07%** |

**Ohne Makler:** Zieht 3,57% ab!

---

## ⚠️ KRITISCHE ANWEISUNG: LIVE-RECHERCHE!

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔴 BEI JEDER IMMOBILIEN-ANALYSE ZUERST LIVE RECHERCHIEREN!                 │
│                                                                             │
│ NIEMALS nur auf statische Daten in dieser Datei verlassen!                 │
│                                                                             │
│ Statisch: "Hamburg = 6.000€/m²" ← FALSCH (zu ungenau!)                     │
│ Live:     "Poppenbüttel Reihenhaus = 4.941€/m²" ← RICHTIG!                 │
│                                                                             │
│ WORKFLOW:                                                                   │
│ 1. User nennt Adresse/Stadtteil + Immobilientyp                            │
│ 2. → SOFORT Web-Suche für €/m² Kaufpreise                                  │
│ 3. → SOFORT Web-Suche für €/m² Mietpreise                                  │
│ 4. → Dann erst Bewertung mit Live-Daten berechnen                          │
│                                                                             │
│ Siehe Abschnitt "LIVE-RECHERCHE FÜR MARKTWERT" für Details!                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 KAUFNEBENKOSTEN-BERECHNUNG (PFLICHT BEI JEDER ANALYSE!)

### Grunderwerbsteuer nach Bundesland (Stand 2025)

```javascript
const GRUNDERWERBSTEUER = {
  'baden-wuerttemberg': 0.050,   // 5.0%
  'bayern': 0.035,               // 3.5% - Am günstigsten!
  'berlin': 0.060,               // 6.0%
  'brandenburg': 0.065,          // 6.5%
  'bremen': 0.050,               // 5.0%
  'hamburg': 0.055,              // 5.5%
  'hessen': 0.060,               // 6.0%
  'mecklenburg-vorpommern': 0.060, // 6.0%
  'niedersachsen': 0.050,        // 5.0%
  'nordrhein-westfalen': 0.065,  // 6.5% - Am teuersten!
  'rheinland-pfalz': 0.050,      // 5.0%
  'saarland': 0.065,             // 6.5%
  'sachsen': 0.035,              // 3.5% - Am günstigsten!
  'sachsen-anhalt': 0.050,       // 5.0%
  'schleswig-holstein': 0.065,   // 6.5%
  'thueringen': 0.050            // 5.0%
};
```

### Kaufnebenkosten-Rechner (Komplett!)

```javascript
function berechneKaufnebenkosten(kaufpreis, bundesland, mitMakler = true, maklerAnteilKaeufer = 0.5) {
  /*
  KAUFNEBENKOSTEN IN DEUTSCHLAND:
  ├─ Grunderwerbsteuer: 3,5% - 6,5% (je nach Bundesland)
  ├─ Notar & Grundbuch: ~1,5% - 2,0%
  └─ Makler (Käuferanteil): 0% - 3,57% (seit 2020 geteilt)
  
  GESAMT: 7% - 12% je nach Bundesland und Makler!
  */
  
  const bundeslandKey = bundesland.toLowerCase().replace(/[^a-z]/g, '').replace('ü', 'ue').replace('ö', 'oe');
  
  // ═══════════════════════════════════════════════════════════════════════
  // 1. GRUNDERWERBSTEUER
  // ═══════════════════════════════════════════════════════════════════════
  
  const grstSatz = GRUNDERWERBSTEUER[bundeslandKey] || 0.05;
  const grunderwerbsteuer = kaufpreis * grstSatz;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 2. NOTAR & GRUNDBUCH (ca. 1,5% - 2,0%)
  // ═══════════════════════════════════════════════════════════════════════
  
  // Notar: ~1,0% - 1,5% (Beurkundung, Vollzug)
  // Grundbuch: ~0,5% (Eintragung, Auflassungsvormerkung)
  const notarUndGrundbuch = kaufpreis * 0.02; // Konservativ 2%
  
  // ═══════════════════════════════════════════════════════════════════════
  // 3. MAKLER (seit 2020: Teilung zwischen Käufer & Verkäufer)
  // ═══════════════════════════════════════════════════════════════════════
  
  let maklerKaeufer = 0;
  let maklerInfo = '';
  
  if (mitMakler) {
    // Übliche Gesamtprovision: 5,95% - 7,14% (inkl. MwSt)
    // Seit 2020: Käufer zahlt max. so viel wie Verkäufer
    // Typisch: 50/50 Teilung = 2,975% - 3,57% pro Seite
    
    const gesamtProvision = 0.0714; // 7,14% inkl. MwSt (üblich)
    maklerKaeufer = kaufpreis * gesamtProvision * maklerAnteilKaeufer;
    maklerInfo = `${(gesamtProvision * maklerAnteilKaeufer * 100).toFixed(2)}% Käuferanteil`;
  } else {
    maklerInfo = 'Kein Makler / Provisionsfrei';
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // GESAMT
  // ═══════════════════════════════════════════════════════════════════════
  
  const gesamtNebenkosten = grunderwerbsteuer + notarUndGrundbuch + maklerKaeufer;
  const nebenkostenProzent = (gesamtNebenkosten / kaufpreis) * 100;
  
  return {
    // Einzelposten
    grunderwerbsteuer: {
      betrag: Math.round(grunderwerbsteuer),
      satz: grstSatz,
      prozent: (grstSatz * 100).toFixed(1) + '%',
      bundesland: bundesland
    },
    notarUndGrundbuch: {
      betrag: Math.round(notarUndGrundbuch),
      prozent: '2,0%',
      details: 'Notar ~1,5% + Grundbuch ~0,5%'
    },
    makler: {
      betrag: Math.round(maklerKaeufer),
      info: maklerInfo,
      mitMakler: mitMakler
    },
    
    // Gesamt
    gesamt: {
      betrag: Math.round(gesamtNebenkosten),
      prozent: nebenkostenProzent.toFixed(1) + '%'
    },
    
    // Für Finanzierung
    gesamtKaufkosten: kaufpreis + Math.round(gesamtNebenkosten),
    
    // Übersichtliche Ausgabe
    zusammenfassung: `
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💰 KAUFNEBENKOSTEN: ${bundesland}                                          
├─────────────────────────────────────────────────────────────────────────────┤
│ Kaufpreis:                                    ${kaufpreis.toLocaleString().padStart(12)}€ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Grunderwerbsteuer (${(grstSatz * 100).toFixed(1)}%):                ${Math.round(grunderwerbsteuer).toLocaleString().padStart(12)}€ │
│ Notar & Grundbuch (~2,0%):                    ${Math.round(notarUndGrundbuch).toLocaleString().padStart(12)}€ │
│ Makler (${maklerInfo}):            ${Math.round(maklerKaeufer).toLocaleString().padStart(12)}€ │
├─────────────────────────────────────────────────────────────────────────────┤
│ NEBENKOSTEN GESAMT (${nebenkostenProzent.toFixed(1)}%):              ${Math.round(gesamtNebenkosten).toLocaleString().padStart(12)}€ │
├─────────────────────────────────────────────────────────────────────────────┤
│ GESAMTKOSTEN (Kaufpreis + NK):                ${(kaufpreis + Math.round(gesamtNebenkosten)).toLocaleString().padStart(12)}€ │
└─────────────────────────────────────────────────────────────────────────────┘
    `
  };
}
```

### Schnelle Nebenkosten-Übersicht nach Bundesland

```
┌──────────────────────────────────────────────────────────────────────────┐
│ KAUFNEBENKOSTEN NACH BUNDESLAND (ohne Makler)                            │
├──────────────────────────────────────────────────────────────────────────┤
│ 🟢 GÜNSTIG (5,5%):                                                       │
│    Bayern, Sachsen (3,5% GrESt + 2% Notar)                               │
├──────────────────────────────────────────────────────────────────────────┤
│ 🟡 MITTEL (7,0-7,5%):                                                    │
│    Baden-Württemberg, Bremen, Niedersachsen, Rheinland-Pfalz,            │
│    Sachsen-Anhalt, Thüringen (5,0% GrESt)                                │
├──────────────────────────────────────────────────────────────────────────┤
│ 🟠 TEUER (7,5-8,0%):                                                     │
│    Hamburg (5,5%), Berlin, Hessen, Meck-Pomm (6,0%)                      │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔴 SEHR TEUER (8,5%):                                                    │
│    Brandenburg, NRW, Saarland, Schleswig-Holstein (6,5% GrESt)           │
└──────────────────────────────────────────────────────────────────────────┘

MIT MAKLER (50/50 Teilung): + 3,57% = 9% bis 12% GESAMT!
```

---

## 📊 EIGENKAPITALRENDITE (ROE) - Der wichtigste Wert!

### Warum Eigenkapitalrendite?

```
BEISPIEL: 
Kaufpreis: 300.000€
Mietrendite: 4% = 12.000€/Jahr

ABER: Wie viel verdienst DU auf DEIN eingesetztes Geld?

Fall A: 100% Eigenkapital
├─ EK eingesetzt: 300.000€ + 30.000€ NK = 330.000€
├─ Gewinn/Jahr: 12.000€
└─ EK-Rendite: 12.000 / 330.000 = 3,6% 😐

Fall B: 20% EK + 80% Kredit
├─ EK eingesetzt: 60.000€ + 30.000€ NK = 90.000€
├─ Gewinn/Jahr (nach Zinsen): 5.000€
└─ EK-Rendite: 5.000 / 90.000 = 5,5% 🟢

Fall C: 10% EK + 90% Kredit + NK mitfinanziert
├─ EK eingesetzt: 30.000€
├─ Gewinn/Jahr (nach Zinsen): 2.500€
└─ EK-Rendite: 2.500 / 30.000 = 8,3% 🟢🟢

→ HEBEL-EFFEKT: Weniger EK = höhere EK-Rendite (bei positiver Marge!)
```

### Eigenkapitalrendite-Rechner (ROE Calculator)

```javascript
function berechneEigenkapitalrendite(immobilie, finanzierung, nebenkosten, optionen = {}) {
  /*
  EIGENKAPITALRENDITE (Return on Equity) = 
    Jährlicher Gewinn / Eingesetztes Eigenkapital × 100
  
  OPTIONEN:
  - nebenkostenAusEK: true = User zahlt NK aus eigener Tasche
  - nebenkostenAusEK: false = NK werden mitfinanziert
  */
  
  const { nebenkostenAusEK = true } = optionen;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 1. EINGESETZTES EIGENKAPITAL BERECHNEN
  // ═══════════════════════════════════════════════════════════════════════
  
  let eigenkapitalEinsatz = 0;
  let finanzierungsSumme = 0;
  
  if (nebenkostenAusEK) {
    // VARIANTE A: User zahlt Nebenkosten selbst
    // EK = Anzahlung + Kaufnebenkosten
    eigenkapitalEinsatz = finanzierung.eigenkapital + nebenkosten.gesamt.betrag;
    finanzierungsSumme = immobilie.kaufpreis - finanzierung.eigenkapital;
  } else {
    // VARIANTE B: Nebenkosten werden mitfinanziert (110% Finanzierung)
    // EK = nur die Anzahlung
    eigenkapitalEinsatz = finanzierung.eigenkapital;
    finanzierungsSumme = immobilie.kaufpreis + nebenkosten.gesamt.betrag - finanzierung.eigenkapital;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // 2. JÄHRLICHE EINNAHMEN & AUSGABEN
  // ═══════════════════════════════════════════════════════════════════════
  
  const jahresmiete = immobilie.kaltmiete * 12;
  
  // Nicht-umlagefähige Kosten (Hausgeld-Anteil, Instandhaltung, Verwaltung)
  const nichtUmlagefaehig = immobilie.nichtUmlagefaehigesHausgeld 
    ? immobilie.nichtUmlagefaehigesHausgeld * 12 
    : jahresmiete * 0.15; // ~15% als Schätzung
  
  const jahresReinertrag = jahresmiete - nichtUmlagefaehig;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 3. FINANZIERUNGSKOSTEN
  // ═══════════════════════════════════════════════════════════════════════
  
  const zinssatz = finanzierung.zinssatz || 0.038; // 3,8% als Default
  const jahreszinsen = finanzierungsSumme * zinssatz;
  
  // Tilgung (baut Vermögen auf, aber ist Cashflow-relevant)
  const tilgungssatz = finanzierung.tilgung || 0.02; // 2% als Default
  const jahrestilgung = finanzierungsSumme * tilgungssatz;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 4. CASHFLOW BERECHNUNG
  // ═══════════════════════════════════════════════════════════════════════
  
  const annuitaet = jahreszinsen + jahrestilgung;
  const cashflowVorSteuern = jahresReinertrag - annuitaet;
  const cashflowProMonat = cashflowVorSteuern / 12;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 5. EIGENKAPITALRENDITE BERECHNEN (Mehrere Methoden!)
  // ═══════════════════════════════════════════════════════════════════════
  
  // METHODE 1: Nur Cashflow (konservativ)
  const roeCashflow = (cashflowVorSteuern / eigenkapitalEinsatz) * 100;
  
  // METHODE 2: Cashflow + Tilgung (realistischer)
  // Tilgung erhöht dein Vermögen, auch wenn kein Cash fließt
  const roeInklTilgung = ((cashflowVorSteuern + jahrestilgung) / eigenkapitalEinsatz) * 100;
  
  // METHODE 3: Komplett (inkl. geschätzter Wertsteigerung)
  const wertsteigerungRate = 0.02; // 2% p.a. konservativ
  const wertsteigerung = immobilie.kaufpreis * wertsteigerungRate;
  const roeKomplett = ((cashflowVorSteuern + jahrestilgung + wertsteigerung) / eigenkapitalEinsatz) * 100;
  
  // ═══════════════════════════════════════════════════════════════════════
  // 6. BEWERTUNG
  // ═══════════════════════════════════════════════════════════════════════
  
  function bewerteROE(roe) {
    if (roe >= 15) return { ampel: '🟢🟢', text: 'Exzellent', beschreibung: 'Überdurchschnittliche Rendite!' };
    if (roe >= 10) return { ampel: '🟢', text: 'Sehr gut', beschreibung: 'Gute Eigenkapitalrendite' };
    if (roe >= 6) return { ampel: '🟡', text: 'Akzeptabel', beschreibung: 'Durchschnittlich für Immobilien' };
    if (roe >= 3) return { ampel: '🟠', text: 'Mäßig', beschreibung: 'Unter Durchschnitt' };
    if (roe >= 0) return { ampel: '🔴', text: 'Schwach', beschreibung: 'Kaum Rendite auf EK' };
    return { ampel: '🔴🔴', text: 'Negativ', beschreibung: 'Du verlierst Geld!' };
  }
  
  return {
    // Eingesetztes Kapital
    eigenkapital: {
      anzahlung: finanzierung.eigenkapital,
      nebenkosten: nebenkostenAusEK ? nebenkosten.gesamt.betrag : 0,
      gesamt: Math.round(eigenkapitalEinsatz),
      nebenkostenAusEK: nebenkostenAusEK
    },
    
    // Finanzierung
    finanzierung: {
      kreditSumme: Math.round(finanzierungsSumme),
      zinssatz: zinssatz,
      tilgung: tilgungssatz,
      annuitaet: Math.round(annuitaet),
      jahreszinsen: Math.round(jahreszinsen),
      jahrestilgung: Math.round(jahrestilgung)
    },
    
    // Erträge
    ertraege: {
      jahresmiete: Math.round(jahresmiete),
      nichtUmlagefaehig: Math.round(nichtUmlagefaehig),
      reinertrag: Math.round(jahresReinertrag)
    },
    
    // Cashflow
    cashflow: {
      jaehrlich: Math.round(cashflowVorSteuern),
      monatlich: Math.round(cashflowProMonat)
    },
    
    // DIE EIGENKAPITALRENDITEN
    eigenkapitalrendite: {
      // Konservativ: Nur echter Cashflow
      nurCashflow: {
        wert: Math.round(roeCashflow * 10) / 10,
        bewertung: bewerteROE(roeCashflow),
        erklaerung: 'Nur der tatsächliche Cashflow, der auf dein Konto fließt'
      },
      // Realistisch: Cashflow + Tilgung
      inklTilgung: {
        wert: Math.round(roeInklTilgung * 10) / 10,
        bewertung: bewerteROE(roeInklTilgung),
        erklaerung: 'Cashflow + Vermögensaufbau durch Tilgung'
      },
      // Optimistisch: Alles inkl. Wertsteigerung
      komplett: {
        wert: Math.round(roeKomplett * 10) / 10,
        bewertung: bewerteROE(roeKomplett),
        erklaerung: 'Cashflow + Tilgung + 2% geschätzte Wertsteigerung'
      }
    },
    
    // Vergleich: Was wäre wenn NK mitfinanziert?
    vergleichNKFinanzierung: nebenkostenAusEK 
      ? berechneVergleichNKFinanziert(immobilie, finanzierung, nebenkosten)
      : null
  };
}

// Hilfsfunktion: Vergleich wenn NK mitfinanziert werden
function berechneVergleichNKFinanziert(immobilie, finanzierung, nebenkosten) {
  const ekOhneNK = finanzierung.eigenkapital;
  const ekMitNK = finanzierung.eigenkapital + nebenkosten.gesamt.betrag;
  
  // Bei NK-Finanzierung: Höhere Kreditsumme = mehr Zinsen
  const mehrZinsen = nebenkosten.gesamt.betrag * (finanzierung.zinssatz || 0.038);
  
  return {
    hinweis: '💡 VERGLEICH: Was wenn du NK mitfinanzierst?',
    eigenkapitalReduktion: nebenkosten.gesamt.betrag,
    eigenkapitalNeu: ekOhneNK,
    mehrZinsenProJahr: Math.round(mehrZinsen),
    fazit: mehrZinsen < 2000 
      ? `Nur ${Math.round(mehrZinsen)}€ mehr Zinsen/Jahr - könnte sich lohnen, um EK für weitere Objekte zu haben!`
      : `${Math.round(mehrZinsen)}€ mehr Zinsen/Jahr - eher NK aus EK zahlen.`
  };
}
```

---

## 📊 BEISPIEL-OUTPUT: Komplette ROE-Analyse

```
═══════════════════════════════════════════════════════════════════════════════
📊 EIGENKAPITALRENDITE-ANALYSE
═══════════════════════════════════════════════════════════════════════════════

🏠 OBJEKT: Reihenhaus Poppenbüttel, 120m²
├─ Kaufpreis: 520.000€
└─ Kaltmiete: 1.800€/Monat

💰 KAUFNEBENKOSTEN (Hamburg):
├─ Grunderwerbsteuer (5,5%):         28.600€
├─ Notar & Grundbuch (~2,0%):        10.400€
├─ Makler (3,57% Käuferanteil):      18.564€
├─ ─────────────────────────────────────────
└─ GESAMT (11,1%):                   57.564€

═══════════════════════════════════════════════════════════════════════════════

💵 DEIN EIGENKAPITAL-EINSATZ:

┌─────────────────────────────────────────────────────────────────────────────┐
│ VARIANTE A: Nebenkosten aus Eigenkapital                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Anzahlung (20%):              104.000€                                     │
│ + Kaufnebenkosten:             57.564€                                     │
│ ════════════════════════════════════════                                   │
│ EIGENKAPITAL GESAMT:          161.564€                                     │
│ Kreditsumme:                  416.000€                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ VARIANTE B: Nebenkosten mitfinanzieren (110%-Finanzierung)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Anzahlung (20%):              104.000€                                     │
│ + Kaufnebenkosten:                  0€ (werden mitfinanziert)              │
│ ════════════════════════════════════════                                   │
│ EIGENKAPITAL GESAMT:          104.000€                                     │
│ Kreditsumme:                  473.564€ (inkl. NK)                          │
│                                                                             │
│ ⚠️ Mehrkosten: +2.187€ Zinsen/Jahr (bei 3,8%)                              │
│ ✅ Vorteil: 57.564€ EK bleibt für weitere Investments!                     │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

📈 EIGENKAPITALRENDITE (ROE):

┌─────────────────────────────────────────────────────────────────────────────┐
│                           │ Variante A      │ Variante B                   │
│                           │ (NK aus EK)     │ (NK finanziert)              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Eingesetztes EK:          │ 161.564€        │ 104.000€                     │
│ Cashflow/Jahr:            │ +1.200€         │ -987€                        │
│ + Tilgung/Jahr:           │ +8.320€         │ +9.471€                      │
│ + Wertsteigerung (2%):    │ +10.400€        │ +10.400€                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ROE (nur Cashflow):       │ 0,7% 🔴         │ -0,9% 🔴🔴                    │
│ ROE (inkl. Tilgung):      │ 5,9% 🟡         │ 8,2% 🟢                       │
│ ROE (komplett):           │ 12,3% 🟢        │ 18,2% 🟢🟢                    │
└─────────────────────────────────────────────────────────────────────────────┘

💡 FAZIT:
Variante B (NK mitfinanzieren) hat eine HÖHERE Eigenkapitalrendite!
Obwohl der Cashflow negativ ist, baust du mit weniger EK mehr Vermögen auf.
Das gesparte EK (57.564€) könntest du für eine weitere Immobilie nutzen!

═══════════════════════════════════════════════════════════════════════════════
```

---

## 🎯 INTEGRATION IN DIE ANALYSE

Bei JEDER Immobilien-Analyse MUSS die KI jetzt ausgeben:

```javascript
function komplettAnalyse(immobilie, finanzierung, userProfil) {
  // ... bisherige Analyse ...
  
  // NEU: Kaufnebenkosten berechnen
  const nebenkosten = berechneKaufnebenkosten(
    immobilie.kaufpreis,
    immobilie.bundesland,
    immobilie.mitMakler
  );
  
  // NEU: ROE berechnen (beide Varianten!)
  const roeAnalyseNKausEK = berechneEigenkapitalrendite(
    immobilie, finanzierung, nebenkosten, { nebenkostenAusEK: true }
  );
  
  const roeAnalyseNKfinanziert = berechneEigenkapitalrendite(
    immobilie, finanzierung, nebenkosten, { nebenkostenAusEK: false }
  );
  
  return {
    // ... bisherige Ergebnisse ...
    
    // NEU
    kaufnebenkosten: nebenkosten,
    eigenkapitalrendite: {
      variante_NK_aus_EK: roeAnalyseNKausEK,
      variante_NK_finanziert: roeAnalyseNKfinanziert,
      empfehlung: empfehleROEVariante(roeAnalyseNKausEK, roeAnalyseNKfinanziert, userProfil)
    }
  };
}

function empfehleROEVariante(varianteA, varianteB, userProfil) {
  // Wenn User mehrere Objekte plant: NK finanzieren für mehr Hebelwirkung
  if (userProfil.ziel === 'portfolio_aufbau') {
    return {
      empfehlung: 'Variante B (NK mitfinanzieren)',
      grund: 'Du willst mehrere Objekte kaufen → halte EK-Reserve für weitere Deals!'
    };
  }
  
  // Wenn User auf Cashflow angewiesen ist
  if (userProfil.ziel === 'cashflow') {
    return {
      empfehlung: 'Variante A (NK aus EK)',
      grund: 'Du brauchst positiven Cashflow → weniger Kredit = weniger Zinsen'
    };
  }
  
  // Wenn Cashflow in beiden Fällen negativ: Variante A sicherer
  if (varianteA.cashflow.monatlich < 0 && varianteB.cashflow.monatlich < 0) {
    return {
      empfehlung: 'Variante A (NK aus EK)',
      grund: 'Bei negativem Cashflow: lieber weniger Kredit für mehr Sicherheit'
    };
  }
  
  // Default: Höhere ROE gewinnt
  if (varianteB.eigenkapitalrendite.inklTilgung.wert > varianteA.eigenkapitalrendite.inklTilgung.wert + 2) {
    return {
      empfehlung: 'Variante B (NK mitfinanzieren)',
      grund: `${(varianteB.eigenkapitalrendite.inklTilgung.wert - varianteA.eigenkapitalrendite.inklTilgung.wert).toFixed(1)}% höhere EK-Rendite!`
    };
  }
  
  return {
    empfehlung: 'Variante A (NK aus EK)',
    grund: 'Solide Variante mit weniger Risiko'
  };
}
```

---

## 🔍 LIVE-MARKTDATEN-RECHERCHE (PFLICHT!)

### Das Problem mit statischen Daten

```
❌ FALSCH (alte Methode):
const PREISE = { 'hamburg': 6000 };  // Veraltet, zu ungenau!

✅ RICHTIG (neue Methode):
→ KI recherchiert LIVE für jeden Stadtteil + Immobilientyp!
```

**Warum Live-Recherche?**
- Hamburg hat ~100 Stadtteile mit KOMPLETT unterschiedlichen Preisen
- Poppenbüttel ≠ Harburg ≠ Blankenese (Faktor 2-4x Unterschied!)
- Reihenhaus ≠ Wohnung ≠ Einfamilienhaus (verschiedene €/m²)
- Preise ändern sich quartalsweise

---

### 🚀 LIVE-RECHERCHE-PROTOKOLL

**Bei JEDER Immobilien-Analyse MUSS die KI zuerst recherchieren!**

```javascript
async function recherchiereMarktdaten(immobilie) {
  const { stadtteil, stadt, typ, wohnflaeche } = immobilie;
  
  // ═══════════════════════════════════════════════════════════════
  // SCHRITT 1: KAUFPREISE RECHERCHIEREN
  // ═══════════════════════════════════════════════════════════════
  
  const kaufpreisQuery = buildSearchQuery({
    terms: [stadtteil, stadt, typ, 'kaufen', 'Quadratmeterpreis', '€/m²', '2025'],
    beispiel: 'Poppenbüttel Hamburg Reihenhaus kaufen Quadratmeterpreis 2025'
  });
  
  // Suche ausführen und Ergebnisse parsen
  const kaufpreisErgebnisse = await webSearch(kaufpreisQuery);
  
  // ═══════════════════════════════════════════════════════════════
  // SCHRITT 2: MIETPREISE RECHERCHIEREN
  // ═══════════════════════════════════════════════════════════════
  
  const mietpreisQuery = buildSearchQuery({
    terms: [stadtteil, stadt, typ, 'mieten', 'Mietpreis', '€/m²', '2025'],
    beispiel: 'Poppenbüttel Hamburg Haus mieten Mietpreis 2025'
  });
  
  const mietpreisErgebnisse = await webSearch(mietpreisQuery);
  
  // ═══════════════════════════════════════════════════════════════
  // SCHRITT 3: VERGLEICHSANGEBOTE FINDEN
  // ═══════════════════════════════════════════════════════════════
  
  const vergleichQuery = buildSearchQuery({
    terms: [stadtteil, stadt, typ, wohnflaeche + 'm²', 'kaufen'],
    beispiel: 'Poppenbüttel Hamburg Reihenhaus 120m² kaufen'
  });
  
  const vergleichsAngebote = await webSearch(vergleichQuery);
  
  return {
    kaufpreise: parseKaufpreise(kaufpreisErgebnisse),
    mietpreise: parseMietpreise(mietpreisErgebnisse),
    vergleichsAngebote: parseAngebote(vergleichsAngebote)
  };
}
```

---

### 📋 SUCH-QUERIES NACH IMMOBILIENTYP

**Die KI MUSS den Immobilientyp in der Suche berücksichtigen!**

| Immobilientyp | Such-Query Kaufpreis | Such-Query Miete |
|---------------|---------------------|------------------|
| **ETW** | "[Stadtteil] [Stadt] Eigentumswohnung kaufen €/m² 2025" | "[Stadtteil] Wohnung mieten Mietpreis" |
| **Reihenhaus** | "[Stadtteil] [Stadt] Reihenhaus kaufen Quadratmeterpreis" | "[Stadtteil] Haus mieten €/m²" |
| **Doppelhaushälfte** | "[Stadtteil] Doppelhaushälfte kaufen Preis" | "[Stadtteil] Haus mieten" |
| **Einfamilienhaus** | "[Stadtteil] Einfamilienhaus kaufen €/m²" | "[Stadtteil] EFH mieten" |
| **Mehrfamilienhaus** | "[Stadtteil] Mehrfamilienhaus kaufen Rendite" | "[Stadtteil] Mieteinnahmen MFH" |

---

### 🎯 DATENQUELLEN PRIORISIEREN

**Vertrauenswürdige Quellen (in dieser Reihenfolge):**

1. **ImmoScout24 Atlas** → `atlas.immobilienscout24.de` (beste Daten!)
2. **Immoportal** → `immoportal.com/immobilienpreise/`
3. **Homeday Preisatlas** → `homeday.de/de/preisatlas/`
4. **Engel & Völkers** → `engelvoelkers.com/de-de/mietspiegel/`
5. **Kleinanzeigen** → Für echte Angebote zum Vergleich

**Was aus den Quellen extrahieren:**

```javascript
const EXTRAHIERE = {
  // Aus ImmoScout24:
  'durchschnittlicher Kaufpreis': 'Ø X.XXX €/m²',
  'Preisspanne': 'X.XXX - X.XXX €/m²',
  'Preisentwicklung': '+X,X% zu Vorjahr',
  
  // Aus Mietspiegel:
  'durchschnittliche Kaltmiete': 'Ø XX,XX €/m²',
  'Mietspanne': 'XX - XX €/m²',
  
  // Aus Angeboten:
  'konkrete Objekte': [
    { preis: 'XXX.XXX€', flaeche: 'XXm²', zustand: '...', energie: '...' }
  ]
};
```

---

### 📊 ERGEBNIS-VERARBEITUNG

```javascript
function verarbeiteRecherche(ergebnisse, userImmobilie) {
  // ═══════════════════════════════════════════════════════════════
  // 1. KAUFPREIS-BENCHMARK ERMITTELN
  // ═══════════════════════════════════════════════════════════════
  
  const marktKaufpreisProQm = ergebnisse.kaufpreise.durchschnitt;
  const marktKaufpreisSpanne = ergebnisse.kaufpreise.spanne;
  
  // Geschätzter Marktwert
  const geschaetzterMarktwert = userImmobilie.wohnflaeche * marktKaufpreisProQm;
  
  // ═══════════════════════════════════════════════════════════════
  // 2. MIET-BENCHMARK ERMITTELN
  // ═══════════════════════════════════════════════════════════════
  
  const marktMieteProQm = ergebnisse.mietpreise.durchschnitt;
  const geschaetzteMarktmiete = userImmobilie.wohnflaeche * marktMieteProQm;
  
  // ═══════════════════════════════════════════════════════════════
  // 3. MIT USER-DATEN VERGLEICHEN
  // ═══════════════════════════════════════════════════════════════
  
  const userKaufpreisProQm = userImmobilie.kaufpreis / userImmobilie.wohnflaeche;
  const kaufpreisVergleich = {
    userPreis: userKaufpreisProQm,
    marktPreis: marktKaufpreisProQm,
    differenz: marktKaufpreisProQm - userKaufpreisProQm,
    differenzProzent: ((marktKaufpreisProQm - userKaufpreisProQm) / marktKaufpreisProQm) * 100,
    bewertung: getBewertung(userKaufpreisProQm, marktKaufpreisProQm)
  };
  
  const userMieteProQm = userImmobilie.kaltmiete / userImmobilie.wohnflaeche;
  const mietVergleich = {
    userMiete: userMieteProQm,
    marktMiete: marktMieteProQm,
    mietpotenzial: geschaetzteMarktmiete - userImmobilie.kaltmiete,
    bewertung: userMieteProQm >= marktMieteProQm ? 'Auf Marktniveau' : 'Steigerungspotenzial!'
  };
  
  return {
    kaufpreis: kaufpreisVergleich,
    miete: mietVergleich,
    marktwert: geschaetzterMarktwert,
    marktmiete: geschaetzteMarktmiete,
    quellen: ergebnisse.quellen,
    rechercheZeitpunkt: new Date().toISOString()
  };
}

function getBewertung(userPreis, marktPreis) {
  const diff = ((marktPreis - userPreis) / marktPreis) * 100;
  
  if (diff >= 20) return { ampel: '🟢🟢', text: 'SCHNÄPPCHEN!', beschreibung: '20%+ unter Marktwert!' };
  if (diff >= 15) return { ampel: '🟢🟢', text: 'Sehr günstig', beschreibung: '15-20% unter Marktwert' };
  if (diff >= 10) return { ampel: '🟢', text: 'Günstig', beschreibung: '10-15% unter Marktwert' };
  if (diff >= 5) return { ampel: '🟢', text: 'Leicht günstig', beschreibung: '5-10% unter Marktwert' };
  if (diff >= 0) return { ampel: '🟡', text: 'Marktpreis', beschreibung: 'Fairer Preis' };
  if (diff >= -5) return { ampel: '🟠', text: 'Leicht teuer', beschreibung: 'Bis 5% über Markt' };
  if (diff >= -10) return { ampel: '🔴', text: 'Teuer', beschreibung: '5-10% über Markt' };
  return { ampel: '🔴🔴', text: 'Zu teuer!', beschreibung: '10%+ über Marktwert' };
}
```

---

### 🖥️ BEISPIEL: KOMPLETTE LIVE-ANALYSE

**User-Eingabe:**
```
Adresse: Wesselstraße, Poppenbüttel, Hamburg
Typ: Reihenhaus
Wohnfläche: 120m²
Kaufpreis: 520.000€
Kaltmiete: 1.800€
```

**KI führt aus:**

```
🔍 LIVE-RECHERCHE GESTARTET...

Suche 1: "Poppenbüttel Hamburg Reihenhaus kaufen Quadratmeterpreis 2025"
→ Gefunden: ImmoScout24 Atlas - Ø 4.941 €/m² für Häuser
→ Gefunden: Immoportal - 4.211 - 6.491 €/m² (Ø 5.351€)
→ Gefunden: 3 aktuelle Angebote zum Vergleich

Suche 2: "Poppenbüttel Hamburg Haus mieten Mietpreis 2025"
→ Gefunden: ImmoScout24 - Ø 17,08 €/m² Kaltmiete
→ Gefunden: Engel & Völkers - 18,89 €/m²

✅ RECHERCHE ABGESCHLOSSEN (4 Quellen, Stand: Januar 2026)
```

**Analyse-Ergebnis:**

```
═══════════════════════════════════════════════════════════════════════════════
📊 MARKTPREIS-VERGLEICH: Wesselstraße, Poppenbüttel
═══════════════════════════════════════════════════════════════════════════════

🏠 KAUFPREIS-ANALYSE
├─ Dein Kaufpreis: 520.000€ (4.333 €/m²)
├─ Markt-Durchschnitt: 592.920€ (4.941 €/m²)
├─ Markt-Spanne: 505.320€ - 778.920€
├─ 
├─ DIFFERENZ: 72.920€ UNTER MARKTWERT
├─ Das sind: 12,3% unter Markt
└─ BEWERTUNG: 🟢 Günstig!

💰 INSTANT EQUITY
├─ Du kaufst 72.920€ unter Marktwert
├─ Bei 10 Jahren Haltedauer = 7.292€/Jahr = 608€/Monat virtueller Gewinn
└─ Das gleicht negativen Cashflow aus!

📈 MIET-ANALYSE
├─ Deine Kaltmiete: 1.800€ (15,00 €/m²)
├─ Markt-Durchschnitt: 2.050€ (17,08 €/m²)
├─ 
├─ MIETPOTENZIAL: +250€/Monat möglich!
└─ Nach Mieterhöhung: Cashflow verbessert sich um 250€

📊 KAUFPREISFAKTOR
├─ Aktueller Faktor: 520.000 ÷ (1.800 × 12) = 24,1
├─ Regional üblich: 24-28
└─ BEWERTUNG: 🟢 Im Rahmen

═══════════════════════════════════════════════════════════════════════════════

🎯 DEAL-SCORE: 78/100 🟢 "Guter Deal!"

├─ Unter Marktwert: 28/40 Punkte (12,3% Rabatt)
├─ Kaufpreisfaktor: 14/20 Punkte (Faktor 24,1 OK)
├─ Mietpotenzial: 12/15 Punkte (+250€ möglich)
└─ Exit-Optionen: 12/15 Punkte (Reihenhaus gut verkäuflich)

Quellen: ImmoScout24, Immoportal, Engel & Völkers (Stand: Jan 2026)

═══════════════════════════════════════════════════════════════════════════════
```

---

### ⚠️ FALLBACK WENN RECHERCHE FEHLSCHLÄGT

```javascript
function fallbackBeiRechercheFehlschlag(immobilie, fehler) {
  return {
    warnung: true,
    meldung: `
⚠️ LIVE-RECHERCHE NICHT MÖGLICH

Grund: ${fehler}

FALLBACK-OPTIONEN:
1. Bitte gib den geschätzten Marktwert manuell ein
2. Oder: Schau auf ImmoScout24 nach vergleichbaren Objekten in ${immobilie.stadtteil}
   → Suche: "${immobilie.typ} ${immobilie.stadtteil} ${immobilie.wohnflaeche}m² kaufen"
3. Oder: Wir nutzen den Stadt-Durchschnitt (UNGENAU!)

Ohne genaue Marktdaten kann der Deal-Score nicht zuverlässig berechnet werden.
    `,
    optionen: {
      manuell: 'User gibt Marktwert ein',
      stadtDurchschnitt: getStadtDurchschnitt(immobilie.stadt),
      ohneMarktwert: 'Nur Investment-Score berechnen (ohne Deal-Score)'
    }
  };
}
```

---

### 📱 FÜR DIE APP: API-ALTERNATIVEN

**Wenn Web-Scraping nicht möglich ist:**

| Option | Kosten | Genauigkeit | Aufwand |
|--------|--------|-------------|---------|
| **User gibt Marktwert ein** | Kostenlos | Hoch (wenn User recherchiert) | Gering |
| **Sprengnetter API** | ~300€/Monat | Sehr hoch | Mittel |
| **PriceHubble API** | Enterprise | Sehr hoch | Mittel |
| **GREIX (kostenlos)** | Kostenlos | Mittel (nur Indizes) | Gering |
| **Web Scraping** | Kostenlos | Hoch | Hoch |

**Empfehlung für MVP:**
1. User gibt geschätzten Marktwert ein
2. ODER KI schlägt Recherche-Links vor (ImmoScout, Immoportal)
3. Später: API-Integration

---

**Datum:** Januar 2026

### Was wurde verbessert?

| Bereich | Alt (V1) | Neu (V2) | Warum |
|---------|----------|----------|-------|
| **Cashflow-Bewertung** | 0€ = "Gut" (Score 70) | 0€ = "Grenzwertig" (Score 55) | Kapitalanleger brauchen Puffer! |
| **Rendite-Bewertung** | Pauschal (4% = gut) | Regional angepasst | München ≠ Leipzig! |
| **Risiko-Puffer** | Nicht vorhanden | 100€/Monat eingerechnet | Für Reparaturen, Leerstand |
| **Worst-Case** | Nicht angezeigt | PFLICHT bei jeder Analyse | User muss Risiken kennen! |
| **Denkmal-Bewertung** | -10 Punkte (Malus) | +3 Punkte (Bonus!) | 100% AfA in 12 Jahren! |
| **Erbpacht** | -30 Punkte pauschal | Differenziert nach Restlaufzeit | 80 Jahre ≠ 30 Jahre |
| **Kredit-Chance** | Nur EK-basiert | + Beruf, Alter, Objektqualität | Realistischere Einschätzung |
| **Lage-Bewertung** | A/B/C/D pauschal | Mikrolage-Faktoren | ÖPNV, Infrastruktur, etc. |

### 🆕 V3.0 UPDATE - PROFESSIONELLES DUAL-SCORE SYSTEM

| Bereich | Alt (V2) | Neu (V3) | Warum |
|---------|----------|----------|-------|
| **Score-System** | Ein Score (0-100) | ZWEI Scores: Deal + Investment | Profis trennen "guter Preis" von "gutes Objekt" |
| **Marktwert** | Nicht berücksichtigt | Automatische Schätzung + Vergleich | Unter Marktwert kaufen = sofortiger Gewinn! |
| **Instant Equity** | Nicht vorhanden | Wird auf Haltedauer umgerechnet | €10k unter Marktwert = €83/Monat virtueller CF |
| **Negative CF Regel** | Immer schlecht | Akzeptabel wenn Discount stimmt | €15-20k Discount pro €100/Monat neg. CF |
| **4 Rendite-Quellen** | Nur Cashflow | CF + Tilgung + Wertsteigerung + Steuer | Komplette Vermögensbildung |

---

## 🏆 PROFESSIONELLES DUAL-SCORE BEWERTUNGSSYSTEM V3.0

### Philosophie: Profis trennen DEAL von INVESTMENT!

**Warren Buffett:** *"Price is what you pay, value is what you get."*

Ein **guter Deal** (unter Marktwert kaufen) auf einem mittelmäßigen Objekt
kann besser sein als ein **schlechter Deal** auf einem Top-Objekt!

```
BEISPIEL:
┌─────────────────────────────────────────────────────────────┐
│ OBJEKT A: Tolle Lage, aber zu teuer                        │
│ • Marktwert: 300.000€ | Kaufpreis: 310.000€ (+3%)          │
│ • Cashflow: +50€/Monat                                      │
│ • Deal-Score: 25/100 ❌ | Investment-Score: 75/100 ✅       │
│ → FINGER WEG - du zahlst drauf!                            │
├─────────────────────────────────────────────────────────────┤
│ OBJEKT B: Okay Lage, aber Schnäppchen                      │
│ • Marktwert: 280.000€ | Kaufpreis: 238.000€ (-15%)         │
│ • Cashflow: -80€/Monat                                      │
│ • Deal-Score: 85/100 ✅ | Investment-Score: 55/100 🟡       │
│ → KAUFEN! Instant Equity von 42.000€ deckt neg. CF 44 Jahre│
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 DIE ZWEI SCORES ERKLÄRT

### Score 1: DEAL-SCORE (Transaktions-Qualität)

**Fragt:** *"Ist das ein guter PREIS für dieses Objekt?"*

| Komponente | Gewicht | Was wird bewertet |
|------------|---------|-------------------|
| **Unter Marktwert** | 35 Punkte | Der wichtigste Faktor! |
| **Kaufpreisfaktor vs. Region** | 20 Punkte | Faktor 22 in Frankfurt = gut |
| **Verhandlungspotenzial** | 15 Punkte | Steht lange, Verkäufer motiviert? |
| **Transaktionskosten** | 10 Punkte | Makler sparen, Bundesland |
| **Finanzierbarkeit** | 10 Punkte | Bank akzeptiert den Preis? |
| **Exit-Optionen** | 10 Punkte | Wiederverkäuflichkeit |

### Score 2: INVESTMENT-SCORE (Objekt-Qualität)

**Fragt:** *"Ist das langfristig ein gutes Investment?"*

| Komponente | Gewicht | Was wird bewertet |
|------------|---------|-------------------|
| **Lage-Qualität** | 25 Punkte | Mikrolage, nicht nur Stadt |
| **Cashflow-Potenzial** | 20 Punkte | Inkl. Mietsteigerungspotenzial |
| **Objektzustand** | 15 Punkte | Sanierungsbedarf, Energie |
| **Wertsteigerungspotenzial** | 15 Punkte | Entwicklungsgebiet, Aufwertung |
| **Mieter-/Nachfragequalität** | 15 Punkte | Leerstandsrisiko |
| **Risikofaktoren** | 10 Punkte | WEG, Erbpacht, Altlasten |

### GESAMT-SCORE Berechnung

```javascript
// Gewichtung je nach Strategie
const STRATEGIE_GEWICHTUNG = {
  'buy_and_hold': { deal: 0.40, investment: 0.60 },  // Langfrist-Investor
  'value_add': { deal: 0.60, investment: 0.40 },     // Wertsteigerung
  'cashflow': { deal: 0.35, investment: 0.65 },      // Einkommens-fokussiert
  'flip': { deal: 0.70, investment: 0.30 },          // Schneller Verkauf
  'default': { deal: 0.50, investment: 0.50 }        // Ausgewogen
};

function berechneGesamtScore(dealScore, investmentScore, strategie = 'default') {
  const gewichtung = STRATEGIE_GEWICHTUNG[strategie];
  return Math.round(
    dealScore * gewichtung.deal + 
    investmentScore * gewichtung.investment
  );
}
```

---

## 💰 MARKTWERT-SCHÄTZUNG (Automatisch!)

### Drei Methoden kombiniert

```javascript
function schaetzeMarktwert(immobilie) {
  const ergebnisse = {};
  
  // ═══════════════════════════════════════════════════════════
  // METHODE 1: ERTRAGSWERT (für Kapitalanleger am wichtigsten!)
  // ═══════════════════════════════════════════════════════════
  
  const jahresreinertrag = (immobilie.kaltmiete * 12) - 
    (immobilie.nichtUmlagefaehigesHausgeld * 12) -
    (immobilie.instandhaltung || immobilie.wohnflaeche * 12); // 12€/m²/Jahr
  
  // Liegenschaftszins nach Region (Gutachterausschuss-Werte 2025)
  const liegenschaftszins = LIEGENSCHAFTSZINSEN[immobilie.stadt] || 0.045;
  
  // Vereinfachte Ertragswertformel
  const ertragswert = jahresreinertrag / liegenschaftszins;
  
  ergebnisse.ertragswert = {
    wert: Math.round(ertragswert),
    methode: 'Ertragswertverfahren',
    erklaerung: `Reinertrag ${jahresreinertrag.toLocaleString()}€ ÷ ${(liegenschaftszins*100).toFixed(1)}% Liegenschaftszins`
  };
  
  // ═══════════════════════════════════════════════════════════
  // METHODE 2: VERGLEICHSWERT (€/m² der Region)
  // ═══════════════════════════════════════════════════════════
  
  const regionPreis = getRegionalenQuadratmeterpreis(immobilie.stadt, immobilie.plz);
  
  // Anpassungsfaktoren
  let anpassung = 1.0;
  if (immobilie.zustand === 'Saniert' || immobilie.zustand === 'Neubau') anpassung += 0.10;
  if (immobilie.zustand === 'Renovierungsbedürftig') anpassung -= 0.15;
  if (['A', 'B', 'C'].includes(immobilie.energieKlasse)) anpassung += 0.05;
  if (['F', 'G', 'H'].includes(immobilie.energieKlasse)) anpassung -= 0.10;
  if (immobilie.balkon || immobilie.terrasse) anpassung += 0.03;
  if (immobilie.aufzug) anpassung += 0.02;
  if (immobilie.stellplatz) anpassung += 0.02;
  
  const vergleichswert = regionPreis * anpassung * immobilie.wohnflaeche;
  
  ergebnisse.vergleichswert = {
    wert: Math.round(vergleichswert),
    methode: 'Vergleichswertverfahren',
    regionPreis: regionPreis,
    anpassung: anpassung,
    erklaerung: `${regionPreis.toLocaleString()}€/m² × ${anpassung.toFixed(2)} × ${immobilie.wohnflaeche}m²`
  };
  
  // ═══════════════════════════════════════════════════════════
  // METHODE 3: KAUFPREISFAKTOR-BASIERT
  // ═══════════════════════════════════════════════════════════
  
  const regionFaktor = getRegionalenKaufpreisfaktor(immobilie.stadt);
  const faktorBasiert = immobilie.kaltmiete * 12 * regionFaktor;
  
  ergebnisse.faktorBasiert = {
    wert: Math.round(faktorBasiert),
    methode: 'Kaufpreisfaktor-Methode',
    faktor: regionFaktor,
    erklaerung: `${(immobilie.kaltmiete * 12).toLocaleString()}€ Jahresmiete × Faktor ${regionFaktor}`
  };
  
  // ═══════════════════════════════════════════════════════════
  // GEWICHTETER DURCHSCHNITT
  // ═══════════════════════════════════════════════════════════
  
  // Für Kapitalanleger: Ertragswert am wichtigsten
  const gewichteterMarktwert = Math.round(
    ergebnisse.ertragswert.wert * 0.45 +
    ergebnisse.vergleichswert.wert * 0.35 +
    ergebnisse.faktorBasiert.wert * 0.20
  );
  
  return {
    geschaetzterMarktwert: gewichteterMarktwert,
    methoden: ergebnisse,
    konfidenz: berechneKonfidenz(ergebnisse),
    datenquellen: ['Liegenschaftszins aus Gutachterausschuss', 'Regionale €/m²-Preise', 'Marktübliche Faktoren']
  };
}

// Regionale Liegenschaftszinsen (Gutachterausschuss 2025)
const LIEGENSCHAFTSZINSEN = {
  'muenchen': 0.028,      // 2.8% - sehr niedrig wegen hoher Nachfrage
  'frankfurt': 0.032,     // 3.2%
  'hamburg': 0.030,       // 3.0%
  'berlin': 0.033,        // 3.3%
  'duesseldorf': 0.035,   // 3.5%
  'koeln': 0.035,         // 3.5%
  'stuttgart': 0.032,     // 3.2%
  'nuernberg': 0.040,     // 4.0%
  'hannover': 0.040,      // 4.0%
  'leipzig': 0.045,       // 4.5%
  'dresden': 0.043,       // 4.3%
  'dortmund': 0.050,      // 5.0%
  'essen': 0.050,         // 5.0%
  'duisburg': 0.055,      // 5.5%
  'default': 0.045        // 4.5% Standard
};

// Regionale Durchschnittspreise €/m² (Stand Q1 2025)
const REGIONALE_QM_PREISE = {
  'muenchen': 8800,
  'frankfurt': 5500,
  'hamburg': 5800,
  'berlin': 4800,
  'duesseldorf': 4200,
  'koeln': 4000,
  'stuttgart': 4800,
  'nuernberg': 3500,
  'hannover': 3200,
  'leipzig': 2800,
  'dresden': 2600,
  'dortmund': 2200,
  'essen': 2100,
  'duisburg': 1800,
  'default': 3000
};

// Regionale Kaufpreisfaktoren (Marktüblich 2025)
const REGIONALE_FAKTOREN = {
  'muenchen': 32,
  'frankfurt': 28,
  'hamburg': 29,
  'berlin': 27,
  'duesseldorf': 26,
  'koeln': 26,
  'stuttgart': 28,
  'nuernberg': 24,
  'hannover': 23,
  'leipzig': 20,
  'dresden': 21,
  'dortmund': 17,
  'essen': 17,
  'duisburg': 15,
  'default': 22
};
```

---

## 🎯 INSTANT EQUITY - Der Schlüssel zur Bewertung!

### Was ist Instant Equity?

**Instant Equity** = Marktwert - Kaufpreis = Sofortiger Buchgewinn

```
BEISPIEL:
Marktwert:  280.000€
Kaufpreis:  238.000€
─────────────────────
Instant Equity: 42.000€ (15% unter Marktwert!)
```

### Instant Equity auf Cashflow umrechnen

```javascript
function berechneInstantEquityWert(kaufpreis, marktwert, haltedauerJahre = 10) {
  const instantEquity = marktwert - kaufpreis;
  const instantEquityProzent = (instantEquity / marktwert) * 100;
  
  // Auf Haltedauer umrechnen → "virtueller monatlicher Cashflow"
  const jaehrlichEquivalent = instantEquity / haltedauerJahre;
  const monatlichEquivalent = jaehrlichEquivalent / 12;
  
  return {
    instantEquity,
    instantEquityProzent: Math.round(instantEquityProzent * 10) / 10,
    monatlichEquivalent: Math.round(monatlichEquivalent),
    jaehrlichEquivalent: Math.round(jaehrlichEquivalent),
    erklaerung: `${instantEquity.toLocaleString()}€ Instant Equity ÷ ${haltedauerJahre} Jahre = ${Math.round(monatlichEquivalent)}€/Monat virtueller Cashflow`
  };
}

// BEISPIEL:
// 42.000€ Instant Equity ÷ 10 Jahre = 4.200€/Jahr = 350€/Monat virtuell!
// → Bei -80€ tatsächlichem Cashflow: Netto +270€/Monat Wertschöpfung!
```

---

## 📏 NEGATIVE CASHFLOW SCHWELLE - Wann ist es noch OK?

### Die Profi-Regel

**Für jeden €100/Monat negativen Cashflow brauchst du €15.000-20.000 Instant Equity!**

```javascript
function bewerteNegativenCashflow(cashflowMonat, instantEquity) {
  if (cashflowMonat >= 0) {
    return {
      akzeptabel: true,
      bewertung: '🟢 Positiver Cashflow – kein Problem!',
      benoetigt: 0
    };
  }
  
  const negativerCashflowJahr = Math.abs(cashflowMonat) * 12;
  const benoetigteEquity = Math.abs(cashflowMonat) * 175; // €17.500 pro €100
  
  const deckung = instantEquity / benoetigteEquity;
  
  if (deckung >= 1.5) {
    return {
      akzeptabel: true,
      bewertung: '🟢 Instant Equity deckt negativen CF mehr als genug!',
      deckungsgrad: Math.round(deckung * 100),
      erklaerung: `${instantEquity.toLocaleString()}€ Instant Equity deckt ${negativerCashflowJahr.toLocaleString()}€/Jahr negativen CF für ${Math.round(instantEquity / negativerCashflowJahr)} Jahre!`
    };
  }
  
  if (deckung >= 1.0) {
    return {
      akzeptabel: true,
      bewertung: '🟡 Instant Equity deckt negativen CF – gerade so',
      deckungsgrad: Math.round(deckung * 100),
      warnung: 'Wenig Puffer für Unvorhergesehenes'
    };
  }
  
  if (deckung >= 0.5) {
    return {
      akzeptabel: false,
      bewertung: '🟠 Instant Equity deckt negativen CF nur teilweise',
      deckungsgrad: Math.round(deckung * 100),
      empfehlung: `Preis um ${Math.round((benoetigteEquity - instantEquity) / 1000)}k verhandeln!`
    };
  }
  
  return {
    akzeptabel: false,
    bewertung: '🔴 Zu wenig Discount für den negativen Cashflow!',
    deckungsgrad: Math.round(deckung * 100),
    empfehlung: `Mindestens ${benoetigteEquity.toLocaleString()}€ unter Marktwert kaufen, aktuell nur ${instantEquity.toLocaleString()}€`
  };
}
```

---

## 📊 DIE 4 RENDITE-QUELLEN (Komplett-Betrachtung!)

### Profis schauen nicht nur auf Cashflow!

```javascript
function berechneGesamtRendite(immobilie, finanzierung, steuerInfo) {
  const haltedauer = 10; // Jahre
  
  // ═══════════════════════════════════════════════════════════
  // QUELLE 1: CASHFLOW
  // ═══════════════════════════════════════════════════════════
  const cashflowJahr = immobilie.cashflow * 12;
  const cashflowGesamt = cashflowJahr * haltedauer;
  
  // ═══════════════════════════════════════════════════════════
  // QUELLE 2: TILGUNG (Equity Buildup durch Schuldenabbau)
  // ═══════════════════════════════════════════════════════════
  const tilgungGesamt = berechneTilgungUeber(finanzierung, haltedauer);
  
  // ═══════════════════════════════════════════════════════════
  // QUELLE 3: WERTSTEIGERUNG
  // ═══════════════════════════════════════════════════════════
  const wertsteigerungRate = getRegionaleWertsteigerung(immobilie.stadt); // z.B. 2%/Jahr
  const endwert = immobilie.kaufpreis * Math.pow(1 + wertsteigerungRate, haltedauer);
  const wertsteigerungGesamt = endwert - immobilie.kaufpreis;
  
  // ═══════════════════════════════════════════════════════════
  // QUELLE 4: STEUERVORTEILE
  // ═══════════════════════════════════════════════════════════
  const steuerersparnisJahr = berechneSteuerersparnis(immobilie, finanzierung, steuerInfo);
  const steuerersparnisGesamt = steuerersparnisJahr * haltedauer;
  
  // ═══════════════════════════════════════════════════════════
  // QUELLE 5 (BONUS): INSTANT EQUITY
  // ═══════════════════════════════════════════════════════════
  const instantEquity = immobilie.marktwert - immobilie.kaufpreis;
  
  // ═══════════════════════════════════════════════════════════
  // GESAMTRENDITE
  // ═══════════════════════════════════════════════════════════
  const gesamtWertschoepfung = 
    cashflowGesamt + 
    tilgungGesamt + 
    wertsteigerungGesamt + 
    steuerersparnisGesamt +
    instantEquity;
  
  const eigenkapitalEinsatz = finanzierung.eigenkapital;
  const equityMultiple = (eigenkapitalEinsatz + gesamtWertschoepfung) / eigenkapitalEinsatz;
  
  // IRR-Annäherung (vereinfacht)
  const annualisierteRendite = Math.pow(equityMultiple, 1/haltedauer) - 1;
  
  return {
    quellen: {
      cashflow: { 
        gesamt: Math.round(cashflowGesamt), 
        proJahr: Math.round(cashflowJahr),
        anteil: Math.round(cashflowGesamt / gesamtWertschoepfung * 100)
      },
      tilgung: { 
        gesamt: Math.round(tilgungGesamt),
        anteil: Math.round(tilgungGesamt / gesamtWertschoepfung * 100)
      },
      wertsteigerung: { 
        gesamt: Math.round(wertsteigerungGesamt),
        rate: wertsteigerungRate,
        anteil: Math.round(wertsteigerungGesamt / gesamtWertschoepfung * 100)
      },
      steuerersparnis: { 
        gesamt: Math.round(steuerersparnisGesamt),
        proJahr: Math.round(steuerersparnisJahr),
        anteil: Math.round(steuerersparnisGesamt / gesamtWertschoepfung * 100)
      },
      instantEquity: {
        gesamt: Math.round(instantEquity),
        prozent: Math.round((instantEquity / immobilie.marktwert) * 100),
        anteil: Math.round(instantEquity / gesamtWertschoepfung * 100)
      }
    },
    zusammenfassung: {
      eigenkapitalEinsatz: Math.round(eigenkapitalEinsatz),
      gesamtWertschoepfung: Math.round(gesamtWertschoepfung),
      endVermoegen: Math.round(eigenkapitalEinsatz + gesamtWertschoepfung),
      equityMultiple: Math.round(equityMultiple * 100) / 100,
      annualisierteRendite: Math.round(annualisierteRendite * 1000) / 10,
      bewertung: bewerteGesamtRendite(equityMultiple, annualisierteRendite)
    }
  };
}

function bewerteGesamtRendite(equityMultiple, annualisierteRendite) {
  if (equityMultiple >= 2.5 || annualisierteRendite >= 0.15) {
    return { ampel: '🟢🟢', text: 'Exzellent', beschreibung: 'Top-Investment!' };
  }
  if (equityMultiple >= 2.0 || annualisierteRendite >= 0.12) {
    return { ampel: '🟢', text: 'Sehr gut', beschreibung: 'Überdurchschnittlich' };
  }
  if (equityMultiple >= 1.7 || annualisierteRendite >= 0.08) {
    return { ampel: '🟡', text: 'Gut', beschreibung: 'Solide Rendite' };
  }
  if (equityMultiple >= 1.4 || annualisierteRendite >= 0.05) {
    return { ampel: '🟠', text: 'Mäßig', beschreibung: 'Unter Durchschnitt' };
  }
  return { ampel: '🔴', text: 'Schlecht', beschreibung: 'Nicht empfehlenswert' };
}
```

---

## 🏆 DEAL-SCORE BERECHNUNG (Komplett!)

```javascript
function berechneDealScore(immobilie) {
  let score = 0;
  const details = {};
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 1: UNTER MARKTWERT (35 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  const marktwert = schaetzeMarktwert(immobilie).geschaetzterMarktwert;
  const discount = (marktwert - immobilie.kaufpreis) / marktwert;
  
  let discountPunkte = 0;
  if (discount >= 0.20) discountPunkte = 35;       // 20%+ unter Marktwert = Jackpot!
  else if (discount >= 0.15) discountPunkte = 30;  // 15-20% = Sehr gut
  else if (discount >= 0.10) discountPunkte = 24;  // 10-15% = Gut
  else if (discount >= 0.05) discountPunkte = 16;  // 5-10% = OK
  else if (discount >= 0) discountPunkte = 8;      // Marktwert = Neutral
  else if (discount >= -0.05) discountPunkte = 4;  // Bis 5% über Marktwert
  else discountPunkte = 0;                          // >5% über Marktwert = Schlecht
  
  details.unterMarktwert = {
    punkte: discountPunkte,
    maxPunkte: 35,
    marktwert: marktwert,
    kaufpreis: immobilie.kaufpreis,
    discount: Math.round(discount * 100),
    instantEquity: marktwert - immobilie.kaufpreis
  };
  score += discountPunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 2: KAUFPREISFAKTOR VS. REGION (20 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  const faktor = immobilie.kaufpreis / (immobilie.kaltmiete * 12);
  const regionFaktor = REGIONALE_FAKTOREN[immobilie.stadt?.toLowerCase()] || 22;
  const faktorDiff = regionFaktor - faktor;
  
  let faktorPunkte = 0;
  if (faktor <= regionFaktor - 5) faktorPunkte = 20;     // 5+ unter Region
  else if (faktor <= regionFaktor - 3) faktorPunkte = 16; // 3-5 unter Region
  else if (faktor <= regionFaktor) faktorPunkte = 12;     // Bis Regional-Niveau
  else if (faktor <= regionFaktor + 3) faktorPunkte = 6;  // Leicht drüber
  else faktorPunkte = 0;                                   // Deutlich drüber
  
  details.kaufpreisfaktor = {
    punkte: faktorPunkte,
    maxPunkte: 20,
    faktor: Math.round(faktor * 10) / 10,
    regionFaktor: regionFaktor,
    bewertung: faktor <= regionFaktor ? '✅ Unter/auf Regionalniveau' : '⚠️ Über Regionalniveau'
  };
  score += faktorPunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 3: VERHANDLUNGSPOTENZIAL (15 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let verhandlungPunkte = 8; // Neutral
  
  if (immobilie.insertDauer > 90) verhandlungPunkte += 4;  // Lange online
  if (immobilie.preisGesenkt) verhandlungPunkte += 3;      // Preis wurde schon gesenkt
  if (immobilie.verkäuferMotiviert) verhandlungPunkte += 3; // Zeitdruck etc.
  if (immobilie.mehrfachBieter) verhandlungPunkte -= 5;    // Konkurrenz
  
  details.verhandlung = {
    punkte: Math.min(15, Math.max(0, verhandlungPunkte)),
    maxPunkte: 15,
    faktoren: []
  };
  score += Math.min(15, Math.max(0, verhandlungPunkte));
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 4: TRANSAKTIONSKOSTEN (10 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let kostenPunkte = 5;
  
  const grstSatz = GRUNDERWERBSTEUER[immobilie.bundesland] || 0.05;
  if (grstSatz <= 0.035) kostenPunkte += 3;  // Bayern/Sachsen
  if (!immobilie.makler) kostenPunkte += 2;   // Kein Makler
  
  details.transaktionskosten = {
    punkte: kostenPunkte,
    maxPunkte: 10,
    grstSatz: grstSatz,
    makler: immobilie.makler
  };
  score += kostenPunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 5: FINANZIERBARKEIT (10 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let finanzPunkte = 7;
  
  if (discount >= 0.10) finanzPunkte += 2;  // Bank liebt Unterwert-Käufe
  if (['A', 'B'].includes(immobilie.lage)) finanzPunkte += 1;
  if (immobilie.baujahr < 1960 && !immobilie.saniert) finanzPunkte -= 3;
  if (immobilie.erbpacht) finanzPunkte -= 2;
  
  details.finanzierbarkeit = {
    punkte: Math.max(0, finanzPunkte),
    maxPunkte: 10
  };
  score += Math.max(0, finanzPunkte);
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 6: EXIT-OPTIONEN (10 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let exitPunkte = 5;
  
  if (['A', 'B'].includes(immobilie.lage)) exitPunkte += 3;
  if (immobilie.wohnflaeche >= 40 && immobilie.wohnflaeche <= 80) exitPunkte += 2; // Gängige Größe
  if (immobilie.erbpacht) exitPunkte -= 2;
  if (immobilie.sozialbindung) exitPunkte -= 2;
  
  details.exitOptionen = {
    punkte: Math.max(0, Math.min(10, exitPunkte)),
    maxPunkte: 10
  };
  score += Math.max(0, Math.min(10, exitPunkte));
  
  // ═══════════════════════════════════════════════════════════
  // FINALE + POSITIV-BONUS (+10 Punkte Basis!)
  // ═══════════════════════════════════════════════════════════
  
  // +10 Punkte Basis-Bonus für positivere Bewertung
  const POSITIV_BONUS = 10;
  score += POSITIV_BONUS;
  
  return {
    score: Math.min(100, Math.max(0, score)),
    details,
    kategorie: getDealKategorie(score)
  };
}

function getDealKategorie(score) {
  // ANGEPASST: ~10 Punkte positiver!
  if (score >= 75) return { emoji: '🔥', text: 'SCHNÄPPCHEN!', aktion: 'Sofort zuschlagen!' };
  if (score >= 60) return { emoji: '🟢', text: 'Guter Deal', aktion: 'Empfehlenswert' };
  if (score >= 45) return { emoji: '🟡', text: 'Fairer Preis', aktion: 'Verhandeln lohnt' };
  if (score >= 30) return { emoji: '🟠', text: 'Teuer', aktion: 'Stark verhandeln!' };
  return { emoji: '🔴', text: 'Zu teuer!', aktion: 'Finger weg oder -20% bieten' };
}
```

---

## 🏠 INVESTMENT-SCORE BERECHNUNG (Komplett!)

```javascript
function berechneInvestmentScore(immobilie, userProfil = {}) {
  let score = 0;
  const details = {};
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 1: LAGE-QUALITÄT (25 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  const lageBewertung = berechneMikrolagePunkteV2(immobilie);
  details.lage = lageBewertung;
  score += lageBewertung.punkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 2: CASHFLOW-POTENZIAL (20 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  const cfBewertung = bewerteCashflowPotenzial(immobilie);
  details.cashflow = cfBewertung;
  score += cfBewertung.punkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 3: OBJEKTZUSTAND (15 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let zustandPunkte = {
    'Neubau': 15, 'Kernsaniert': 14, 'Saniert': 12, 'Modernisiert': 10,
    'Gepflegt': 8, 'Renovierungsbedürftig': 4, 'Sanierungsbedürftig': 2
  }[immobilie.zustand] || 7;
  
  // Energie-Anpassung
  if (['A', 'B', 'C'].includes(immobilie.energieKlasse)) zustandPunkte = Math.min(15, zustandPunkte + 1);
  if (['G', 'H'].includes(immobilie.energieKlasse)) zustandPunkte = Math.max(0, zustandPunkte - 2);
  
  details.zustand = { punkte: zustandPunkte, maxPunkte: 15, wert: immobilie.zustand, energie: immobilie.energieKlasse };
  score += zustandPunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 4: WERTSTEIGERUNGSPOTENZIAL (15 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let wertPunkte = 7;
  const potenzialDetails = [];
  
  // Mieterhöhungspotenzial
  if (immobilie.istMiete && immobilie.marktMiete && immobilie.istMiete < immobilie.marktMiete * 0.85) {
    wertPunkte += 3;
    potenzialDetails.push(`Mieterhöhung möglich: +${Math.round((immobilie.marktMiete/immobilie.istMiete - 1) * 100)}%`);
  }
  
  // Aufwertungsgebiet
  if (immobilie.entwicklungsgebiet) { wertPunkte += 3; potenzialDetails.push('Entwicklungsgebiet'); }
  if (immobilie.neueBahnanbindung) { wertPunkte += 2; potenzialDetails.push('Neue ÖPNV-Anbindung'); }
  
  // Denkmal-Bonus
  if (immobilie.denkmalschutz && userProfil.hoherSteuersatz) {
    wertPunkte += 2;
    potenzialDetails.push('Denkmal-AfA möglich!');
  }
  
  details.wertsteigerung = { punkte: Math.min(15, wertPunkte), maxPunkte: 15, faktoren: potenzialDetails };
  score += Math.min(15, wertPunkte);
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 5: MIETER-/NACHFRAGEQUALITÄT (15 Punkte)
  // ═══════════════════════════════════════════════════════════
  
  let mieterPunkte = 10;
  
  if (immobilie.vermietet && immobilie.mieterBonität === 'gut') mieterPunkte += 3;
  if (immobilie.mietvertragDauer > 24) mieterPunkte += 2; // Langzeitmieter
  if (immobilie.leerstand) mieterPunkte -= 3;
  if (immobilie.mietrueckstaende) mieterPunkte -= 5;
  
  // Nachfrage-Indikator
  const regionDaten = getRegionaleBenchmarks(immobilie.stadt);
  if (regionDaten.nachfrageHoch) mieterPunkte += 2;
  
  details.mieterNachfrage = { punkte: Math.max(0, Math.min(15, mieterPunkte)), maxPunkte: 15 };
  score += Math.max(0, Math.min(15, mieterPunkte));
  
  // ═══════════════════════════════════════════════════════════
  // KOMPONENTE 6: RISIKOFAKTOREN (10 Punkte, Abzüge)
  // ═══════════════════════════════════════════════════════════
  
  let risikoPunkte = 10;
  const risiken = [];
  
  if (immobilie.erbpacht) { risikoPunkte -= 3; risiken.push('Erbpacht'); }
  if (immobilie.erhaltungsruecklageProzent < 20) { risikoPunkte -= 2; risiken.push('Niedrige Rücklage'); }
  if (immobilie.sonderumlagenGeplant) { risikoPunkte -= 2; risiken.push('Sonderumlage geplant'); }
  if (immobilie.baujahr < 1960 && !immobilie.kernsaniert) { risikoPunkte -= 2; risiken.push('Altbau unsaniert'); }
  if (immobilie.wegProbleme) { risikoPunkte -= 3; risiken.push('WEG-Probleme'); }
  
  details.risiken = { punkte: Math.max(0, risikoPunkte), maxPunkte: 10, faktoren: risiken };
  score += Math.max(0, risikoPunkte);
  
  // ═══════════════════════════════════════════════════════════
  // FINALE + POSITIV-BONUS (+10 Punkte Basis!)
  // ═══════════════════════════════════════════════════════════
  
  // +10 Punkte Basis-Bonus für positivere Bewertung
  const POSITIV_BONUS = 10;
  score += POSITIV_BONUS;
  
  return {
    score: Math.min(100, Math.max(0, score)),
    details,
    kategorie: getInvestmentKategorie(score)
  };
}

function getInvestmentKategorie(score) {
  // ANGEPASST: ~10 Punkte positiver!
  if (score >= 75) return { emoji: '🏆', text: 'Top-Objekt', beschreibung: 'Erstklassige Immobilie' };
  if (score >= 60) return { emoji: '🟢', text: 'Gutes Objekt', beschreibung: 'Solide Langfrist-Anlage' };
  if (score >= 45) return { emoji: '🟡', text: 'Durchschnitt', beschreibung: 'Okay mit richtigem Preis' };
  if (score >= 30) return { emoji: '🟠', text: 'Unterdurchschnitt', beschreibung: 'Nur bei Schnäppchen' };
  return { emoji: '🔴', text: 'Problematisch', beschreibung: 'Viele Risiken' };
}
```

---

## 🎯 GESAMT-ANALYSE (Alles zusammen!)

```javascript
function analysiereImmobilieKomplett(immobilie, userProfil = {}) {
  // ═══════════════════════════════════════════════════════════
  // 1. MARKTWERT SCHÄTZEN
  // ═══════════════════════════════════════════════════════════
  const marktwertAnalyse = schaetzeMarktwert(immobilie);
  immobilie.marktwert = marktwertAnalyse.geschaetzterMarktwert;
  
  // ═══════════════════════════════════════════════════════════
  // 2. BEIDE SCORES BERECHNEN
  // ═══════════════════════════════════════════════════════════
  const dealScore = berechneDealScore(immobilie);
  const investmentScore = berechneInvestmentScore(immobilie, userProfil);
  
  // ═══════════════════════════════════════════════════════════
  // 3. GESAMT-SCORE (Strategie-abhängig)
  // ═══════════════════════════════════════════════════════════
  const strategie = userProfil.strategie || 'default';
  const gesamtScore = berechneGesamtScore(dealScore.score, investmentScore.score, strategie);
  
  // ═══════════════════════════════════════════════════════════
  // 4. INSTANT EQUITY ANALYSE
  // ═══════════════════════════════════════════════════════════
  const instantEquity = berechneInstantEquityWert(
    immobilie.kaufpreis, 
    immobilie.marktwert, 
    userProfil.geplanteHaltedauer || 10
  );
  
  // ═══════════════════════════════════════════════════════════
  // 5. NEGATIVE CASHFLOW CHECK
  // ═══════════════════════════════════════════════════════════
  const cashflowCheck = bewerteNegativenCashflow(
    immobilie.cashflow, 
    instantEquity.instantEquity
  );
  
  // ═══════════════════════════════════════════════════════════
  // 6. 4-QUELLEN-RENDITE
  // ═══════════════════════════════════════════════════════════
  const gesamtRendite = berechneGesamtRendite(immobilie, immobilie.finanzierung, userProfil);
  
  // ═══════════════════════════════════════════════════════════
  // 7. FINALE EMPFEHLUNG
  // ═══════════════════════════════════════════════════════════
  
  return {
    // Die zwei Haupt-Scores
    dealScore: dealScore,
    investmentScore: investmentScore,
    gesamtScore: {
      score: gesamtScore,
      kategorie: getGesamtKategorie(gesamtScore, dealScore.score, investmentScore.score)
    },
    
    // Marktwert-Analyse
    marktwert: marktwertAnalyse,
    instantEquity: instantEquity,
    cashflowCheck: cashflowCheck,
    
    // Rendite-Analyse
    gesamtRendite: gesamtRendite,
    
    // Finale Empfehlung
    empfehlung: generiereEmpfehlung(dealScore, investmentScore, gesamtScore, instantEquity, cashflowCheck)
  };
}

function getGesamtKategorie(gesamt, deal, investment) {
  // Besondere Fälle
  if (deal >= 80 && investment < 50) {
    return { emoji: '💰', text: 'Schnäppchen mit Risiko', beschreibung: 'Super Preis, aber Objekt hat Schwächen' };
  }
  if (deal < 40 && investment >= 70) {
    return { emoji: '💎', text: 'Gutes Objekt, zu teuer', beschreibung: 'Tolles Objekt, aber Preis verhandeln!' };
  }
  
  // Standard
  if (gesamt >= 80) return { emoji: '🏆', text: 'TOP INVESTMENT', beschreibung: 'Guter Deal + Gutes Objekt!' };
  if (gesamt >= 65) return { emoji: '🟢', text: 'Empfehlenswert', beschreibung: 'Solide Gelegenheit' };
  if (gesamt >= 50) return { emoji: '🟡', text: 'Prüfenswert', beschreibung: 'Mit Verhandlung interessant' };
  if (gesamt >= 35) return { emoji: '🟠', text: 'Vorsicht', beschreibung: 'Nur bei deutlicher Verbesserung' };
  return { emoji: '🔴', text: 'Nicht empfohlen', beschreibung: 'Zu teuer und/oder zu riskant' };
}

function generiereEmpfehlung(dealScore, investmentScore, gesamtScore, instantEquity, cashflowCheck) {
  const empfehlungen = [];
  
  // Deal-basierte Empfehlungen
  if (dealScore.score < 50) {
    const zielDiscount = 0.15;
    const zielPreis = Math.round(dealScore.details.unterMarktwert.marktwert * (1 - zielDiscount));
    empfehlungen.push({
      prioritaet: 1,
      typ: 'Preisverhandlung',
      icon: '💰',
      text: `Preis zu hoch! Biete maximal ${zielPreis.toLocaleString()}€ (15% unter Marktwert)`,
      effekt: `Deal-Score würde von ${dealScore.score} auf ~75 steigen`
    });
  }
  
  // Cashflow-basierte Empfehlungen
  if (!cashflowCheck.akzeptabel) {
    empfehlungen.push({
      prioritaet: 2,
      typ: 'Cashflow-Problem',
      icon: '⚠️',
      text: cashflowCheck.empfehlung,
      effekt: 'Negativer Cashflow wird durch Instant Equity nicht gedeckt'
    });
  }
  
  // Investment-basierte Empfehlungen
  if (investmentScore.details.risiken.faktoren.length > 0) {
    empfehlungen.push({
      prioritaet: 3,
      typ: 'Risiken prüfen',
      icon: '🔍',
      text: `Risiken identifiziert: ${investmentScore.details.risiken.faktoren.join(', ')}`,
      effekt: 'Vor Kauf klären!'
    });
  }
  
  // Positive Empfehlung bei gutem Deal
  if (gesamtScore >= 70 && cashflowCheck.akzeptabel) {
    empfehlungen.unshift({
      prioritaet: 0,
      typ: 'Kaufempfehlung',
      icon: '✅',
      text: 'Gute Gelegenheit! Bei Interesse schnell handeln.',
      effekt: `${instantEquity.instantEquity.toLocaleString()}€ Instant Equity + ${instantEquity.monatlichEquivalent}€/Monat virtueller CF`
    });
  }
  
  return empfehlungen.sort((a, b) => a.prioritaet - b.prioritaet);
}
```

---

## 🎚️ MODUS-AUSWAHL: EINSTEIGER vs. PROFI

```javascript
const MODUS_CONFIG = {
  einsteiger: {
    name: 'Einsteiger-Modus',
    beschreibung: 'Konservativer, mehr Warnungen, ausführlichere Erklärungen',
    einstellungen: {
      risikopuffer: 150,  // 150€/Monat extra
      minCashflowFuerGruen: 50,  // Mindestens 50€ positiv für Grün
      warnungBeiNegativCashflow: true,
      erklaerungAusfuehrlich: true,
      worstCaseAnzeigen: 'immer',
      maxBeleihung: 95,  // Max 95% empfohlen
      minEigenkapitalEmpfehlung: 'nebenkosten_plus_10'
    }
  },
  
  profi: {
    name: 'Profi-Modus',
    beschreibung: 'Weniger Warnungen, zeigt auch aggressive Strategien',
    einstellungen: {
      risikopuffer: 50,  // Nur 50€/Monat
      minCashflowFuerGruen: 0,  // Neutral reicht
      warnungBeiNegativCashflow: false,
      erklaerungAusfuehrlich: false,
      worstCaseAnzeigen: 'aufKlick',  // Nur wenn User will
      maxBeleihung: 110,  // Auch 110% zeigen
      minEigenkapitalEmpfehlung: 'null_moeglich'
    }
  }
};

function getModusEinstellungen(modus = 'einsteiger') {
  return MODUS_CONFIG[modus] || MODUS_CONFIG.einsteiger;
}

// Beispiel: Cashflow-Bewertung je nach Modus
function bewerteCashflowMitModus(cashflow, modus) {
  const config = getModusEinstellungen(modus);
  const effektiv = cashflow - config.einstellungen.risikopuffer;
  
  if (modus === 'profi') {
    // Profi: Weniger streng
    if (cashflow >= 100) return { ampel: '🟢🟢', text: 'Sehr gut' };
    if (cashflow >= 0) return { ampel: '🟢', text: 'OK' };
    if (cashflow >= -150) return { ampel: '🟡', text: 'Akzeptabel' };
    return { ampel: '🟠', text: 'Negativ' };
  }
  
  // Einsteiger: Strenger (Standard)
  if (effektiv >= 150) return { ampel: '🟢🟢', text: 'Sehr gut' };
  if (effektiv >= 50) return { ampel: '🟢', text: 'Gut' };
  if (cashflow >= 0) return { ampel: '🟡', text: 'Grenzwertig – kein Puffer!' };
  return { ampel: '🔴', text: 'Negativ – Vorsicht!' };
}
```

### Wann welchen Modus empfehlen?

| Situation | Empfohlener Modus |
|-----------|-------------------|
| Erstes Investment | Einsteiger |
| Wenig Rücklagen | Einsteiger |
| 3+ Immobilien besessen | Profi |
| Erfahrener Investor | Profi |
| Hohe finanzielle Reserven | Profi |
| Selbstständiger ohne Puffer | Einsteiger |

---

## 🔍 LIVE-RECHERCHE FÜR MARKTWERT (KRITISCH!)

### Warum Live-Recherche?

**PROBLEM:** Statische Daten veralten und sind zu ungenau!
- "Hamburg" hat 100+ Stadtteile mit KOMPLETT unterschiedlichen Preisen
- Harburg: ~3.200€/m² vs. Blankenese: ~12.000€/m²
- Reihenhaus vs. ETW vs. EFH haben verschiedene €/m²-Preise
- Marktpreise ändern sich ständig

**LÖSUNG:** Bei JEDER Analyse Live-Daten recherchieren!

---

### 🔄 RECHERCHE-WORKFLOW (Schritt für Schritt)

```
USER GIBT EIN:
├─ Adresse/Stadtteil: [z.B. "Poppenbüttel, Hamburg"]
├─ Immobilientyp: [Reihenhaus / ETW / EFH / MFH / DHH]
├─ Wohnfläche: [z.B. 120 m²]
├─ Kaufpreis: [z.B. 520.000€]
├─ Kaltmiete: [z.B. 1.800€] (falls vermietet)
└─ Zustand/Baujahr: [optional]

KI FÜHRT AUTOMATISCH DURCH:
│
├─ SCHRITT 1: Kaufpreis-Recherche
│   └─ Suche: "[Stadtteil] [Stadt] [Immobilientyp] Kaufpreis €/m² 2025"
│
├─ SCHRITT 2: Mietpreis-Recherche  
│   └─ Suche: "[Stadtteil] [Stadt] Mietspiegel Haus mieten €/m² 2025"
│
├─ SCHRITT 3: Vergleichsangebote finden
│   └─ Suche: "[Stadtteil] [Immobilientyp] kaufen [Fläche]m²"
│
├─ SCHRITT 4: Daten extrahieren & vergleichen
│   └─ Durchschnitts-€/m² berechnen
│   └─ Mit User-Eingabe vergleichen
│
└─ SCHRITT 5: Bewertung ausgeben
    └─ Deal-Score berechnen
    └─ Empfehlung generieren
```

---

### 🔎 SUCH-TEMPLATES (Exakte Formulierungen!)

**Für KAUFPREISE:**
```
Suche 1: "[Stadtteil] [Stadt] [Immobilientyp] Quadratmeterpreis €/m² 2025"
Suche 2: "[Stadtteil] [Stadt] Immobilienpreise [Immobilientyp] kaufen"
Suche 3: "[Stadtteil] Haus kaufen Preis" (für konkrete Angebote)
```

**Für MIETPREISE:**
```
Suche 1: "[Stadtteil] [Stadt] Mietspiegel 2025"
Suche 2: "[Stadtteil] [Stadt] [Immobilientyp] mieten €/m²"
Suche 3: "Mietpreis Haus [Stadtteil] [Stadt]"
```

**Für VERGLEICHSOBJEKTE:**
```
Suche: "[Stadtteil] [Immobilientyp] kaufen [Fläche-10]m² bis [Fläche+10]m²"
```

---

### 📊 DATEN-EXTRAKTION (Was suchen wir?)

**Aus den Suchergebnissen extrahieren:**

| Datenpunkt | Quelle | Priorität |
|------------|--------|-----------|
| Ø €/m² Kaufpreis | ImmoScout24, Immowelt, Homeday | ⭐⭐⭐ |
| €/m² Spanne (min-max) | Immoportal, Engel&Völkers | ⭐⭐⭐ |
| Ø €/m² Miete | Mietspiegel-Seiten | ⭐⭐⭐ |
| Konkrete Angebote | ImmoScout24, Kleinanzeigen | ⭐⭐ |
| Preisentwicklung (YoY) | ImmoScout Atlas | ⭐ |

**Bevorzugte Quellen (in dieser Reihenfolge):**
1. ImmoScout24 Atlas (atlas.immobilienscout24.de) - Beste Datenbasis
2. Homeday Preisatlas - Gute Stadtteil-Daten
3. Engel & Völkers Mietspiegel - Professionell
4. Immoportal.com - Aktuelle Preise
5. Kleinanzeigen.de - Echte Angebote zum Vergleich

---

### 🧮 MARKTWERT-BERECHNUNG (Nach Live-Recherche)

```javascript
function berechneMarktwertMitLiveDaten(userEingabe, rechercheDaten) {
  /*
  rechercheDaten = {
    kaufpreisProQm: {
      durchschnitt: 4941,      // Aus Recherche
      minimum: 4200,
      maximum: 6500,
      quelle: 'ImmoScout24 Q3/2025',
      stadtteil: 'Poppenbüttel',
      immobilientyp: 'Haus'
    },
    mietpreisProQm: {
      durchschnitt: 17.08,
      quelle: 'ImmoScout24 Mietspiegel',
    },
    vergleichsangebote: [
      { preis: 465000, flaeche: 148, qmPreis: 3142, zustand: 'gut' },
      { preis: 679000, flaeche: 125, qmPreis: 5432, zustand: 'saniert' },
      // ...
    ]
  }
  */
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 1: Durchschnittspreis × Fläche
  // ═══════════════════════════════════════════════════════════════════════
  
  const marktwertDurchschnitt = rechercheDaten.kaufpreisProQm.durchschnitt * userEingabe.wohnflaeche;
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 2: Anpassung nach Zustand
  // ═══════════════════════════════════════════════════════════════════════
  
  let zustandsFaktor = 1.0;
  if (userEingabe.zustand === 'Neubau' || userEingabe.zustand === 'Kernsaniert') zustandsFaktor = 1.10;
  if (userEingabe.zustand === 'Saniert') zustandsFaktor = 1.05;
  if (userEingabe.zustand === 'Renovierungsbedürftig') zustandsFaktor = 0.85;
  if (userEingabe.zustand === 'Sanierungsbedürftig') zustandsFaktor = 0.75;
  
  // Energie-Anpassung
  let energieFaktor = 1.0;
  if (['A+', 'A', 'B'].includes(userEingabe.energieKlasse)) energieFaktor = 1.05;
  if (['F', 'G', 'H'].includes(userEingabe.energieKlasse)) energieFaktor = 0.90;
  
  const marktwertAngepasst = marktwertDurchschnitt * zustandsFaktor * energieFaktor;
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 3: Vergleich mit ähnlichen Angeboten
  // ═══════════════════════════════════════════════════════════════════════
  
  // Finde Angebote mit ähnlicher Fläche (±20%)
  const aehnlicheAngebote = rechercheDaten.vergleichsangebote.filter(a => 
    a.flaeche >= userEingabe.wohnflaeche * 0.8 && 
    a.flaeche <= userEingabe.wohnflaeche * 1.2
  );
  
  let marktwertVergleich = null;
  if (aehnlicheAngebote.length >= 2) {
    const durchschnittQm = aehnlicheAngebote.reduce((sum, a) => sum + a.qmPreis, 0) / aehnlicheAngebote.length;
    marktwertVergleich = durchschnittQm * userEingabe.wohnflaeche;
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // FINALE MARKTWERT-SCHÄTZUNG (gewichteter Durchschnitt)
  // ═══════════════════════════════════════════════════════════════════════
  
  let finalerMarktwert;
  if (marktwertVergleich) {
    // Wenn Vergleichsangebote vorhanden: 60% Vergleich, 40% Durchschnitt
    finalerMarktwert = marktwertVergleich * 0.6 + marktwertAngepasst * 0.4;
  } else {
    finalerMarktwert = marktwertAngepasst;
  }
  
  return {
    geschaetzterMarktwert: Math.round(finalerMarktwert),
    methoden: {
      durchschnitt: Math.round(marktwertDurchschnitt),
      angepasst: Math.round(marktwertAngepasst),
      vergleich: marktwertVergleich ? Math.round(marktwertVergleich) : null
    },
    datenqualitaet: berechneDatenqualitaet(rechercheDaten),
    quellen: rechercheDaten.quellen || [],
    stand: new Date().toISOString().split('T')[0]
  };
}

function berechneDatenqualitaet(rechercheDaten) {
  let score = 0;
  
  // Haben wir €/m²-Daten?
  if (rechercheDaten.kaufpreisProQm?.durchschnitt) score += 30;
  if (rechercheDaten.kaufpreisProQm?.minimum && rechercheDaten.kaufpreisProQm?.maximum) score += 10;
  
  // Haben wir Mietdaten?
  if (rechercheDaten.mietpreisProQm?.durchschnitt) score += 20;
  
  // Haben wir Vergleichsangebote?
  if (rechercheDaten.vergleichsangebote?.length >= 3) score += 30;
  else if (rechercheDaten.vergleichsangebote?.length >= 1) score += 15;
  
  // Mehrere Quellen?
  if (rechercheDaten.quellen?.length >= 2) score += 10;
  
  if (score >= 80) return { niveau: 'Hoch', emoji: '🟢', text: 'Gute Datenbasis' };
  if (score >= 50) return { niveau: 'Mittel', emoji: '🟡', text: 'Ausreichende Daten' };
  return { niveau: 'Niedrig', emoji: '🟠', text: 'Wenig Daten - Schätzung unsicher!' };
}
```

---

### 📋 BEISPIEL-ANALYSE MIT LIVE-RECHERCHE

```
═══════════════════════════════════════════════════════════════════════════════
🏠 IMMOBILIEN-ANALYSE: Wesselstraße, Poppenbüttel (Reihenhaus)
═══════════════════════════════════════════════════════════════════════════════

📥 EINGABE VOM USER:
├─ Adresse: Wesselstraße, 22399 Hamburg-Poppenbüttel
├─ Typ: Reihenhaus
├─ Wohnfläche: 120 m²
├─ Kaufpreis: 520.000€
├─ Kaltmiete (aktuell): 1.800€/Monat
└─ Zustand: Gepflegt, Baujahr 1985

═══════════════════════════════════════════════════════════════════════════════

🔍 LIVE-RECHERCHE DURCHGEFÜHRT (Stand: 28.01.2026)

📊 KAUFPREISE POPPENBÜTTEL (Häuser):
├─ Quelle: ImmoScout24 Atlas Q3/2025
├─ Durchschnitt: 4.941 €/m²
├─ Spanne: 4.465 - 8.160 €/m²
└─ Trend: -0,88% zu Q2/2025

📊 MIETPREISE POPPENBÜTTEL (Häuser):
├─ Quelle: ImmoScout24 Mietspiegel
├─ Durchschnitt: 17,08 €/m²
├─ Trend: +1,46% erwartet Q4/2025
└─ Zum Vergleich Wohnungen: 13,04 €/m²

📊 VERGLEICHSANGEBOTE AKTUELL AUF DEM MARKT:
├─ Reihenhaus 148m², 7 Zi.: 465.000€ (3.142 €/m²) - Energieklasse B
├─ Reihenhaus 82m², 4,5 Zi.: 399.000€ (4.836 €/m²) - Energieklasse F
└─ Reihenhaus 125m², 4 Zi.: 679.000€ (5.432 €/m²) - Energieklasse C

═══════════════════════════════════════════════════════════════════════════════

🎯 MARKTWERT-BERECHNUNG

Methode 1 (Durchschnitt): 120m² × 4.941€ = 592.920€
Methode 2 (Zustand-angepasst): 592.920€ × 1.0 = 592.920€
Methode 3 (Vergleichsangebote Ø): ~580.000€

➜ GESCHÄTZTER MARKTWERT: ~590.000€
  (Spanne: 535.000€ - 650.000€)

═══════════════════════════════════════════════════════════════════════════════

💰 DEAL-ANALYSE

┌─────────────────────────────────────────────────────────────────────────────┐
│ DEIN KAUFPREIS:        520.000€  (4.333 €/m²)                              │
│ GESCHÄTZTER MARKTWERT: 590.000€  (4.917 €/m²)                              │
│                        ─────────────────────                                │
│ DIFFERENZ:             70.000€ UNTER MARKTWERT! ✅                         │
│ RABATT:                11,9%                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ DEINE MIETE:           1.800€/Monat (15,00 €/m²)                           │
│ MARKTMIETE:            2.050€/Monat (17,08 €/m²)                           │
│                        ─────────────────────                                │
│ MIETERHÖHUNGSPOTENZIAL: +250€/Monat (+13,9%)                               │
│ (Nach Modernisierung oder bei Neuvermietung)                               │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

📊 SCORES

🎯 DEAL-SCORE: 76/100 🟢 "Guter Deal"
├─ Unter Marktwert: 28/40 (11,9% Rabatt)
├─ Kaufpreisfaktor: 14/20 (Faktor 24,1 - OK für Hamburg-Nord)
├─ Verhandlungspotenzial: 10/15
├─ Nebenkosten: 6/10 (Hamburg 5,5% GrESt)
└─ Exit-Optionen: 18/15 (Beliebte Lage)

🏠 INVESTMENT-SCORE: 68/100 🟢 "Gut"
├─ Cashflow: 12/25 (aktuell leicht negativ geschätzt)
├─ Lage: 20/25 (Poppenbüttel = gute Wohnlage)
├─ Wertsteigerung: 14/20 (Mieterhöhungspotenzial!)
├─ Objektqualität: 10/15 (gepflegt, aber Bj. 1985)
└─ Mieter/Nachfrage: 12/15 (hohe Nachfrage in HH-Nord)

⚖️ GESAMT-SCORE: 72/100 🟢 "EMPFEHLENSWERT"

═══════════════════════════════════════════════════════════════════════════════

💡 TOTAL VALUE CREATION (über 10 Jahre)

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. INSTANT EQUITY (sofort):           +70.000€                             │
│    → Umgerechnet: 583€/Monat virtueller Cashflow                           │
│                                                                             │
│ 2. CASHFLOW (geschätzt):              -50€/Monat                           │
│    (Nach Finanzierung mit 20% EK)                                          │
│                                                                             │
│ 3. TOTAL VALUE CREATION:              +533€/Monat! ✅                      │
│    Der negative Cashflow ist MEHR ALS AUSGEGLICHEN durch den               │
│    günstigen Einkauf!                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

✅ EMPFEHLUNG: KAUFEN!

Begründung:
• Du kaufst 70.000€ (12%) unter Marktwert → sofortiger Buchgewinn
• Mieterhöhungspotenzial von +250€/Monat bei Neuvermietung
• Poppenbüttel ist eine etablierte, nachgefragte Wohnlage
• Reihenhaus = gute Wiederverkäuflichkeit

⚠️ Noch prüfen:
• Energetischer Zustand (Heizung, Dämmung) - Bj. 1985!
• Instandhaltungsrücklage bei Reihenhausanlage
• Grundbuch auf Lasten prüfen

💰 Maximales Gebot: 540.000€ (dann noch 8,5% unter Marktwert)

═══════════════════════════════════════════════════════════════════════════════
```

---

### 🚨 WICHTIG: Wann MUSS Live-Recherche gemacht werden?

**IMMER bei:**
- Jeder neuen Immobilien-Analyse
- Wenn User einen Stadtteil nennt
- Wenn User einen Kaufpreis/Marktwert bewerten will
- Wenn User fragt "Ist das ein guter Preis?"

**NICHT nötig bei:**
- Allgemeinen Fragen zur Finanzierung
- Erklärungen von Begriffen
- Steuer-Fragen (außer es geht um konkrete Objekte)

---

### 🔧 FALLBACK: Wenn Recherche nicht möglich ist

Falls keine Live-Recherche möglich ist (z.B. Offline, API-Limit):

```javascript
function fallbackMarktwert(userEingabe) {
  // Warnung ausgeben!
  console.warn('⚠️ Keine Live-Daten verfügbar - nutze Fallback-Schätzung!');
  
  // Grobe Schätzung basierend auf Stadt-Durchschnitt
  const stadtDurchschnitt = FALLBACK_PREISE[userEingabe.stadt] || 3500;
  
  // Immobilientyp-Faktor
  const typFaktor = {
    'ETW': 1.0,
    'Reihenhaus': 0.95,
    'DHH': 1.05,
    'EFH': 1.10,
    'MFH': 0.85
  }[userEingabe.typ] || 1.0;
  
  const schaetzung = stadtDurchschnitt * typFaktor * userEingabe.wohnflaeche;
  
  return {
    marktwert: Math.round(schaetzung),
    warnung: '⚠️ ACHTUNG: Dies ist nur eine grobe Schätzung basierend auf Stadt-Durchschnitt! Für genaue Bewertung bitte Stadtteil-spezifische Daten recherchieren.',
    konfidenz: 'Niedrig'
  };
}

// Fallback-Preise (nur als Notfall!)
const FALLBACK_PREISE = {
  'hamburg': 5500,
  'muenchen': 9000,
  'berlin': 5000,
  'frankfurt': 6000,
  'koeln': 4500,
  // ... etc.
};
```

---

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

// ═══════════════════════════════════════════════════════════════
// 🆕 ÜBERARBEITETES BEWERTUNGSSYSTEM V2.0 (REALISTISCHER!)
// ═══════════════════════════════════════════════════════════════

/*
ÄNDERUNGEN gegenüber V1:
- Cashflow MUSS positiv sein für "Grün" (Kapitalanleger-Perspektive!)
- Risikopuffer von 100€/Monat eingerechnet (für Reparaturen, Leerstand)
- Regionale Rendite-Benchmarks (München ≠ Leipzig)
- Denkmal als CHANCE, nicht als Malus
- Worst-Case-Szenario IMMER anzeigen
- Separater Risiko-Score
*/

function bewerteCashflow(cashflow, mitRisikopuffer = true) {
  // WICHTIG: Für Kapitalanleger sollte Cashflow POSITIV sein!
  // Wir rechnen mit 100€/Monat Puffer für Unvorhergesehenes
  
  const puffer = mitRisikopuffer ? 100 : 0;
  const effektiverCashflow = cashflow - puffer;
  
  // STRENGER als vorher! Nur positiver Cashflow ist wirklich "Grün"
  if (effektiverCashflow >= 200) return { 
    ampel: '🟢🟢', 
    text: 'Exzellent', 
    score: 98,
    erklaerung: 'Top! Auch nach Rücklagen bleibt ordentlich übrig.'
  };
  if (effektiverCashflow >= 100) return { 
    ampel: '🟢', 
    text: 'Sehr gut', 
    score: 90,
    erklaerung: 'Solider positiver Cashflow mit Sicherheitspuffer.'
  };
  if (effektiverCashflow >= 0) return { 
    ampel: '🟢', 
    text: 'Gut', 
    score: 80,
    erklaerung: 'Positiv nach Abzug des Risikopuffers.'
  };
  if (cashflow >= 100) return { 
    ampel: '🟡', 
    text: 'Akzeptabel', 
    score: 70,
    erklaerung: 'Positiv, aber Puffer für Unvorhergesehenes knapp.'
  };
  if (cashflow >= 0) return { 
    ampel: '🟡', 
    text: 'Grenzwertig', 
    score: 60,
    erklaerung: 'Gerade so neutral – kein Puffer für Reparaturen!'
  };
  if (cashflow >= -100) return { 
    ampel: '🟠', 
    text: 'Negativ', 
    score: 45,
    erklaerung: 'Du zahlst 1.200€/Jahr drauf. Nur bei starker Wertsteigerung sinnvoll.'
  };
  if (cashflow >= -200) return { 
    ampel: '🔴', 
    text: 'Schlecht', 
    score: 30,
    erklaerung: 'Du zahlst 2.400€/Jahr drauf. Preisverhandlung nötig!'
  };
  if (cashflow >= -300) return { 
    ampel: '🔴', 
    text: 'Sehr schlecht', 
    score: 20,
    erklaerung: 'Du zahlst 3.600€/Jahr drauf. Nicht empfehlenswert.'
  };
  return { 
    ampel: '🔴🔴', 
    text: 'Dealbreaker', 
    score: 10,
    erklaerung: `Du zahlst ${Math.abs(cashflow * 12).toLocaleString()}€/Jahr drauf. Finger weg!`
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 REGIONALE RENDITE-BENCHMARKS
// ═══════════════════════════════════════════════════════════════

const REGIONALE_BENCHMARKS = {
  // A-Städte (teuer, niedrige Renditen normal)
  'muenchen': { 
    akzeptableRendite: 2.5, 
    guteRendite: 3.0,
    topRendite: 3.5, 
    faktorGrenze: 35,
    mietMultiplikator: 1.3,
    beschreibung: 'Teuerster Markt, niedrige Renditen normal'
  },
  'frankfurt': { 
    akzeptableRendite: 3.0, 
    guteRendite: 3.5,
    topRendite: 4.0, 
    faktorGrenze: 30,
    mietMultiplikator: 1.2,
    beschreibung: 'Finanzmetropole, stabile Nachfrage'
  },
  'hamburg': { 
    akzeptableRendite: 3.0, 
    guteRendite: 3.5,
    topRendite: 4.0, 
    faktorGrenze: 30,
    mietMultiplikator: 1.15,
    beschreibung: 'Hafenstadt, gute Wertsteigerung'
  },
  'berlin': { 
    akzeptableRendite: 3.0, 
    guteRendite: 3.5,
    topRendite: 4.5, 
    faktorGrenze: 28,
    mietMultiplikator: 1.1,
    beschreibung: 'Hauptstadt, Mietendeckel-Historie beachten!'
  },
  'duesseldorf': { 
    akzeptableRendite: 3.5, 
    guteRendite: 4.0,
    topRendite: 4.5, 
    faktorGrenze: 27,
    mietMultiplikator: 1.1,
    beschreibung: 'Wirtschaftsstandort NRW'
  },
  'koeln': { 
    akzeptableRendite: 3.5, 
    guteRendite: 4.0,
    topRendite: 4.5, 
    faktorGrenze: 27,
    mietMultiplikator: 1.1,
    beschreibung: 'Medienstadt, stabile Nachfrage'
  },
  'stuttgart': { 
    akzeptableRendite: 3.0, 
    guteRendite: 3.5,
    topRendite: 4.0, 
    faktorGrenze: 28,
    mietMultiplikator: 1.15,
    beschreibung: 'Automobilindustrie, hohes Einkommen'
  },
  
  // B-Städte
  'nuernberg': { 
    akzeptableRendite: 4.0, 
    guteRendite: 4.5,
    topRendite: 5.5, 
    faktorGrenze: 25,
    mietMultiplikator: 1.0,
    beschreibung: 'Starke Wirtschaft, moderate Preise'
  },
  'hannover': { 
    akzeptableRendite: 4.0, 
    guteRendite: 4.5,
    topRendite: 5.5, 
    faktorGrenze: 25,
    mietMultiplikator: 1.0,
    beschreibung: 'Messestadt, gute Verkehrsanbindung'
  },
  'leipzig': { 
    akzeptableRendite: 5.0, 
    guteRendite: 6.0,
    topRendite: 7.0, 
    faktorGrenze: 20,
    mietMultiplikator: 0.85,
    beschreibung: 'Boomtown Ost, starke Wertsteigerung'
  },
  'dresden': { 
    akzeptableRendite: 5.0, 
    guteRendite: 5.5,
    topRendite: 6.5, 
    faktorGrenze: 20,
    mietMultiplikator: 0.85,
    beschreibung: 'Kulturstadt, wachsend'
  },
  
  // C-Städte / Ruhrgebiet
  'dortmund': { 
    akzeptableRendite: 5.5, 
    guteRendite: 6.5,
    topRendite: 8.0, 
    faktorGrenze: 18,
    mietMultiplikator: 0.8,
    beschreibung: 'Strukturwandel, hohe Renditen möglich'
  },
  'essen': { 
    akzeptableRendite: 5.5, 
    guteRendite: 6.5,
    topRendite: 8.0, 
    faktorGrenze: 18,
    mietMultiplikator: 0.8,
    beschreibung: 'Ruhrgebiet, Vorsicht bei Mikrolage!'
  },
  'duisburg': { 
    akzeptableRendite: 6.0, 
    guteRendite: 7.0,
    topRendite: 9.0, 
    faktorGrenze: 16,
    mietMultiplikator: 0.75,
    beschreibung: 'Hohe Renditen, aber Leerstandsrisiko!'
  },
  'gelsenkirchen': { 
    akzeptableRendite: 7.0, 
    guteRendite: 8.0,
    topRendite: 10.0, 
    faktorGrenze: 14,
    mietMultiplikator: 0.7,
    beschreibung: 'Höchste Renditen, höchstes Risiko!'
  },
  
  // Default für unbekannte Städte
  'default': { 
    akzeptableRendite: 4.5, 
    guteRendite: 5.0,
    topRendite: 6.0, 
    faktorGrenze: 22,
    mietMultiplikator: 0.95,
    beschreibung: 'Durchschnittlicher Markt'
  }
};

function getRegionaleBenchmarks(stadt) {
  const key = stadt.toLowerCase().replace(/[^a-zäöüß]/g, '');
  return REGIONALE_BENCHMARKS[key] || REGIONALE_BENCHMARKS['default'];
}

// ═══════════════════════════════════════════════════════════════
// 🆕 RENDITE-BEWERTUNG MIT REGIONALER ANPASSUNG
// ═══════════════════════════════════════════════════════════════

function bewerteRenditeRegional(bruttorendite, stadt) {
  const benchmark = getRegionaleBenchmarks(stadt);
  
  if (bruttorendite >= benchmark.topRendite) {
    return { 
      ampel: '🟢🟢', 
      text: 'Top für Region', 
      score: 95,
      vergleich: `${bruttorendite.toFixed(1)}% ist überdurchschnittlich für ${stadt}!`
    };
  }
  if (bruttorendite >= benchmark.guteRendite) {
    return { 
      ampel: '🟢', 
      text: 'Gut für Region', 
      score: 80,
      vergleich: `${bruttorendite.toFixed(1)}% ist solide für ${stadt}.`
    };
  }
  if (bruttorendite >= benchmark.akzeptableRendite) {
    return { 
      ampel: '🟡', 
      text: 'Akzeptabel', 
      score: 65,
      vergleich: `${bruttorendite.toFixed(1)}% ist Durchschnitt für ${stadt}.`
    };
  }
  if (bruttorendite >= benchmark.akzeptableRendite - 0.5) {
    return { 
      ampel: '🟠', 
      text: 'Unter Durchschnitt', 
      score: 45,
      vergleich: `${bruttorendite.toFixed(1)}% ist unter Markt für ${stadt}.`
    };
  }
  return { 
    ampel: '🔴', 
    text: 'Zu niedrig', 
    score: 25,
    vergleich: `${bruttorendite.toFixed(1)}% ist deutlich zu wenig für ${stadt}!`
  };
}

// ═══════════════════════════════════════════════════════════════
// 🆕 WORST-CASE-SZENARIO (PFLICHT BEI JEDER ANALYSE!)
// ═══════════════════════════════════════════════════════════════

/*
WICHTIG: Jede Analyse MUSS das Worst-Case zeigen!
Der User soll wissen, was im schlimmsten Fall passiert.
*/

function berechneWorstCase(immobilie, finanzierung) {
  const szenarien = [];
  
  // ═══════════════════════════════════════════════════════════
  // SZENARIO 1: 3 Monate Leerstand
  // ═══════════════════════════════════════════════════════════
  const leerstandsKosten = immobilie.kaltmiete * 3;
  const cfNachLeerstand = immobilie.cashflowJahr - leerstandsKosten;
  
  szenarien.push({
    name: '3 Monate Leerstand',
    icon: '🏚️',
    einmalkosten: leerstandsKosten,
    auswirkungCashflowJahr: cfNachLeerstand,
    auswirkungCashflowMonat: Math.round(cfNachLeerstand / 12),
    bewertung: cfNachLeerstand >= 0 ? '🟢 Tragbar' : cfNachLeerstand >= -2400 ? '🟡 Belastend' : '🔴 Kritisch',
    tipp: 'Mietausfall-Versicherung prüfen (ca. 100-200€/Jahr)'
  });
  
  // ═══════════════════════════════════════════════════════════
  // SZENARIO 2: Sonderumlage 10.000€
  // ═══════════════════════════════════════════════════════════
  const sonderumlage = 10000;
  
  szenarien.push({
    name: 'Sonderumlage 10.000€',
    icon: '💸',
    einmalkosten: sonderumlage,
    frage: 'Hast du 10.000€ Rücklagen für so einen Fall?',
    bewertung: 'Typisch bei Dachsanierung, Heizungsaustausch, Fassade',
    tipp: 'Erhaltungsrücklage im WEG-Protokoll prüfen! Sollte min. 25€/m²/Jahr sein.'
  });
  
  // ═══════════════════════════════════════════════════════════
  // SZENARIO 3: Zinsen +2% bei Anschlussfinanzierung
  // ═══════════════════════════════════════════════════════════
  const neuerZins = finanzierung.zinssatz + 0.02;
  const neueRate = finanzierung.restschuld * (neuerZins + finanzierung.tilgungssatz) / 12;
  const ratenErhoehung = neueRate - finanzierung.monatlicheRate;
  const neuerCashflow = immobilie.cashflow - ratenErhoehung;
  
  szenarien.push({
    name: 'Anschlussfinanzierung +2% Zins',
    icon: '📈',
    aktuellerZins: (finanzierung.zinssatz * 100).toFixed(1) + '%',
    neuerZins: (neuerZins * 100).toFixed(1) + '%',
    aktuelleRate: Math.round(finanzierung.monatlicheRate),
    neueRate: Math.round(neueRate),
    mehrkosten: Math.round(ratenErhoehung),
    neuerCashflow: Math.round(neuerCashflow),
    bewertung: neuerCashflow >= 0 ? '🟢 Noch tragbar' : neuerCashflow >= -200 ? '🟡 Belastend' : '🔴 Kritisch!',
    tipp: neuerCashflow < 0 ? 'Sondertilgung nutzen um Restschuld zu reduzieren!' : 'Situation noch komfortabel'
  });
  
  // ═══════════════════════════════════════════════════════════
  // SZENARIO 4: Heizungsaustausch (GEG-Pflicht)
  // ═══════════════════════════════════════════════════════════
  if (immobilie.heizungAlter > 15 || ['Öl', 'Gas'].includes(immobilie.heizungTyp)) {
    const heizungskosten = 25000; // Durchschnitt Wärmepumpe
    const foerderung = immobilie.selbstnutzer ? 0.50 : 0.30; // 50% Selbstnutzer, 30% Vermieter
    const eigenanteil = heizungskosten * (1 - foerderung);
    
    szenarien.push({
      name: 'Heizungsaustausch (GEG)',
      icon: '🔥',
      bruttokosten: heizungskosten,
      foerderung: Math.round(heizungskosten * foerderung),
      eigenanteil: Math.round(eigenanteil),
      zeitrahmen: 'Bei Heizungsausfall oder GEG-Frist',
      bewertung: immobilie.heizungAlter > 25 ? '🔴 Bald fällig!' : '🟡 In 5-10 Jahren',
      tipp: 'KfW 458 Heizungsförderung beantragen – bis zu 70% Zuschuss!'
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // SZENARIO 5: Alle drei gleichzeitig (Hardcore Worst-Case)
  // ═══════════════════════════════════════════════════════════
  const totalWorstCase = leerstandsKosten + sonderumlage + (ratenErhoehung * 12);
  
  szenarien.push({
    name: '⚠️ SUPER-WORST-CASE',
    icon: '💀',
    beschreibung: 'Leerstand + Sonderumlage + Zinserhöhung im selben Jahr',
    gesamtbelastung: Math.round(totalWorstCase),
    frage: `Kannst du ${totalWorstCase.toLocaleString()}€ Extra-Belastung verkraften?`,
    bewertung: totalWorstCase > immobilie.eigenkapitalEinsatz * 0.5 ? '🔴 Hohes Risiko!' : '🟡 Verkraftbar',
    tipp: 'Mindestens 3 Monatsraten + 10.000€ als Reserve halten!'
  });
  
  return {
    szenarien,
    zusammenfassung: {
      empfohleneReserve: Math.round(finanzierung.monatlicheRate * 6 + 10000),
      risikoEinstufung: getRisikoEinstufung(szenarien),
      wichtigsterTipp: getWichtigstenTipp(szenarien)
    }
  };
}

function getRisikoEinstufung(szenarien) {
  const kritisch = szenarien.filter(s => s.bewertung?.includes('🔴')).length;
  if (kritisch >= 2) return { level: 'Hoch', ampel: '🔴', text: 'Mehrere kritische Szenarien!' };
  if (kritisch >= 1) return { level: 'Mittel', ampel: '🟡', text: 'Ein kritisches Szenario' };
  return { level: 'Gering', ampel: '🟢', text: 'Alle Szenarien verkraftbar' };
}

function getWichtigstenTipp(szenarien) {
  // Priorisiere nach Dringlichkeit
  const kritische = szenarien.filter(s => s.bewertung?.includes('🔴'));
  if (kritische.length > 0) return kritische[0].tipp;
  return 'Finanzielle Reserve aufbauen: 6 Monatsraten + 10.000€';
}

// ═══════════════════════════════════════════════════════════════
// 🆕 VERBESSERTE KREDIT-CHANCE MIT BERUF
// ═══════════════════════════════════════════════════════════════

const BERUF_MODIFIER = {
  'beamter': { bonus: 15, erklaerung: 'Unkündbar, sichere Pension' },
  'angestellt_oeffentlich': { bonus: 10, erklaerung: 'Öffentlicher Dienst = sehr sicher' },
  'angestellt_konzern': { bonus: 5, erklaerung: 'Großes Unternehmen = stabil' },
  'angestellt_kmu': { bonus: 0, erklaerung: 'Standard-Risiko' },
  'angestellt_startup': { bonus: -5, erklaerung: 'Höheres Risiko' },
  'freiberufler_kammer': { bonus: 0, erklaerung: 'Arzt/Anwalt/Steuerberater = akzeptiert' },
  'selbststaendig_3plus_jahre': { bonus: -5, erklaerung: 'Etabliert, aber mehr Prüfung' },
  'selbststaendig_unter_3_jahre': { bonus: -20, erklaerung: 'Sehr schwierig!' },
  'rentner': { bonus: -10, erklaerung: 'Laufzeit-Einschränkungen' },
  'arbeitslos': { bonus: -50, erklaerung: 'Praktisch unmöglich' }
};

function berechneKreditChanceV2(params) {
  const {
    eigenkapital,
    kaufpreis,
    kaufnebenkosten,
    monatlichesNetto,
    beruf = 'angestellt_kmu',
    schufa = 'gut',
    bestehendeKredite = 0,
    alter = 35,
    immobilienDetails = {}
  } = params;
  
  const gesamtkosten = kaufpreis + kaufnebenkosten;
  const eigenkapitalQuote = eigenkapital / gesamtkosten;
  
  let chance = 0;
  const faktoren = [];
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 1: Eigenkapital (wichtigster Faktor!)
  // ═══════════════════════════════════════════════════════════
  if (eigenkapital >= gesamtkosten * 0.30) {
    chance += 40;
    faktoren.push({ name: 'Eigenkapital 30%+', effekt: '+40%', ampel: '🟢🟢' });
  } else if (eigenkapital >= gesamtkosten * 0.20) {
    chance += 35;
    faktoren.push({ name: 'Eigenkapital 20-30%', effekt: '+35%', ampel: '🟢' });
  } else if (eigenkapital >= kaufnebenkosten + kaufpreis * 0.10) {
    chance += 28;
    faktoren.push({ name: 'Eigenkapital 10%+ plus NK', effekt: '+28%', ampel: '🟢' });
  } else if (eigenkapital >= kaufnebenkosten) {
    chance += 20;
    faktoren.push({ name: 'Nur Nebenkosten als EK', effekt: '+20%', ampel: '🟡' });
  } else if (eigenkapital >= kaufnebenkosten * 0.5) {
    chance += 10;
    faktoren.push({ name: 'Unter Nebenkosten', effekt: '+10%', ampel: '🟠' });
  } else {
    chance += 3;
    faktoren.push({ name: 'Fast kein Eigenkapital', effekt: '+3%', ampel: '🔴' });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 2: Einkommen / Belastungsquote
  // ═══════════════════════════════════════════════════════════
  const geschaetzteRate = (gesamtkosten - eigenkapital) * 0.053 / 12; // ~5.3% Annuität
  const belastungsquote = geschaetzteRate / monatlichesNetto;
  
  if (belastungsquote < 0.28) {
    chance += 25;
    faktoren.push({ name: 'Sehr niedrige Belastung (<28%)', effekt: '+25%', ampel: '🟢🟢' });
  } else if (belastungsquote < 0.33) {
    chance += 20;
    faktoren.push({ name: 'Gute Belastungsquote (28-33%)', effekt: '+20%', ampel: '🟢' });
  } else if (belastungsquote < 0.38) {
    chance += 12;
    faktoren.push({ name: 'Normale Belastung (33-38%)', effekt: '+12%', ampel: '🟡' });
  } else if (belastungsquote < 0.42) {
    chance += 5;
    faktoren.push({ name: 'Hohe Belastung (38-42%)', effekt: '+5%', ampel: '🟠' });
  } else {
    chance += 0;
    faktoren.push({ name: 'Zu hohe Belastung (>42%)', effekt: '+0%', ampel: '🔴' });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 3: Beruf
  // ═══════════════════════════════════════════════════════════
  const berufInfo = BERUF_MODIFIER[beruf] || BERUF_MODIFIER['angestellt_kmu'];
  chance += berufInfo.bonus;
  faktoren.push({ 
    name: `Beruf: ${beruf.replace(/_/g, ' ')}`, 
    effekt: `${berufInfo.bonus >= 0 ? '+' : ''}${berufInfo.bonus}%`, 
    ampel: berufInfo.bonus > 5 ? '🟢' : berufInfo.bonus < 0 ? '🔴' : '🟡',
    erklaerung: berufInfo.erklaerung
  });
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 4: SCHUFA
  // ═══════════════════════════════════════════════════════════
  const schufaMap = {
    'sehr_gut': { bonus: 10, ampel: '🟢' },
    'gut': { bonus: 5, ampel: '🟢' },
    'befriedigend': { bonus: 0, ampel: '🟡' },
    'ausreichend': { bonus: -15, ampel: '🟠' },
    'mangelhaft': { bonus: -40, ampel: '🔴' }
  };
  const schufaInfo = schufaMap[schufa] || schufaMap['gut'];
  chance += schufaInfo.bonus;
  faktoren.push({ name: `SCHUFA: ${schufa}`, effekt: `${schufaInfo.bonus >= 0 ? '+' : ''}${schufaInfo.bonus}%`, ampel: schufaInfo.ampel });
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 5: Bestehende Kredite
  // ═══════════════════════════════════════════════════════════
  if (bestehendeKredite > 0) {
    const malus = bestehendeKredite * 5;
    chance -= malus;
    faktoren.push({ name: `${bestehendeKredite} bestehende Kredite`, effekt: `-${malus}%`, ampel: '🟠' });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 6: Alter (Laufzeit-Einschränkung)
  // ═══════════════════════════════════════════════════════════
  if (alter > 55) {
    chance -= 10;
    faktoren.push({ name: 'Alter >55 Jahre', effekt: '-10%', ampel: '🟠', erklaerung: 'Kürzere maximale Laufzeit' });
  } else if (alter > 60) {
    chance -= 20;
    faktoren.push({ name: 'Alter >60 Jahre', effekt: '-20%', ampel: '🔴', erklaerung: 'Stark eingeschränkte Laufzeit' });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FAKTOR 7: Immobilien-Qualität (Bank bewertet auch das Objekt!)
  // ═══════════════════════════════════════════════════════════
  if (immobilienDetails.lage === 'A' || immobilienDetails.lage === 'B') {
    chance += 5;
    faktoren.push({ name: 'Gute Lage (A/B)', effekt: '+5%', ampel: '🟢' });
  }
  if (immobilienDetails.baujahr > 1990) {
    chance += 3;
    faktoren.push({ name: 'Neuerer Bau (>1990)', effekt: '+3%', ampel: '🟢' });
  }
  if (['A', 'B', 'C'].includes(immobilienDetails.energieKlasse)) {
    chance += 2;
    faktoren.push({ name: 'Gute Energieklasse', effekt: '+2%', ampel: '🟢' });
  }
  
  // ═══════════════════════════════════════════════════════════
  // FINALE CHANCE
  // ═══════════════════════════════════════════════════════════
  const finaleChance = Math.max(2, Math.min(98, chance));
  
  return {
    chance: finaleChance,
    faktoren,
    kategorie: getKreditChanceKategorie(finaleChance),
    details: {
      eigenkapitalQuote: Math.round(eigenkapitalQuote * 100),
      belastungsquote: Math.round(belastungsquote * 100),
      geschaetzteRate: Math.round(geschaetzteRate)
    },
    empfehlungen: getKreditEmpfehlungen(finaleChance, faktoren)
  };
}

function getKreditChanceKategorie(chance) {
  if (chance >= 85) return { ampel: '🟢🟢', text: 'Sehr hohe Chance', beschreibung: 'Banken werden sich um dich reißen!' };
  if (chance >= 70) return { ampel: '🟢', text: 'Gute Chance', beschreibung: '2-3 Banken anfragen, sollte klappen.' };
  if (chance >= 50) return { ampel: '🟡', text: 'Moderate Chance', beschreibung: 'Machbar, aber gut vorbereiten!' };
  if (chance >= 30) return { ampel: '🟠', text: 'Schwierig', beschreibung: 'Vermittler einschalten (Dr. Klein, Interhyp)' };
  if (chance >= 15) return { ampel: '🔴', text: 'Sehr schwierig', beschreibung: 'Kreative Lösungen nötig (siehe Tipps)' };
  return { ampel: '🔴🔴', text: 'Fast unmöglich', beschreibung: 'Situation erst verbessern' };
}

function getKreditEmpfehlungen(chance, faktoren) {
  const empfehlungen = [];
  
  // Basierend auf den schwächsten Faktoren Tipps geben
  faktoren.forEach(f => {
    if (f.ampel === '🔴' || f.ampel === '🟠') {
      if (f.name.includes('Eigenkapital')) {
        empfehlungen.push({
          prioritaet: 1,
          tipp: 'Eigenkapital erhöhen durch: Familie, Bausparvertrag, Nachrangdarlehen',
          effekt: 'Kann Chance um 10-20% verbessern'
        });
      }
      if (f.name.includes('Belastung')) {
        empfehlungen.push({
          prioritaet: 2,
          tipp: 'Günstigeres Objekt suchen oder zweiten Kreditnehmer einbeziehen',
          effekt: 'Bessere Belastungsquote'
        });
      }
      if (f.name.includes('selbststaendig')) {
        empfehlungen.push({
          prioritaet: 3,
          tipp: 'Partner mit Festanstellung als Hauptkreditnehmer, KfW nutzen',
          effekt: 'Umgeht Selbstständigen-Problem'
        });
      }
    }
  });
  
  if (chance < 50) {
    empfehlungen.push({
      prioritaet: 4,
      tipp: 'Kreditvermittler nutzen: Dr. Klein, Interhyp haben 500+ Bankpartner',
      effekt: 'Findet auch Nischen-Banken'
    });
  }
  
  return empfehlungen.sort((a, b) => a.prioritaet - b.prioritaet);
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

## TEIL 12: BEWERTUNGSLOGIK V3.0 (PROFI-STANDARD!)

/*
═══════════════════════════════════════════════════════════════════════════════
🆕 KOMPLETT NEUES BEWERTUNGSSYSTEM V3.0
═══════════════════════════════════════════════════════════════════════════════

KERNPRINZIP: "Price is what you pay, value is what you get." – Warren Buffett

Das alte System hatte einen fundamentalen Fehler: Es bewertete nur Cashflow.
Aber ein Investor, der 20% unter Marktwert kauft, hat SOFORT Gewinn gemacht!

NEUES DUAL-SCORE-SYSTEM:
1. DEAL-SCORE: Wie gut ist dieser KAUF? (Preis vs. Wert)
2. INVESTMENT-SCORE: Wie gut ist diese ANLAGE? (Langfristige Qualität)

Beide Scores zusammen ergeben die Gesamtbewertung.
*/

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 MARKTWERT-ERMITTLUNG (Automatisch!)
// ═══════════════════════════════════════════════════════════════════════════

/*
DREI METHODEN zur Marktwert-Schätzung (nach ImmoWertV):
1. Ertragswertverfahren - Für Kapitalanlagen (UNSER STANDARD!)
2. Vergleichswertverfahren - Für ETW mit genug Vergleichsdaten
3. Sachwertverfahren - Für Eigennutzer, Unikate
*/

function berechneMarktwert(immobilie, methode = 'auto') {
  // Automatische Methodenwahl
  if (methode === 'auto') {
    if (immobilie.nutzung === 'kapitalanlage') methode = 'ertragswert';
    else if (immobilie.typ === 'ETW' && immobilie.vergleichsdatenVorhanden) methode = 'vergleichswert';
    else methode = 'sachwert';
  }
  
  let marktwert = 0;
  let details = {};
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 1: ERTRAGSWERTVERFAHREN (Für Kapitalanleger!)
  // ═══════════════════════════════════════════════════════════════════════
  
  if (methode === 'ertragswert') {
    /*
    Formel: Ertragswert = (Jahresreinertrag × Vervielfältiger) + Bodenwert
    
    - Jahresreinertrag = Jahresmiete - Bewirtschaftungskosten
    - Vervielfältiger hängt ab von Liegenschaftszins und Restnutzungsdauer
    - Liegenschaftszins: Typisch 4-6% für Wohnimmobilien (aus Gutachterausschuss)
    */
    
    const jahresmiete = immobilie.kaltmiete * 12;
    
    // Bewirtschaftungskosten (ca. 20-25% der Miete)
    const bewirtschaftungskosten = jahresmiete * 0.22;
    const mietausfallrisiko = jahresmiete * 0.02; // 2% Standard
    
    const jahresreinertrag = jahresmiete - bewirtschaftungskosten - mietausfallrisiko;
    
    // Liegenschaftszins nach Region (aus Gutachterausschuss-Daten)
    const liegenschaftszins = getLiegenschaftszins(immobilie.stadt, immobilie.lage);
    
    // Restnutzungsdauer
    const gesamtnutzungsdauer = 80; // Jahre für Wohngebäude
    const alter = new Date().getFullYear() - immobilie.baujahr;
    const restnutzungsdauer = Math.max(20, gesamtnutzungsdauer - alter);
    
    // Vervielfältiger berechnen
    const vervielfaeltiger = (1 - Math.pow(1 + liegenschaftszins, -restnutzungsdauer)) / liegenschaftszins;
    
    // Bodenwert (aus Bodenrichtwert)
    const bodenwert = immobilie.grundstuecksflaeche * immobilie.bodenrichtwert;
    
    // Gebäudeertragswert
    const bodenwertverzinsung = bodenwert * liegenschaftszins;
    const gebaeudeReinertrag = jahresreinertrag - bodenwertverzinsung;
    const gebaeudeErtragswert = gebaeudeReinertrag * vervielfaeltiger;
    
    marktwert = Math.round(gebaeudeErtragswert + bodenwert);
    
    details = {
      methode: 'Ertragswertverfahren',
      jahresmiete,
      jahresreinertrag: Math.round(jahresreinertrag),
      liegenschaftszins: (liegenschaftszins * 100).toFixed(1) + '%',
      vervielfaeltiger: vervielfaeltiger.toFixed(1),
      restnutzungsdauer,
      bodenwert: Math.round(bodenwert),
      gebaeudeErtragswert: Math.round(gebaeudeErtragswert)
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 2: VERGLEICHSWERTVERFAHREN (Für ETW)
  // ═══════════════════════════════════════════════════════════════════════
  
  else if (methode === 'vergleichswert') {
    /*
    Basis: €/m² aus vergleichbaren Verkäufen in der Gegend
    Anpassungen für: Zustand, Etage, Balkon, Energieklasse, etc.
    */
    
    const basisPreisProQm = getVergleichspreisProQm(immobilie.plz, immobilie.stadt);
    
    // Anpassungsfaktoren
    let anpassungsfaktor = 1.0;
    
    // Zustand
    const zustandFaktor = {
      'Neubau': 1.15, 'Kernsaniert': 1.10, 'Saniert': 1.05,
      'Gepflegt': 1.00, 'Renovierungsbedürftig': 0.90, 'Sanierungsbedürftig': 0.80
    };
    anpassungsfaktor *= zustandFaktor[immobilie.zustand] || 1.0;
    
    // Energieklasse
    const energieFaktor = {
      'A+': 1.08, 'A': 1.05, 'B': 1.03, 'C': 1.00,
      'D': 0.97, 'E': 0.94, 'F': 0.90, 'G': 0.85, 'H': 0.80
    };
    anpassungsfaktor *= energieFaktor[immobilie.energieKlasse] || 1.0;
    
    // Etage (bei ETW)
    if (immobilie.etage) {
      if (immobilie.etage >= 3 && immobilie.aufzug) anpassungsfaktor *= 1.05;
      else if (immobilie.etage >= 4 && !immobilie.aufzug) anpassungsfaktor *= 0.95;
      if (immobilie.etage === 0) anpassungsfaktor *= 0.97; // EG etwas weniger
    }
    
    // Balkon/Terrasse
    if (immobilie.balkon) anpassungsfaktor *= 1.03;
    if (immobilie.terrasse || immobilie.garten) anpassungsfaktor *= 1.05;
    
    const angepassterPreisProQm = basisPreisProQm * anpassungsfaktor;
    marktwert = Math.round(angepassterPreisProQm * immobilie.wohnflaeche);
    
    details = {
      methode: 'Vergleichswertverfahren',
      basisPreisProQm: Math.round(basisPreisProQm),
      anpassungsfaktor: anpassungsfaktor.toFixed(2),
      angepassterPreisProQm: Math.round(angepassterPreisProQm),
      wohnflaeche: immobilie.wohnflaeche
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // METHODE 3: VEREINFACHTE MARKTWERT-SCHÄTZUNG (Fallback)
  // ═══════════════════════════════════════════════════════════════════════
  
  else {
    // Kombination aus Ertragswert (Miete × Faktor) und Vergleichswert (€/m²)
    const regional = getRegionaleBenchmarks(immobilie.stadt);
    
    // Ertragswert-Näherung: Jahresmiete × regionaler Zielfaktor
    const ertragswertNaeherung = immobilie.kaltmiete * 12 * regional.maxFaktor * 0.9;
    
    // Vergleichswert-Näherung: €/m² × Fläche
    const vergleichsPreisQm = getVergleichspreisProQm(immobilie.plz, immobilie.stadt);
    const vergleichswertNaeherung = vergleichsPreisQm * immobilie.wohnflaeche;
    
    // Gewichteter Durchschnitt (60% Ertragswert für Kapitalanlage)
    marktwert = Math.round(ertragswertNaeherung * 0.6 + vergleichswertNaeherung * 0.4);
    
    details = {
      methode: 'Kombinierte Schätzung',
      ertragswertNaeherung: Math.round(ertragswertNaeherung),
      vergleichswertNaeherung: Math.round(vergleichswertNaeherung),
      gewichtung: '60% Ertrag / 40% Vergleich'
    };
  }
  
  return { marktwert, details };
}

// Liegenschaftszinssätze nach Stadt/Lage (aus Gutachterausschuss)
function getLiegenschaftszins(stadt, lage = 'mittel') {
  const basisZins = {
    'muenchen': 0.025,    // 2.5% - sehr niedrig wegen hoher Nachfrage
    'frankfurt': 0.030,
    'hamburg': 0.030,
    'berlin': 0.032,
    'duesseldorf': 0.035,
    'koeln': 0.035,
    'stuttgart': 0.032,
    'nuernberg': 0.040,
    'leipzig': 0.045,
    'dresden': 0.045,
    'dortmund': 0.050,
    'essen': 0.050,
    'default': 0.045
  };
  
  const stadtKey = stadt?.toLowerCase().replace(/[^a-z]/g, '') || 'default';
  let zins = basisZins[stadtKey] || basisZins['default'];
  
  // Lage-Anpassung
  if (lage === 'sehr_gut' || lage === 'A') zins -= 0.005;
  if (lage === 'einfach' || lage === 'D') zins += 0.010;
  
  return zins;
}

// Vergleichspreise pro m² nach PLZ/Stadt (vereinfacht)
function getVergleichspreisProQm(plz, stadt) {
  // In Produktion: API-Anbindung an GREIX, Sprengnetter, oder PriceHubble
  // Hier: Vereinfachte Schätzung basierend auf Stadt
  
  const stadtPreise = {
    'muenchen': 9500,
    'frankfurt': 6500,
    'hamburg': 6000,
    'berlin': 5000,
    'duesseldorf': 4800,
    'koeln': 4500,
    'stuttgart': 5500,
    'nuernberg': 3800,
    'leipzig': 3200,
    'dresden': 3000,
    'dortmund': 2400,
    'essen': 2200,
    'default': 3000
  };
  
  const stadtKey = stadt?.toLowerCase().replace(/[^a-z]/g, '') || 'default';
  return stadtPreise[stadtKey] || stadtPreise['default'];
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 DEAL-SCORE: Wie gut ist dieser KAUF? (100 Punkte)
// ═══════════════════════════════════════════════════════════════════════════

function berechneDealScore(immobilie, marktwertErgebnis) {
  let score = 0;
  const details = {};
  const marktwert = marktwertErgebnis.marktwert;
  const kaufpreis = immobilie.kaufpreis;
  
  // Rabatt zum Marktwert berechnen
  const rabatt = (marktwert - kaufpreis) / marktwert;
  const rabattProzent = rabatt * 100;
  const instantEquity = marktwert - kaufpreis;
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 1: UNTER MARKTWERT KAUFEN (40 Punkte max.)
  // Das ist der WICHTIGSTE Faktor! "Margin of Safety"
  // ═══════════════════════════════════════════════════════════════════════
  
  let rabattPunkte = 0;
  let rabattBewertung = '';
  
  if (rabattProzent >= 20) {
    rabattPunkte = 40;
    rabattBewertung = '🟢🟢 Ausgezeichnet! 20%+ unter Marktwert = sofortiger Profit!';
  } else if (rabattProzent >= 15) {
    rabattPunkte = 35;
    rabattBewertung = '🟢🟢 Sehr gut! 15-20% unter Marktwert';
  } else if (rabattProzent >= 10) {
    rabattPunkte = 28;
    rabattBewertung = '🟢 Gut! 10-15% unter Marktwert';
  } else if (rabattProzent >= 5) {
    rabattPunkte = 20;
    rabattBewertung = '🟡 Akzeptabel. 5-10% unter Marktwert';
  } else if (rabattProzent >= 0) {
    rabattPunkte = 12;
    rabattBewertung = '🟡 Marktpreis – kein besonderer Deal';
  } else if (rabattProzent >= -5) {
    rabattPunkte = 6;
    rabattBewertung = '🟠 Leicht über Marktwert';
  } else {
    rabattPunkte = 0;
    rabattBewertung = '🔴 Deutlich über Marktwert – zu teuer!';
  }
  
  details.rabatt = {
    punkte: rabattPunkte,
    marktwert,
    kaufpreis,
    differenz: instantEquity,
    prozent: rabattProzent.toFixed(1) + '%',
    bewertung: rabattBewertung
  };
  score += rabattPunkte;
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 2: KAUFPREISFAKTOR VS. REGIONAL (20 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  const kaufpreisfaktor = kaufpreis / (immobilie.kaltmiete * 12);
  const regional = getRegionaleBenchmarks(immobilie.stadt);
  
  let faktorPunkte = 0;
  if (kaufpreisfaktor <= regional.maxFaktor * 0.7) faktorPunkte = 20;
  else if (kaufpreisfaktor <= regional.maxFaktor * 0.8) faktorPunkte = 16;
  else if (kaufpreisfaktor <= regional.maxFaktor * 0.9) faktorPunkte = 12;
  else if (kaufpreisfaktor <= regional.maxFaktor) faktorPunkte = 8;
  else if (kaufpreisfaktor <= regional.maxFaktor * 1.1) faktorPunkte = 4;
  else faktorPunkte = 0;
  
  details.kaufpreisfaktor = {
    punkte: faktorPunkte,
    wert: kaufpreisfaktor.toFixed(1),
    regionalMax: regional.maxFaktor,
    bewertung: kaufpreisfaktor <= regional.maxFaktor ? '🟢 Im Rahmen' : '🔴 Zu hoch für Region'
  };
  score += faktorPunkte;
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 3: VERHANDLUNGSPOTENZIAL (15 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let verhandlungsPunkte = 7; // Neutral
  
  if (immobilie.inseratDauer > 90) {
    verhandlungsPunkte += 4;
    details.verhandlung = { hinweis: 'Lange inseriert (>90 Tage) – Verhandlungsspielraum!' };
  }
  if (immobilie.verkaeufermotivation === 'hoch') {
    verhandlungsPunkte += 4;
  }
  if (immobilie.konkurrenz === 'keine') {
    verhandlungsPunkte += 2;
  }
  
  details.verhandlung = { ...details.verhandlung, punkte: Math.min(15, verhandlungsPunkte) };
  score += Math.min(15, verhandlungsPunkte);
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 4: NEBENKOSTEN-EFFIZIENZ (10 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let nebenkostenPunkte = 5;
  
  if (!immobilie.mitMakler) {
    nebenkostenPunkte += 3;
    details.nebenkosten = { hinweis: 'Ohne Makler = 3-4% gespart!' };
  }
  if (immobilie.bundesland === 'Bayern' || immobilie.bundesland === 'Sachsen') {
    nebenkostenPunkte += 2;
    details.nebenkosten = { ...details.nebenkosten, hinweis2: 'Niedrige Grunderwerbsteuer (3.5%)' };
  }
  
  details.nebenkosten = { ...details.nebenkosten, punkte: Math.min(10, nebenkostenPunkte) };
  score += Math.min(10, nebenkostenPunkte);
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 5: EXIT-OPTIONEN (15 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let exitPunkte = 7;
  
  // Gute Wiederverkaufbarkeit
  if (immobilie.wohnflaeche >= 40 && immobilie.wohnflaeche <= 100) exitPunkte += 3;
  if (immobilie.zimmer >= 2 && immobilie.zimmer <= 4) exitPunkte += 2;
  if (['A', 'B'].includes(immobilie.lage)) exitPunkte += 3;
  
  details.exit = { punkte: Math.min(15, exitPunkte) };
  score += Math.min(15, exitPunkte);
  
  // ═══════════════════════════════════════════════════════════════════════
  // FINALE DEAL-SCORE
  // ═══════════════════════════════════════════════════════════════════════
  
  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    details,
    instantEquity,
    rabattProzent,
    kategorie: getDealScoreKategorie(score)
  };
}

function getDealScoreKategorie(score) {
  if (score >= 85) return { emoji: '🟢🟢', text: 'TOP-DEAL!', beschreibung: 'Hervorragender Kauf – sofort zuschlagen!' };
  if (score >= 70) return { emoji: '🟢', text: 'Guter Deal', beschreibung: 'Attraktiver Preis, empfehlenswert' };
  if (score >= 55) return { emoji: '🟡', text: 'Fairer Deal', beschreibung: 'Marktgerechter Preis, verhandelbar' };
  if (score >= 40) return { emoji: '🟠', text: 'Mäßiger Deal', beschreibung: 'Eher teuer, nur mit Verhandlung' };
  return { emoji: '🔴', text: 'Schlechter Deal', beschreibung: 'Zu teuer – weitergehen!' };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏠 INVESTMENT-SCORE: Wie gut ist diese ANLAGE? (100 Punkte)
// ═══════════════════════════════════════════════════════════════════════════

function berechneInvestmentScore(immobilie, finanzierung, userProfil = {}) {
  let score = 0;
  const details = {};
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 1: CASHFLOW MIT RISIKOPUFFER (25 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  // 100€/Monat Risikopuffer einrechnen
  const risikopuffer = 100;
  const bereinigterCashflow = immobilie.cashflow - risikopuffer;
  
  let cashflowPunkte = 0;
  if (bereinigterCashflow >= 200) cashflowPunkte = 25;
  else if (bereinigterCashflow >= 100) cashflowPunkte = 22;
  else if (bereinigterCashflow >= 0) cashflowPunkte = 18;
  else if (immobilie.cashflow >= 50) cashflowPunkte = 14;
  else if (immobilie.cashflow >= 0) cashflowPunkte = 10;
  else if (immobilie.cashflow >= -100) cashflowPunkte = 6;
  else if (immobilie.cashflow >= -200) cashflowPunkte = 3;
  else cashflowPunkte = 0;
  
  details.cashflow = {
    punkte: cashflowPunkte,
    brutto: immobilie.cashflow,
    bereinigt: bereinigterCashflow,
    bewertung: bewerteCashflow(immobilie.cashflow)
  };
  score += cashflowPunkte;
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 2: LAGE-QUALITÄT (25 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let lagePunkte = berechneMikrolagePunkte(immobilie);
  details.lage = lagePunkte;
  score += lagePunkte.punkte;
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 3: WERTSTEIGERUNGSPOTENZIAL (20 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let wertsteigerungPunkte = 10; // Neutral
  const wertsteigerungDetails = [];
  
  // Mieterhöhungspotenzial
  if (immobilie.istMiete && immobilie.marktMiete) {
    const mietPotenzial = (immobilie.marktMiete - immobilie.istMiete) / immobilie.istMiete;
    if (mietPotenzial > 0.20) {
      wertsteigerungPunkte += 5;
      wertsteigerungDetails.push(`Mieterhöhungspotenzial +${Math.round(mietPotenzial * 100)}%`);
    } else if (mietPotenzial > 0.10) {
      wertsteigerungPunkte += 3;
      wertsteigerungDetails.push(`Mieterhöhungspotenzial +${Math.round(mietPotenzial * 100)}%`);
    }
  }
  
  // Sanierungspotenzial (Forced Appreciation)
  if (['E', 'F', 'G', 'H'].includes(immobilie.energieKlasse)) {
    wertsteigerungPunkte += 3;
    wertsteigerungDetails.push('Sanierungspotenzial mit KfW-Förderung');
  }
  
  // Marktentwicklung
  if (immobilie.entwicklungsgebiet) {
    wertsteigerungPunkte += 2;
    wertsteigerungDetails.push('Aufwertungsgebiet');
  }
  
  details.wertsteigerung = {
    punkte: Math.min(20, wertsteigerungPunkte),
    faktoren: wertsteigerungDetails
  };
  score += Math.min(20, wertsteigerungPunkte);
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 4: OBJEKTQUALITÄT (15 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let qualitaetPunkte = 7;
  
  // Zustand
  const zustandBonus = {
    'Neubau': 5, 'Kernsaniert': 4, 'Saniert': 3, 'Gepflegt': 1,
    'Renovierungsbedürftig': -2, 'Sanierungsbedürftig': -4
  };
  qualitaetPunkte += zustandBonus[immobilie.zustand] || 0;
  
  // Energieeffizienz
  if (['A+', 'A', 'B'].includes(immobilie.energieKlasse)) qualitaetPunkte += 3;
  else if (['G', 'H'].includes(immobilie.energieKlasse)) qualitaetPunkte -= 2;
  
  details.qualitaet = {
    punkte: Math.max(0, Math.min(15, qualitaetPunkte)),
    zustand: immobilie.zustand,
    energieKlasse: immobilie.energieKlasse
  };
  score += Math.max(0, Math.min(15, qualitaetPunkte));
  
  // ═══════════════════════════════════════════════════════════════════════
  // FAKTOR 5: MIETERQUALITÄT & NACHFRAGE (15 Punkte max.)
  // ═══════════════════════════════════════════════════════════════════════
  
  let mieterPunkte = 7;
  
  // Hohe Nachfrage in der Region
  const regional = getRegionaleBenchmarks(immobilie.stadt);
  if (regional.maxFaktor >= 30) mieterPunkte += 4; // A-Stadt = hohe Nachfrage
  else if (regional.maxFaktor >= 25) mieterPunkte += 2;
  
  // Bestehender Mietvertrag
  if (immobilie.vermietet && immobilie.mieterSeit > 3) {
    mieterPunkte += 3;
    details.mieter = { hinweis: 'Langjähriger Mieter = Stabilität' };
  }
  
  // Leerstandsrisiko
  if (immobilie.leerstandsquoteRegion > 0.05) {
    mieterPunkte -= 3;
  }
  
  details.mieter = { ...details.mieter, punkte: Math.max(0, Math.min(15, mieterPunkte)) };
  score += Math.max(0, Math.min(15, mieterPunkte));
  
  // ═══════════════════════════════════════════════════════════════════════
  // FINALE INVESTMENT-SCORE
  // ═══════════════════════════════════════════════════════════════════════
  
  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    details,
    kategorie: getInvestmentScoreKategorie(score)
  };
}

function getInvestmentScoreKategorie(score) {
  if (score >= 85) return { emoji: '🟢🟢', text: 'TOP-Investment', beschreibung: 'Hervorragende Anlage für Buy & Hold' };
  if (score >= 70) return { emoji: '🟢', text: 'Gutes Investment', beschreibung: 'Solide Anlage mit guter Perspektive' };
  if (score >= 55) return { emoji: '🟡', text: 'Akzeptables Investment', beschreibung: 'OK als Anlage, einige Kompromisse' };
  if (score >= 40) return { emoji: '🟠', text: 'Mäßiges Investment', beschreibung: 'Schwächen vorhanden, kritisch prüfen' };
  return { emoji: '🔴', text: 'Schwaches Investment', beschreibung: 'Für langfristige Anlage nicht geeignet' };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 GESAMT-SCORE: Kombiniert Deal + Investment
// ═══════════════════════════════════════════════════════════════════════════

function berechneGesamtScore(immobilie, finanzierung, userProfil = {}) {
  // Marktwert ermitteln
  const marktwertErgebnis = berechneMarktwert(immobilie);
  
  // Beide Scores berechnen
  const dealScore = berechneDealScore(immobilie, marktwertErgebnis);
  const investmentScore = berechneInvestmentScore(immobilie, finanzierung, userProfil);
  
  // ═══════════════════════════════════════════════════════════════════════
  // GEWICHTUNG JE NACH STRATEGIE
  // ═══════════════════════════════════════════════════════════════════════
  
  let dealGewicht, investmentGewicht;
  
  switch (userProfil.strategie) {
    case 'flip':
      // Flipper: Deal-Qualität am wichtigsten
      dealGewicht = 0.70;
      investmentGewicht = 0.30;
      break;
    case 'value_add':
      // Value-Add: Ausgewogen
      dealGewicht = 0.55;
      investmentGewicht = 0.45;
      break;
    case 'buy_and_hold':
    default:
      // Buy & Hold: Investment-Qualität wichtiger
      dealGewicht = 0.40;
      investmentGewicht = 0.60;
      break;
  }
  
  const gewichteterScore = Math.round(
    dealScore.score * dealGewicht + 
    investmentScore.score * investmentGewicht
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // INSTANT EQUITY AUF CASHFLOW UMRECHNEN (Dein Kerngedanke!)
  // ═══════════════════════════════════════════════════════════════════════
  
  /*
  LOGIK: Wenn du 30.000€ unter Marktwert kaufst und 10 Jahre hältst,
  entspricht das 3.000€/Jahr oder 250€/Monat "virtuellem Cashflow".
  
  Dieser kann negativen Cashflow ausgleichen!
  */
  
  const haltedauer = userProfil.geplanteHaltedauer || 10; // Jahre
  const instantEquityProJahr = dealScore.instantEquity / haltedauer;
  const instantEquityProMonat = instantEquityProJahr / 12;
  
  // "Bereinigter Total-Cashflow" = echter Cashflow + anteiliger Equity-Gewinn
  const totalValueCreationProMonat = immobilie.cashflow + instantEquityProMonat;
  
  // ═══════════════════════════════════════════════════════════════════════
  // NEGATIVER CASHFLOW AKZEPTABEL?
  // ═══════════════════════════════════════════════════════════════════════
  
  /*
  REGEL: Für jeden 100€ negativen Cashflow brauchst du mind. 15.000-20.000€ 
  Instant Equity als Ausgleich.
  
  Beispiel: -200€/Monat Cashflow = 2.400€/Jahr
  → Braucht: 36.000-48.000€ unter Marktwert
  */
  
  let negativCashflowAkzeptabel = false;
  let negativCashflowBegruendung = '';
  
  if (immobilie.cashflow < 0) {
    const benoetigtesEquity = Math.abs(immobilie.cashflow) * 150; // 150× monatlicher Verlust
    
    if (dealScore.instantEquity >= benoetigtesEquity) {
      negativCashflowAkzeptabel = true;
      negativCashflowBegruendung = `✅ Negativer Cashflow (${immobilie.cashflow}€/Monat) ist akzeptabel, weil du ${dealScore.instantEquity.toLocaleString()}€ unter Marktwert kaufst (mind. ${benoetigtesEquity.toLocaleString()}€ nötig).`;
    } else {
      negativCashflowBegruendung = `⚠️ Negativer Cashflow (${immobilie.cashflow}€/Monat) ist NICHT ausreichend durch Equity-Gewinn gedeckt. Du kaufst ${dealScore.instantEquity.toLocaleString()}€ unter Marktwert, bräuchtest aber ${benoetigtesEquity.toLocaleString()}€.`;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════
  // ERGEBNIS
  // ═══════════════════════════════════════════════════════════════════════
  
  return {
    // Einzelne Scores
    dealScore,
    investmentScore,
    
    // Kombinierter Score
    gesamtScore: gewichteterScore,
    gewichtung: { deal: dealGewicht, investment: investmentGewicht },
    
    // Marktwert-Analyse
    marktwert: marktwertErgebnis,
    instantEquity: dealScore.instantEquity,
    rabattProzent: dealScore.rabattProzent,
    
    // Total Value Creation (Dein Kerngedanke umgesetzt!)
    totalValueCreation: {
      proMonat: Math.round(totalValueCreationProMonat),
      proJahr: Math.round(totalValueCreationProMonat * 12),
      cashflowAnteil: immobilie.cashflow,
      equityAnteil: Math.round(instantEquityProMonat),
      erklaerung: `Echter Cashflow (${immobilie.cashflow}€) + anteiliger Equity-Gewinn (${Math.round(instantEquityProMonat)}€) = ${Math.round(totalValueCreationProMonat)}€/Monat Total Value Creation`
    },
    
    // Cashflow-Analyse
    negativCashflowAnalyse: {
      akzeptabel: negativCashflowAkzeptabel,
      begruendung: negativCashflowBegruendung
    },
    
    // Finale Bewertung
    kategorie: getGesamtScoreKategorie(gewichteterScore, dealScore.score, investmentScore.score)
  };
}

function getGesamtScoreKategorie(gesamt, deal, investment) {
  // Spezialfälle
  if (deal >= 80 && investment < 50) {
    return { emoji: '🟡💰', text: 'Guter Deal, schwaches Investment', beschreibung: 'Günstig gekauft, aber Objekt/Lage mäßig. Für Flipper interessant!' };
  }
  if (investment >= 80 && deal < 50) {
    return { emoji: '🟡🏠', text: 'Gutes Investment, teurer Deal', beschreibung: 'Tolles Objekt, aber zu teuer. Verhandeln!' };
  }
  
  // Standard
  if (gesamt >= 85) return { emoji: '🟢🟢', text: 'EXZELLENT', beschreibung: 'Top-Deal UND Top-Investment – Zuschlagen!' };
  if (gesamt >= 70) return { emoji: '🟢', text: 'EMPFEHLENSWERT', beschreibung: 'Guter Kauf mit solider Perspektive' };
  if (gesamt >= 55) return { emoji: '🟡', text: 'PRÜFENSWERT', beschreibung: 'Akzeptabel, aber Verbesserungspotenzial' };
  if (gesamt >= 40) return { emoji: '🟠', text: 'VORSICHT', beschreibung: 'Einige Schwächen, nur mit Abschlag kaufen' };
  return { emoji: '🔴', text: 'NICHT EMPFOHLEN', beschreibung: 'Zu teuer und/oder zu schwaches Objekt' };
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 BEISPIEL-OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

/*
═══════════════════════════════════════════════════════════════════════════════
🏠 IMMOBILIEN-ANALYSE: Musterstraße 123, Frankfurt
═══════════════════════════════════════════════════════════════════════════════

📊 MARKTWERT-ANALYSE
├─ Geschätzter Marktwert: 320.000€ (Ertragswertverfahren)
├─ Kaufpreis: 285.000€
├─ Differenz: +35.000€ unter Marktwert!
└─ Rabatt: 10.9% 🟢

═══════════════════════════════════════════════════════════════════════════════

🎯 DEAL-SCORE: 72/100 🟢 "Guter Deal"
├─ Unter Marktwert kaufen: 28/40 (10.9% Rabatt)
├─ Kaufpreisfaktor: 12/20 (Faktor 23.8, regional OK)
├─ Verhandlungspotenzial: 10/15
├─ Nebenkosten-Effizienz: 7/10
└─ Exit-Optionen: 15/15

🏠 INVESTMENT-SCORE: 61/100 🟡 "Akzeptabel"
├─ Cashflow: 10/25 (-85€/Monat, nach Risikopuffer)
├─ Lage-Qualität: 18/25 (B-Lage Frankfurt)
├─ Wertsteigerung: 13/20
├─ Objektqualität: 10/15
└─ Mieter/Nachfrage: 10/15

═══════════════════════════════════════════════════════════════════════════════

💡 TOTAL VALUE CREATION (Dein tatsächlicher Gewinn!)
├─ Echter Cashflow: -85€/Monat
├─ + Anteiliger Equity-Gewinn: +292€/Monat (35.000€ ÷ 10 Jahre ÷ 12)
├─ = TOTAL: +207€/Monat! 🟢
└─ Der negative Cashflow ist durch den günstigen Kauf mehr als ausgeglichen!

═══════════════════════════════════════════════════════════════════════════════

⚖️ GESAMT-BEWERTUNG: 68/100 🟢 "EMPFEHLENSWERT"

Gewichtung: 40% Deal / 60% Investment (Buy & Hold Strategie)

FAZIT: Du kaufst 35.000€ unter Marktwert. Der leicht negative 
Cashflow (-85€) wird durch den Equity-Gewinn überkompensiert.
Mit Mieterhöhungspotenzial wird das Objekt in 2-3 Jahren 
Cashflow-positiv sein.

✅ EMPFEHLUNG: KAUFEN – aber maximal 290.000€ bieten!

═══════════════════════════════════════════════════════════════════════════════
*/

### Entscheidungslogik (Profi-Framework)

#### Absolute Dealbreaker (FINGER WEG!)

```javascript
const DEALBREAKER = [
  'Unklare Eigentums-/Lastenlage (Wohnrecht, Nießbrauch)',
  'Massive Bauschäden/Statik/Feuchte mit unklarer Sanierbarkeit',
  'WEG-Governance hochriskant (Mehrheitseigentümer, Dauerstreit, leere Kasse)',
  'Cashflow im Worst-Case-Szenario nicht tragfähig',
  'Fehlende Kernunterlagen trotz Nachfrage',
  'Erbpacht mit Restlaufzeit < 30 Jahre',
  'Zwangsversteigerungsvermerk im Grundbuch',
  'Asbest/Altlasten ohne klaren Sanierungsplan',
  'Sperrminorität eines unkooperativen Eigentümers',
  'Leerstandsquote im Gebäude > 20%'
];

function pruefeAufDealbreaker(immobilie) {
  const gefunden = [];
  
  if (immobilie.wohnrecht || immobilie.niessbrauch) {
    gefunden.push({ typ: 'Lastenlage', details: 'Wohnrecht oder Nießbrauch eingetragen' });
  }
  if (immobilie.baumaengel?.schwerwiegend) {
    gefunden.push({ typ: 'Bauschäden', details: 'Massive Bauschäden ohne klare Sanierbarkeit' });
  }
  if (immobilie.wegProbleme || immobilie.erhaltungsruecklage < immobilie.sollRuecklage * 0.3) {
    gefunden.push({ typ: 'WEG-Risiko', details: 'Kritische Eigentümergemeinschaft oder leere Kasse' });
  }
  if (immobilie.erbpacht && immobilie.erbpachtRestlaufzeit < 30) {
    gefunden.push({ typ: 'Erbpacht', details: `Nur noch ${immobilie.erbpachtRestlaufzeit} Jahre Restlaufzeit` });
  }
  
  return {
    hatDealbreaker: gefunden.length > 0,
    dealbreaker: gefunden
  };
}
```

#### Verhandelbar (Preisabschlag fordern!)

| Mangel | Typischer Abschlag | Nachweis |
|--------|-------------------|----------|
| Sanierungsstau (bezifferbar) | Sanierungskosten + 10% Puffer | Kostenvoranschläge |
| Schlechte Energieklasse (E-H) | 50-150€/m² | Energieberater-Schätzung |
| Mietvertrag unter Markt | 12× Mietdifferenz | Mietspiegel-Vergleich |
| Fehlende Stellplätze | 10.000-30.000€ je nach Lage | Marktvergleich |
| Renovierungsbedarf innen | 300-600€/m² | Handwerker-Angebote |
| Alte Heizung (>20 Jahre) | 15.000-30.000€ | Heizungsbauer-Angebot |
| Fenster vor 1995 | 500-800€/Fenster | Fensterbauer-Angebot |

#### Transparenzpflicht (für KI-Output)

**Bei JEDER Analyse explizit nennen:**
- Welche Daten fehlen
- Welche Annahmen getroffen wurden
- Welche Unsicherheiten bestehen
- Welche nächsten Schritte erforderlich sind

### Score-Berechnung V2.0 (REGIONAL ANGEPASST!)

```javascript
function berechneImmobilienScoreV2(immobilie, userProfil = {}) {
  // ═══════════════════════════════════════════════════════════
  // STEP 0: Dealbreaker-Check
  // ═══════════════════════════════════════════════════════════
  
  const dealbreaker = pruefeAufDealbreaker(immobilie);
  if (dealbreaker.hatDealbreaker) {
    return {
      score: 0,
      kategorie: { emoji: '🚫', text: 'DEALBREAKER', aktion: 'Nicht kaufen!' },
      dealbreaker: dealbreaker.dealbreaker,
      details: null
    };
  }
  
  let score = 0;
  const details = {};
  const region = getRegionaleBenchmarks(immobilie.stadt || 'default');
  
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 1: CASHFLOW & RENDITE (40 Punkte max.)
  // ═══════════════════════════════════════════════════════════
  
  // Cashflow (25 Punkte) - STRENGER als vorher!
  let cashflowPunkte = 0;
  if (immobilie.cashflow >= 200) cashflowPunkte = 25;
  else if (immobilie.cashflow >= 100) cashflowPunkte = 22;
  else if (immobilie.cashflow >= 0) cashflowPunkte = 18;
  else if (immobilie.cashflow >= -100) cashflowPunkte = 12;
  else if (immobilie.cashflow >= -200) cashflowPunkte = 6;
  else cashflowPunkte = 0;
  
  details.cashflow = {
    punkte: cashflowPunkte,
    wert: immobilie.cashflow,
    bewertung: bewerteCashflow(immobilie.cashflow)
  };
  score += cashflowPunkte;
  
  // Rendite REGIONAL bewertet (15 Punkte)
  let renditePunkte = 0;
  if (immobilie.bruttorendite >= region.topRendite) renditePunkte = 15;
  else if (immobilie.bruttorendite >= region.guteRendite) renditePunkte = 12;
  else if (immobilie.bruttorendite >= region.akzeptableRendite) renditePunkte = 9;
  else if (immobilie.bruttorendite >= region.akzeptableRendite - 0.5) renditePunkte = 5;
  else renditePunkte = 2;
  
  details.rendite = {
    punkte: renditePunkte,
    wert: immobilie.bruttorendite,
    benchmark: region,
    bewertung: bewerteRenditeRegional(immobilie.bruttorendite, immobilie.stadt)
  };
  score += renditePunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 2: OBJEKTQUALITÄT (30 Punkte max.)
  // ═══════════════════════════════════════════════════════════
  
  // Mikrolage (15 Punkte) - DIFFERENZIERTER
  let lagePunkte = berechneMikrolagePunkte(immobilie);
  details.lage = {
    punkte: lagePunkte.punkte,
    faktoren: lagePunkte.faktoren
  };
  score += lagePunkte.punkte;
  
  // Zustand (10 Punkte)
  const zustandMap = { 
    'Neubau': 10, 'Kernsaniert': 9, 'Saniert': 8, 'Modernisiert': 7,
    'Gepflegt': 6, 'Renovierungsbedürftig': 4, 'Sanierungsbedürftig': 2, 'Abrissreif': 0
  };
  const zustandPunkte = zustandMap[immobilie.zustand] || 5;
  details.zustand = { punkte: zustandPunkte, wert: immobilie.zustand };
  score += zustandPunkte;
  
  // Energie (5 Punkte) - MIT FÖRDERUNGS-BONUS!
  let energiePunkte = { 
    'A+': 5, 'A': 5, 'B': 4, 'C': 4, 'D': 3, 'E': 2, 'F': 1, 'G': 0, 'H': 0 
  }[immobilie.energieKlasse] || 2;
  
  let energieBonus = null;
  if (['F', 'G', 'H'].includes(immobilie.energieKlasse)) {
    if (userProfil.kinder > 0) {
      energiePunkte += 2;
      energieBonus = '✅ KfW 308 "Jung kauft Alt" förderfähig – 1,12% Zins!';
    }
    if (userProfil.sanierungGeplant) {
      energiePunkte += 1;
      energieBonus = (energieBonus || '') + ' ✅ KfW 261 bis 67.500€ Zuschuss möglich!';
    }
  }
  details.energie = { punkte: energiePunkte, klasse: immobilie.energieKlasse, bonus: energieBonus };
  score += energiePunkte;
  
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 3: RISIKOFAKTOREN (20 Punkte max.)
  // ═══════════════════════════════════════════════════════════
  
  let risikoPunkte = 20;
  const risikoDetails = [];
  
  if (immobilie.wegEinheiten > 100) { risikoPunkte -= 2; risikoDetails.push('Große WEG (>100 Einheiten)'); }
  if (immobilie.erhaltungsruecklageProzent < 20) { risikoPunkte -= 4; risikoDetails.push('Erhaltungsrücklage unter Soll!'); }
  if (immobilie.sonderumlagenLetzte5Jahre > 0) { risikoPunkte -= 3; risikoDetails.push(`Sonderumlage in letzten 5 Jahren`); }
  if (immobilie.baujahr < 1960 && !immobilie.kernsaniert) { risikoPunkte -= 4; risikoDetails.push('Altbau vor 1960 ohne Kernsanierung'); }
  if (immobilie.baujahr >= 1960 && immobilie.baujahr < 1980 && !immobilie.saniert) { risikoPunkte -= 2; risikoDetails.push('70er-Jahre-Bau – Asbest prüfen!'); }
  
  if (immobilie.erbpacht) {
    const restlaufzeit = immobilie.erbpachtRestlaufzeit || 50;
    if (restlaufzeit < 40) { risikoPunkte -= 6; risikoDetails.push(`Erbpacht nur noch ${restlaufzeit} Jahre`); }
    else if (restlaufzeit < 60) { risikoPunkte -= 3; risikoDetails.push(`Erbpacht noch ${restlaufzeit} Jahre`); }
    else { risikoPunkte -= 1; risikoDetails.push(`Erbpacht noch ${restlaufzeit} Jahre (akzeptabel)`); }
  }
  
  if (immobilie.kaufpreisfaktor > region.faktorGrenze) { risikoPunkte -= 3; risikoDetails.push(`Faktor über Regional-Grenze`); }
  if (immobilie.kaufpreisfaktor > region.faktorGrenze * 1.15) { risikoPunkte -= 3; risikoDetails.push('Kaufpreis deutlich überhöht!'); }
  
  details.risiko = { punkte: Math.max(0, risikoPunkte), faktoren: risikoDetails };
  score += Math.max(0, risikoPunkte);
  
  // ═══════════════════════════════════════════════════════════
  // KATEGORIE 4: WERTSTEIGERUNGSPOTENZIAL (10 Punkte max.)
  // ═══════════════════════════════════════════════════════════
  
  let potenzialPunkte = 5;
  const potenzialDetails = [];
  
  if (immobilie.istMiete && immobilie.marktMiete) {
    const mietPotenzial = (immobilie.marktMiete - immobilie.istMiete) / immobilie.istMiete;
    if (mietPotenzial > 0.15) { potenzialPunkte += 3; potenzialDetails.push(`Mieterhöhungspotenzial +${Math.round(mietPotenzial * 100)}%`); }
    else if (mietPotenzial > 0.05) { potenzialPunkte += 1; potenzialDetails.push(`Leichtes Mietpotenzial`); }
  }
  
  if (immobilie.entwicklungsgebiet) { potenzialPunkte += 2; potenzialDetails.push('Aufwertungsgebiet'); }
  
  // DENKMAL = BONUS für Kapitalanleger!
  if (immobilie.denkmalschutz) {
    if (userProfil.nutzung === 'kapitalanlage' && userProfil.hoherSteuersatz) {
      potenzialPunkte += 3;
      potenzialDetails.push('🏛️ Denkmal-AfA: 100% in 12 Jahren absetzbar!');
    } else {
      potenzialPunkte += 1;
      potenzialDetails.push('Denkmalschutz (Steuervorteile möglich)');
    }
  }
  
  details.potenzial = { punkte: Math.min(10, potenzialPunkte), faktoren: potenzialDetails };
  score += Math.min(10, potenzialPunkte);
  
  // ═══════════════════════════════════════════════════════════
  // FINALE
  // ═══════════════════════════════════════════════════════════
  
  const finalScore = Math.round(Math.max(0, Math.min(100, score)));
  
  return {
    score: finalScore,
    kategorie: getScoreKategorieV2(finalScore),
    details,
    maxPunkte: { cashflow: 25, rendite: 15, lage: 15, zustand: 10, energie: 5, risiko: 20, potenzial: 10, gesamt: 100 }
  };
}

function berechneMikrolagePunkte(immobilie) {
  let punkte = 7;
  const faktoren = [];
  
  if (immobilie.entfernungBahnhof <= 500) { punkte += 3; faktoren.push('✅ Sehr gute ÖPNV-Anbindung'); }
  else if (immobilie.entfernungBahnhof <= 1000) { punkte += 2; faktoren.push('✅ Gute ÖPNV-Anbindung'); }
  else if (immobilie.entfernungBahnhof > 2000) { punkte -= 2; faktoren.push('⚠️ Schlechte ÖPNV-Anbindung'); }
  
  if (immobilie.nahversorger <= 500) { punkte += 1; faktoren.push('✅ Einkauf fußläufig'); }
  if (immobilie.hauptstrasse) { punkte -= 2; faktoren.push('⚠️ Lärmbelastung'); }
  if (immobilie.sozialerBrennpunkt) { punkte -= 3; faktoren.push('❌ Sozialer Brennpunkt'); }
  if (immobilie.gruenflaechen) { punkte += 1; faktoren.push('✅ Parks/Grünflächen'); }
  
  return { punkte: Math.max(0, Math.min(15, punkte)), faktoren };
}

function getScoreKategorieV2(score) {
  if (score >= 85) return { emoji: '🟢🟢', text: 'Top-Investment', aktion: 'Schnell handeln!' };
  if (score >= 70) return { emoji: '🟢', text: 'Gutes Investment', aktion: 'Empfehlenswert' };
  if (score >= 55) return { emoji: '🟡', text: 'Prüfenswert', aktion: 'Verhandeln!' };
  if (score >= 40) return { emoji: '🟠', text: 'Vorsicht', aktion: 'Nur mit Preisreduktion' };
  if (score >= 25) return { emoji: '🔴', text: 'Nicht empfohlen', aktion: 'Besser lassen' };
  return { emoji: '🔴🔴', text: 'Finger weg!', aktion: 'Hard Pass' };
}
```

### Empfehlung basierend auf Score V2

| Score | Empfehlung | Aktion |
|-------|------------|--------|
| 85-100 | 🟢🟢 Top-Investment | Schnell handeln! |
| 70-84 | 🟢 Gutes Investment | Empfehlenswert |
| 55-69 | 🟡 Prüfenswert | Verhandeln! |
| 40-54 | 🟠 Vorsicht | Nur mit Preisreduktion |
| 25-39 | 🔴 Nicht empfohlen | Besser lassen |
| 0-24 | 🔴🔴 Finger weg! | Hard Pass |

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