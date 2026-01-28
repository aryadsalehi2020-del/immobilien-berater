"""
Immobilien-Berater Backend
KI-gestützter Immobilienanalyse-Service
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import anthropic
import json
import os
from dotenv import load_dotenv
import httpx
import re

load_dotenv()

app = FastAPI(title="Immobilien-Berater API", version="1.0.0")

# CORS für lokale Entwicklung
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gewichtungen für Kapitalanlage
WEIGHTS_INVESTMENT = {
    "cashflow_rendite": 30,
    "lage": 20,
    "kaufpreis_qm": 15,
    "zukunftspotenzial": 10,
    "zustand_baujahr": 10,
    "energieeffizienz": 5,
    "nebenkosten": 5,
    "grundriss": 3,
    "verkäufertyp": 2,
}

# Gewichtungen für Eigennutzung
WEIGHTS_SELF_USE = {
    "lage": 25,
    "grundriss": 20,
    "zustand_baujahr": 15,
    "zukunftspotenzial": 15,
    "kaufpreis_qm": 10,
    "energieeffizienz": 8,
    "nebenkosten": 5,
    "verkäufertyp": 2,
    "cashflow_rendite": 0,  # Irrelevant für Eigennutzung
}


# No-Go-Kriterien für Immobilien
def check_no_gos(data: 'PropertyData') -> Dict[str, Any]:
    """
    Prüft auf K.O.-Kriterien, die eine Immobilie disqualifizieren

    No-Gos:
    1. Erbpacht / Erbbaurecht
    2. Fertighäuser Baujahr 1960-1990
    3. Energieklasse G oder H

    Returns:
        Dict mit no_go (bool), gründe (List), warnung (str)
    """
    no_gos = []
    warnings = []

    # 1. Erbpacht prüfen
    if data.beschreibung and ('erbpacht' in data.beschreibung.lower() or
                               'erbbaurecht' in data.beschreibung.lower()):
        no_gos.append("Erbpacht/Erbbaurecht erkannt")

    # 2. Fertighäuser 1960-1990
    if data.baujahr and 1960 <= data.baujahr <= 1990:
        if data.objekttyp and 'fertighaus' in data.objekttyp.lower():
            no_gos.append(f"Fertighaus aus Problemzeit (Baujahr {data.baujahr})")
        elif data.beschreibung and 'fertighaus' in data.beschreibung.lower():
            no_gos.append(f"Fertighaus aus Problemzeit (Baujahr {data.baujahr})")
        else:
            # Warnung bei Baujahr, falls unklar ob Fertighaus
            warnings.append(f"Baujahr {data.baujahr}: Prüfe ob Fertighaus (Problemzeit 1960-1990)")

    # 3. Energieklasse G oder H
    if data.energieklasse and data.energieklasse.upper() in ['G', 'H']:
        no_gos.append(f"Sehr schlechte Energieklasse: {data.energieklasse}")

    return {
        "no_go": len(no_gos) > 0,
        "gründe": no_gos,
        "warnungen": warnings,
        "ist_investierbar": len(no_gos) == 0
    }


def calculate_investment_metrics(
    kaufpreis: float,
    jahreskaltmiete: float,
    wohnflaeche: float = None
) -> Dict[str, Any]:
    """
    Berechnet Kaufpreisfaktor und Bruttorendite

    Kaufpreisfaktor = Kaufpreis / Jahreskaltmiete
    - Gut: < 20
    - Mittel: 20-25
    - Schlecht: > 25

    Bruttorendite = (Jahreskaltmiete / Kaufpreis) * 100
    - Sehr gut: > 5%
    - Gut: 4-5%
    - Mittel: 3-4%
    - Schlecht: < 3%
    """
    if not kaufpreis or kaufpreis <= 0:
        return {"fehler": "Kaufpreis ungültig"}

    if not jahreskaltmiete or jahreskaltmiete <= 0:
        return {"fehler": "Jahreskaltmiete ungültig"}

    kaufpreisfaktor = kaufpreis / jahreskaltmiete
    bruttorendite = (jahreskaltmiete / kaufpreis) * 100

    # Bewertung Kaufpreisfaktor
    if kaufpreisfaktor < 20:
        kpf_bewertung = "Sehr gut"
        kpf_score = 90
    elif kaufpreisfaktor < 25:
        kpf_bewertung = "Gut"
        kpf_score = 70
    elif kaufpreisfaktor < 30:
        kpf_bewertung = "Mittel"
        kpf_score = 50
    else:
        kpf_bewertung = "Schlecht"
        kpf_score = 30

    # Bewertung Bruttorendite
    if bruttorendite >= 5:
        br_bewertung = "Sehr gut"
        br_score = 90
    elif bruttorendite >= 4:
        br_bewertung = "Gut"
        br_score = 70
    elif bruttorendite >= 3:
        br_bewertung = "Mittel"
        br_score = 50
    else:
        br_bewertung = "Schlecht"
        br_score = 30

    result = {
        "kaufpreisfaktor": round(kaufpreisfaktor, 2),
        "kaufpreisfaktor_bewertung": kpf_bewertung,
        "kaufpreisfaktor_score": kpf_score,
        "bruttorendite_prozent": round(bruttorendite, 2),
        "bruttorendite_bewertung": br_bewertung,
        "bruttorendite_score": br_score,
    }

    # Optional: Preis pro qm wenn verfügbar
    if wohnflaeche and wohnflaeche > 0:
        result["kaufpreis_pro_qm"] = round(kaufpreis / wohnflaeche, 2)

    return result


def detect_warning_signals(data: 'PropertyData') -> Dict[str, Any]:
    """
    Erkennt Warnsignale im Exposé

    Warnsignale:
    - "Renovierungsbedürftig", "Sanierungsstau", "Handwerkerobjekt"
    - "Verkauf aus Altersgründen" (oft versteckte Mängel)
    - "Nur an Selbstnutzer" (Probleme mit Vermietung)
    - "Keine Besichtigung möglich" (Red Flag)
    - "Sofort frei" bei vermieteten Objekten (Mieterprobleme?)
    - Sehr niedrige Miete bei Altmietern (Mieterhöhungspotenzial eingeschränkt)
    - "Denkmalschutz" (hohe Auflagen)
    - "Milieuschutz" (Einschränkungen)
    """
    warnsignale = []
    schweregrad = 0  # 0-10 Skala

    if not data.beschreibung:
        return {
            "warnsignale": [],
            "anzahl": 0,
            "schweregrad": 0,
            "kritisch": False
        }

    text = data.beschreibung.lower()

    # Sanierungsbedarf
    sanierungsmuster = [
        'renovierungsbedürftig', 'sanierungsbedürftig', 'sanierungsstau',
        'handwerkerobjekt', 'ausbau', 'rohbau', 'kernsaniert werden'
    ]
    for muster in sanierungsmuster:
        if muster in text:
            warnsignale.append(f"Sanierungsbedarf erkannt: '{muster}'")
            schweregrad += 2

    # Verkaufsgründe (verdächtig)
    if 'aus altersgründen' in text or 'altersbedingt' in text:
        warnsignale.append("Verkauf aus Altersgründen (versteckte Mängel möglich)")
        schweregrad += 1

    # Einschränkungen
    if 'nur an selbstnutzer' in text or 'nur eigennutzung' in text:
        warnsignale.append("Nur an Selbstnutzer (Vermietung eingeschränkt)")
        schweregrad += 3

    if 'keine besichtigung' in text:
        warnsignale.append("Keine Besichtigung möglich (Red Flag!)")
        schweregrad += 5

    # Rechtliche Einschränkungen
    if 'denkmalschutz' in text or 'denkmalgeschützt' in text:
        warnsignale.append("Denkmalschutz (hohe Auflagen, Sanierungskosten)")
        schweregrad += 2

    if 'milieuschutz' in text or 'erhaltungssatzung' in text:
        warnsignale.append("Milieuschutz (Modernisierungseinschränkungen)")
        schweregrad += 2

    # Mietrechtliche Probleme
    if 'altmieter' in text and data.aktuelle_miete:
        # Prüfe ob Miete ungewöhnlich niedrig
        if data.wohnflaeche and (data.aktuelle_miete / data.wohnflaeche) < 6:
            warnsignale.append("Sehr niedrige Bestandsmiete bei Altmieter (Mieterhöhungspotenzial eingeschränkt)")
            schweregrad += 2

    # Erbpacht zusätzlich warnen (ist auch No-Go)
    if 'erbpacht' in text or 'erbbaurecht' in text:
        warnsignale.append("KRITISCH: Erbpacht/Erbbaurecht!")
        schweregrad += 5

    return {
        "warnsignale": warnsignale,
        "anzahl": len(warnsignale),
        "schweregrad": min(schweregrad, 10),  # Max 10
        "kritisch": schweregrad >= 5
    }


class PropertyData(BaseModel):
    """Extrahierte Immobiliendaten"""
    kaufpreis: Optional[float] = None
    wohnflaeche: Optional[float] = None
    zimmer: Optional[float] = None
    baujahr: Optional[int] = None
    etage: Optional[str] = None
    nebenkosten: Optional[float] = None
    hausgeld: Optional[float] = None
    energieausweis: Optional[str] = None
    energieklasse: Optional[str] = None
    heizungsart: Optional[str] = None
    adresse: Optional[str] = None
    stadt: Optional[str] = None
    stadtteil: Optional[str] = None
    objekttyp: Optional[str] = None
    zustand: Optional[str] = None
    ausstattung: Optional[str] = None
    balkon_terrasse: Optional[bool] = None
    keller: Optional[bool] = None
    stellplatz: Optional[str] = None
    vermietet: Optional[bool] = None
    aktuelle_miete: Optional[float] = None
    verkäufertyp: Optional[str] = None
    provision: Optional[str] = None
    beschreibung: Optional[str] = None


class AnalysisRequest(BaseModel):
    """Anfrage für Immobilienanalyse"""
    property_data: PropertyData
    verwendungszweck: str  # "kapitalanlage" oder "eigennutzung"
    eigenkapital: Optional[float] = 0
    zinssatz: Optional[float] = 3.75  # Angepasst auf 3.75%
    tilgung: Optional[float] = 1.25   # Angepasst auf 1.25%
    marktpreis_qm: Optional[float] = None  # Falls manuell eingegeben


class CriterionScore(BaseModel):
    """Bewertung eines einzelnen Kriteriums"""
    name: str
    score: float  # 0-100
    gewichtung: float
    gewichteter_score: float
    begründung: str
    details: Optional[dict] = None


class AnalysisResult(BaseModel):
    """Ergebnis der Immobilienanalyse"""
    gesamtscore: float
    verwendungszweck: str
    kriterien: List[CriterionScore]
    cashflow_analyse: Optional[dict] = None
    investment_metriken: Optional[dict] = None  # Kaufpreisfaktor, Bruttorendite
    no_go_check: Optional[dict] = None  # No-Go Prüfung
    warnsignale: Optional[dict] = None  # Warnsignal-Erkennung
    zusammenfassung: str
    stärken: List[str]
    schwächen: List[str]
    empfehlung: str  # "Investieren", "Prüfen", "Ablehnen"
    marktdaten: Optional[dict] = None


def get_anthropic_client():
    """Erstellt Anthropic Client"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY nicht konfiguriert")
    return anthropic.Anthropic(api_key=api_key)


@app.get("/")
async def root():
    return {"message": "Immobilien-Berater API läuft", "version": "1.0.0"}


@app.post("/extract-pdf")
async def extract_pdf_data(file: UploadFile = File(...)):
    """
    Extrahiert Immobiliendaten aus einem PDF-Exposé mittels Claude
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Nur PDF-Dateien werden akzeptiert")
    
    content = await file.read()
    
    # Base64 encoding für Claude
    import base64
    pdf_base64 = base64.b64encode(content).decode('utf-8')
    
    client = get_anthropic_client()
    
    extraction_prompt = """Analysiere dieses Immobilien-Exposé und extrahiere alle relevanten Daten.

Gib die Daten als JSON zurück mit genau diesen Feldern (null wenn nicht gefunden):

{
    "kaufpreis": <Zahl in Euro>,
    "wohnflaeche": <Zahl in qm>,
    "zimmer": <Anzahl>,
    "baujahr": <Jahr>,
    "etage": "<z.B. 2. OG>",
    "nebenkosten": <monatlich in Euro>,
    "hausgeld": <monatlich in Euro>,
    "energieausweis": "<Verbrauch oder Bedarf>",
    "energieklasse": "<A+ bis H>",
    "heizungsart": "<z.B. Gas-Zentralheizung>",
    "adresse": "<Straße und Hausnummer>",
    "stadt": "<Stadt>",
    "stadtteil": "<Stadtteil/Bezirk>",
    "objekttyp": "<z.B. Eigentumswohnung, Einfamilienhaus>",
    "zustand": "<z.B. gepflegt, renovierungsbedürftig, Neubau>",
    "ausstattung": "<z.B. gehoben, normal, einfach>",
    "balkon_terrasse": <true/false>,
    "keller": <true/false>,
    "stellplatz": "<z.B. Tiefgarage, Außenstellplatz, keiner>",
    "vermietet": <true/false>,
    "aktuelle_miete": <monatliche Kaltmiete in Euro falls vermietet>,
    "verkäufertyp": "<privat oder Makler>",
    "provision": "<z.B. 3,57% oder provisionsfrei>",
    "beschreibung": "<Kurze Zusammenfassung des Objekts in 2-3 Sätzen>"
}

Antworte NUR mit dem JSON, kein anderer Text."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": "application/pdf",
                                "data": pdf_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": extraction_prompt
                        }
                    ]
                }
            ]
        )
        
        # Parse JSON response
        json_text = response.content[0].text.strip()
        # Entferne mögliche Markdown-Codeblöcke
        if json_text.startswith("```"):
            json_text = json_text.split("```")[1]
            if json_text.startswith("json"):
                json_text = json_text[4:]
        json_text = json_text.strip()
        
        property_data = json.loads(json_text)
        return PropertyData(**property_data)
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Parsen der KI-Antwort: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der PDF-Extraktion: {str(e)}")


@app.post("/search-market-data")
async def search_market_data(stadt: str, stadtteil: Optional[str] = None):
    """
    Sucht aktuelle Marktdaten für eine Region
    Hinweis: In der Produktion würde hier eine echte Datenquelle angebunden
    """
    client = get_anthropic_client()
    
    location = f"{stadtteil}, {stadt}" if stadtteil else stadt
    
    search_prompt = f"""Ich brauche aktuelle Immobilien-Marktdaten für {location}, Deutschland.

Basierend auf deinem Wissen, schätze folgende Werte:

1. Durchschnittlicher Kaufpreis pro qm für Eigentumswohnungen
2. Durchschnittliche Kaltmiete pro qm
3. Preisentwicklung der letzten 5 Jahre (Tendenz)
4. Prognose für die nächsten Jahre
5. Besonderheiten des Standorts (Infrastruktur, Entwicklung)

Antworte als JSON:
{{
    "kaufpreis_qm_von": <untere Grenze>,
    "kaufpreis_qm_bis": <obere Grenze>,
    "kaufpreis_qm_durchschnitt": <Mittelwert>,
    "miete_qm_von": <untere Grenze>,
    "miete_qm_bis": <obere Grenze>,
    "miete_qm_durchschnitt": <Mittelwert>,
    "preisentwicklung_5_jahre": "<z.B. +25%>",
    "tendenz": "<steigend/stabil/fallend>",
    "prognose": "<kurze Einschätzung>",
    "standort_bewertung": "<1-10>",
    "standort_details": "<Infrastruktur, Besonderheiten>",
    "datenqualität": "<Hinweis dass dies Schätzungen sind>"
}}

Antworte NUR mit dem JSON."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": search_prompt}]
        )
        
        json_text = response.content[0].text.strip()
        if json_text.startswith("```"):
            json_text = json_text.split("```")[1]
            if json_text.startswith("json"):
                json_text = json_text[4:]
        json_text = json_text.strip()
        
        return json.loads(json_text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der Marktdatensuche: {str(e)}")


def calculate_cashflow(
    kaufpreis: float,
    monatliche_miete: float,
    nebenkosten: float,
    eigenkapital: float = 0,
    zinssatz: float = 3.75,
    tilgung: float = 1.25
) -> dict:
    """
    Berechnet Cashflow mit 100% Finanzierung

    Standard-Finanzierung:
    - Zinssatz: 3.75%
    - Tilgung: 1.25%
    - Gesamt: 5.0% p.a.

    Args:
        kaufpreis: Kaufpreis der Immobilie
        monatliche_miete: Monatliche Kaltmiete
        nebenkosten: Monatliche Nebenkosten (Hausgeld etc.)
        eigenkapital: Eigenkapitalanteil (default: 0 = 100% Finanzierung)
        zinssatz: Zinssatz in % (default: 3.75%)
        tilgung: Tilgung in % (default: 1.25%)
    """

    finanzierungssumme = kaufpreis - eigenkapital

    # Jährliche Rate (Annuität)
    jaehrliche_rate_prozent = zinssatz + tilgung
    jaehrliche_rate = finanzierungssumme * (jaehrliche_rate_prozent / 100)
    monatliche_rate = jaehrliche_rate / 12

    # Cashflow
    monatlicher_cashflow = monatliche_miete - monatliche_rate - nebenkosten
    jaehrlicher_cashflow = monatlicher_cashflow * 12

    # Renditen
    bruttorendite = (monatliche_miete * 12 / kaufpreis) * 100 if kaufpreis > 0 else 0

    # Nettorendite (nach Nebenkosten)
    nettorendite = ((monatliche_miete - nebenkosten) * 12 / kaufpreis) * 100 if kaufpreis > 0 else 0

    # Eigenkapitalrendite (bei Finanzierung)
    if eigenkapital > 0:
        eigenkapitalrendite = (jaehrlicher_cashflow / eigenkapital) * 100
    else:
        eigenkapitalrendite = None  # Nicht berechenbar bei 100% Finanzierung

    # Bewertung
    if monatlicher_cashflow > 200:
        cashflow_bewertung = "Sehr gut"
        cashflow_score = 90
    elif monatlicher_cashflow > 0:
        cashflow_bewertung = "Gut (cashflow-positiv)"
        cashflow_score = 75
    elif monatlicher_cashflow >= -100:
        cashflow_bewertung = "Mittel (fast selbsttragend)"
        cashflow_score = 60
    else:
        cashflow_bewertung = "Schlecht (hoher Negativcashflow)"
        cashflow_score = 30

    return {
        "finanzierungssumme": round(finanzierungssumme, 2),
        "eigenkapital": round(eigenkapital, 2),
        "finanzierungsquote_prozent": round((finanzierungssumme / kaufpreis * 100), 2) if kaufpreis > 0 else 0,
        "zinssatz_prozent": zinssatz,
        "tilgung_prozent": tilgung,
        "gesamtrate_prozent": jaehrliche_rate_prozent,
        "monatliche_rate": round(monatliche_rate, 2),
        "monatliche_miete": round(monatliche_miete, 2),
        "monatliche_nebenkosten": round(nebenkosten, 2),
        "monatlicher_cashflow": round(monatlicher_cashflow, 2),
        "jaehrlicher_cashflow": round(jaehrlicher_cashflow, 2),
        "bruttorendite_prozent": round(bruttorendite, 2),
        "nettorendite_prozent": round(nettorendite, 2),
        "eigenkapitalrendite_prozent": round(eigenkapitalrendite, 2) if eigenkapitalrendite else None,
        "selbsttragend": monatlicher_cashflow >= 0,
        "cashflow_positiv": monatlicher_cashflow > 0,
        "cashflow_bewertung": cashflow_bewertung,
        "cashflow_score": cashflow_score,
    }


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_property(request: AnalysisRequest):
    """
    Führt die vollständige Immobilienanalyse durch mit:
    - No-Go-Prüfung (K.O.-Kriterien)
    - Kaufpreisfaktor & Bruttorendite
    - Cashflow-Berechnung (3.75% Zins, 1.25% Tilgung)
    - Warnsignal-Erkennung
    - Gewichtete Score-Berechnung
    """
    data = request.property_data
    zweck = request.verwendungszweck

    weights = WEIGHTS_INVESTMENT if zweck == "kapitalanlage" else WEIGHTS_SELF_USE

    client = get_anthropic_client()

    # 1. NO-GO-PRÜFUNG - Sofortiges Ausschlusskriterium
    no_go_check = check_no_gos(data)

    # 2. WARNSIGNAL-ERKENNUNG
    warnsignale = detect_warning_signals(data)

    # 3. Marktdaten holen falls Stadt bekannt
    marktdaten = None
    if data.stadt:
        try:
            marktdaten = await search_market_data(data.stadt, data.stadtteil)
        except:
            pass  # Marktdaten optional

    # 4. Investment-Metriken berechnen (nur bei Kapitalanlage)
    investment_metriken = None
    cashflow_analyse = None

    if zweck == "kapitalanlage" and data.kaufpreis:
        miete = data.aktuelle_miete or 0

        # Schätze Miete falls nicht vorhanden
        if miete == 0 and data.wohnflaeche and marktdaten:
            miete = data.wohnflaeche * marktdaten.get("miete_qm_durchschnitt", 10)

        # Kaufpreisfaktor & Bruttorendite
        if miete > 0:
            jahreskaltmiete = miete * 12
            investment_metriken = calculate_investment_metrics(
                kaufpreis=data.kaufpreis,
                jahreskaltmiete=jahreskaltmiete,
                wohnflaeche=data.wohnflaeche
            )

        # Cashflow-Berechnung mit neuen Standardwerten
        nebenkosten = data.hausgeld or data.nebenkosten or 0

        cashflow_analyse = calculate_cashflow(
            kaufpreis=data.kaufpreis,
            monatliche_miete=miete,
            nebenkosten=nebenkosten,
            eigenkapital=request.eigenkapital or 0,
            zinssatz=request.zinssatz or 3.75,
            tilgung=request.tilgung or 1.25
        )
    
    # 5. KI-BEWERTUNG mit allen Informationen
    analyse_prompt = f"""Analysiere diese Immobilie professionell und bewerte jedes Kriterium mit einem Score von 0-100.

=== IMMOBILIENDATEN ===
{json.dumps(data.dict(), indent=2, ensure_ascii=False)}

=== VERWENDUNGSZWECK ===
{zweck}

=== NO-GO-PRÜFUNG ===
{json.dumps(no_go_check, indent=2, ensure_ascii=False)}
⚠️ WICHTIG: Bei No-Gos ist die Immobilie NICHT investierbar!

=== WARNSIGNALE ===
{json.dumps(warnsignale, indent=2, ensure_ascii=False)}

=== INVESTMENT-METRIKEN (Kapitalanlage) ===
{json.dumps(investment_metriken, indent=2, ensure_ascii=False) if investment_metriken else "Nicht berechnet"}

Bewertungsrichtlinien:
- Kaufpreisfaktor < 20: Sehr gut
- Kaufpreisfaktor 20-25: Gut
- Kaufpreisfaktor > 25: Schlecht
- Bruttorendite > 5%: Sehr gut
- Bruttorendite 4-5%: Gut
- Bruttorendite < 3%: Schlecht

=== CASHFLOW-ANALYSE ===
{json.dumps(cashflow_analyse, indent=2, ensure_ascii=False) if cashflow_analyse else "Nicht berechnet"}

Standard-Finanzierung: 3.75% Zins + 1.25% Tilgung = 5.0% Gesamtrate

=== MARKTDATEN ===
{json.dumps(marktdaten, indent=2, ensure_ascii=False) if marktdaten else "Keine Marktdaten verfügbar"}

=== BEWERTUNGSKRITERIEN für {zweck.upper()} ===
{json.dumps(weights, indent=2, ensure_ascii=False)}

Bewerte jedes Kriterium mit Score (0-100) und kurzer Begründung:

1. **cashflow_rendite** (Gewichtung: {weights['cashflow_rendite']}%)
   - Berücksichtige Kaufpreisfaktor, Bruttorendite, Cashflow
   - Cashflow > 0 = gut, < 0 = schlecht

2. **lage** (Gewichtung: {weights['lage']}%)
   - Stadtteil, Infrastruktur, Marktdaten

3. **kaufpreis_qm** (Gewichtung: {weights['kaufpreis_qm']}%)
   - Vergleich mit Marktdurchschnitt

4. **zukunftspotenzial** (Gewichtung: {weights['zukunftspotenzial']}%)
   - Preisentwicklung, Standortentwicklung

5. **zustand_baujahr** (Gewichtung: {weights['zustand_baujahr']}%)
   - Zustand, Baujahr, Sanierungsbedarf
   - ACHTUNG: Fertighäuser 1960-1990 sind No-Go!

6. **energieeffizienz** (Gewichtung: {weights['energieeffizienz']}%)
   - Energieklasse (G/H = No-Go!)

7. **nebenkosten** (Gewichtung: {weights['nebenkosten']}%)
   - Hausgeld/Nebenkosten im Verhältnis

8. **grundriss** (Gewichtung: {weights['grundriss']}%)
   - Zimmerzahl, Schnitt, Ausstattung

9. **verkäufertyp** (Gewichtung: {weights['verkäufertyp']}%)
   - Privat vs. Makler, Provision

Antworte als JSON:
{{
    "kriterien": [
        {{
            "name": "cashflow_rendite",
            "score": <0-100>,
            "begründung": "<präzise Begründung mit Zahlen>"
        }},
        ... (alle 9 Kriterien)
    ],
    "stärken": ["<konkrete Stärke mit Zahlen>", ...],
    "schwächen": ["<konkrete Schwäche mit Zahlen>", ...],
    "zusammenfassung": "<3-4 Sätze Gesamteinschätzung mit Fokus auf Investment-Qualität>"
}}

Sei kritisch und realistisch. Berücksichtige No-Gos und Warnsignale in der Bewertung!
Antworte NUR mit dem JSON."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2500,
            messages=[{"role": "user", "content": analyse_prompt}]
        )
        
        json_text = response.content[0].text.strip()
        if json_text.startswith("```"):
            json_text = json_text.split("```")[1]
            if json_text.startswith("json"):
                json_text = json_text[4:]
        json_text = json_text.strip()
        
        ai_analysis = json.loads(json_text)

        # Berechne gewichteten Gesamtscore
        kriterien_scores = []
        total_weighted = 0

        for criterion in ai_analysis["kriterien"]:
            name = criterion["name"]
            score = criterion["score"]
            gewichtung = weights.get(name, 0)
            gewichteter_score = (score * gewichtung) / 100
            total_weighted += gewichteter_score

            kriterien_scores.append(CriterionScore(
                name=name,
                score=score,
                gewichtung=gewichtung,
                gewichteter_score=round(gewichteter_score, 2),
                begründung=criterion["begründung"]
            ))

        # Gesamtscore (auf 100 normalisiert)
        gesamtscore = round(total_weighted, 1)

        # EMPFEHLUNG basierend auf No-Gos, Score und Warnsignalen
        if no_go_check["no_go"]:
            empfehlung = "ABLEHNEN"
            empfehlung_text = f"❌ NICHT INVESTIEREN - No-Go-Kriterien: {', '.join(no_go_check['gründe'])}"
        elif gesamtscore >= 75:
            if warnsignale["kritisch"]:
                empfehlung = "PRÜFEN"
                empfehlung_text = f"⚠️ GENAU PRÜFEN - Guter Score ({gesamtscore}), aber kritische Warnsignale vorhanden"
            else:
                empfehlung = "INVESTIEREN"
                empfehlung_text = f"✅ EMPFEHLENSWERT - Score: {gesamtscore}/100"
        elif gesamtscore >= 60:
            empfehlung = "PRÜFEN"
            empfehlung_text = f"⚠️ GENAU PRÜFEN - Mittelmäßiger Score ({gesamtscore}/100)"
            if warnsignale["anzahl"] > 0:
                empfehlung_text += f", {warnsignale['anzahl']} Warnsignal(e)"
        else:
            empfehlung = "ABLEHNEN"
            empfehlung_text = f"❌ NICHT EMPFOHLEN - Schwacher Score ({gesamtscore}/100)"

        # Erweitere Zusammenfassung mit Empfehlung
        zusammenfassung_erweitert = f"{empfehlung_text}\n\n{ai_analysis['zusammenfassung']}"

        return AnalysisResult(
            gesamtscore=gesamtscore,
            verwendungszweck=zweck,
            kriterien=kriterien_scores,
            cashflow_analyse=cashflow_analyse,
            investment_metriken=investment_metriken,
            no_go_check=no_go_check,
            warnsignale=warnsignale,
            zusammenfassung=zusammenfassung_erweitert,
            stärken=ai_analysis["stärken"],
            schwächen=ai_analysis["schwächen"],
            empfehlung=empfehlung,
            marktdaten=marktdaten
        )
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Fehler beim Parsen der KI-Analyse: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei der Analyse: {str(e)}")


@app.get("/health")
async def health_check():
    """Health Check Endpoint"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    return {
        "status": "healthy",
        "api_key_configured": bool(api_key)
    }
