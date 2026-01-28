"""
AmlakI Backend
KI-gestützter Immobilienanalyse-Service mit User-Management
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import timedelta
import anthropic
import json
import os
from dotenv import load_dotenv
import httpx
import re

# Eigene Module
from knowledge_base import (
    get_ai_system_prompt,
    berechne_fairen_preis,
    empfehle_foerderungen,
    generiere_verbesserungsvorschlaege,
    berechne_afa,
    berechne_heizungsfoerderung,
    pruefe_15_prozent_regel,
    berechne_leverage_effekt,
    quick_check,
    KFW_PROGRAMME,
    LANDESFOERDERUNGEN,
    AFA_REGELN,
    MARKTDATEN,
    DEALBREAKER
)
from database import get_db, init_db
from models import User, Analysis
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from schemas import (
    UserCreate,
    UserUpdate,
    UserResponse,
    Token,
    LoginRequest,
    AnalysisCreate,
    AnalysisUpdate,
    AnalysisResponse,
    AnalysisListItem
)

load_dotenv()

app = FastAPI(title="AmlakI API", version="2.0.0")

# Initialisiere Datenbank beim Start
@app.on_event("startup")
def startup_event():
    init_db()

# CORS für lokale Entwicklung
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# AUTH ENDPOINTS
# ========================================

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Registriert einen neuen User"""
    # Prüfe ob E-Mail bereits existiert
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="E-Mail bereits registriert")

    # Prüfe ob Username bereits existiert
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username bereits vergeben")

    # Erstelle neuen User
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/auth/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login mit E-Mail und Passwort"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Gibt Infos zum aktuell eingeloggten User zurück"""
    return current_user


@app.put("/auth/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Aktualisiert User-Profil"""
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.default_verwendungszweck is not None:
        current_user.default_verwendungszweck = user_update.default_verwendungszweck
    if user_update.default_zinssatz is not None:
        current_user.default_zinssatz = user_update.default_zinssatz
    if user_update.default_tilgung is not None:
        current_user.default_tilgung = user_update.default_tilgung

    db.commit()
    db.refresh(current_user)
    return current_user

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
    # Neue erweiterte Analysen
    tilgungsplan: Optional[dict] = None
    breakeven_eigenkapital: Optional[dict] = None
    szenarien: Optional[List[dict]] = None
    sensitivity_analyse: Optional[dict] = None
    # Zusätzliche Analyse-Features
    investment_vergleich: Optional[dict] = None
    meilensteine: Optional[dict] = None
    miet_variationen: Optional[List[dict]] = None
    finanzierungsoptionen: Optional[List[dict]] = None
    # NEU: Knowledge Base Integration
    verbesserungsvorschlaege: Optional[List[dict]] = None  # Konstruktive Tipps
    foerderungen: Optional[List[dict]] = None  # Passende Förderungen
    fairer_preis: Optional[dict] = None  # Fairer Preis Berechnung
    afa_berechnung: Optional[dict] = None  # AfA nach verschiedenen Methoden
    leverage_effekt: Optional[dict] = None  # Hebeleffekt Berechnung
    quick_check_result: Optional[dict] = None  # Schnell-Check


def get_anthropic_client():
    """Erstellt Anthropic Client"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY nicht konfiguriert")
    return anthropic.Anthropic(api_key=api_key)


@app.get("/")
async def root():
    return {"message": "AmlakI API läuft", "version": "2.0.0"}


# ========================================
# LIBRARY ENDPOINTS (gespeicherte Analysen)
# ========================================

@app.get("/library", response_model=List[AnalysisListItem])
def get_user_analyses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Holt alle Analysen des Users"""
    analyses = db.query(Analysis)\
        .filter(Analysis.user_id == current_user.id)\
        .order_by(Analysis.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    return analyses


@app.get("/library/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Holt eine spezifische Analyse"""
    analysis = db.query(Analysis)\
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)\
        .first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return analysis


@app.put("/library/{analysis_id}", response_model=AnalysisResponse)
def update_analysis(
    analysis_id: int,
    analysis_update: AnalysisUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Aktualisiert eine Analyse (Titel, Notizen, Favorit, Tags)"""
    analysis = db.query(Analysis)\
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)\
        .first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if analysis_update.title is not None:
        analysis.title = analysis_update.title
    if analysis_update.notes is not None:
        analysis.notes = analysis_update.notes
    if analysis_update.is_favorite is not None:
        analysis.is_favorite = analysis_update.is_favorite
    if analysis_update.tags is not None:
        analysis.tags = analysis_update.tags

    db.commit()
    db.refresh(analysis)
    return analysis


@app.delete("/library/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Löscht eine Analyse"""
    analysis = db.query(Analysis)\
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)\
        .first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db.delete(analysis)
    db.commit()
    return None


@app.get("/library/favorites", response_model=List[AnalysisListItem])
def get_favorite_analyses(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Holt alle Favoriten-Analysen"""
    analyses = db.query(Analysis)\
        .filter(Analysis.user_id == current_user.id, Analysis.is_favorite == True)\
        .order_by(Analysis.created_at.desc())\
        .all()

    return analyses


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


def calculate_tilgungsplan(
    kaufpreis: float,
    eigenkapital: float,
    zinssatz: float,
    tilgung: float,
    monatliche_miete: float,
    nebenkosten: float,
    jahre: int = 30,
    mietsteigerung: float = 1.5,
    wertsteigerung: float = 1.5
) -> dict:
    """
    Berechnet einen detaillierten Tilgungsplan über die angegebene Laufzeit.

    Args:
        kaufpreis: Kaufpreis der Immobilie
        eigenkapital: Eingesetztes Eigenkapital
        zinssatz: Jährlicher Zinssatz in %
        tilgung: Jährliche Tilgung in %
        monatliche_miete: Monatliche Kaltmiete
        nebenkosten: Monatliche Nebenkosten
        jahre: Laufzeit in Jahren (default: 30)
        mietsteigerung: Jährliche Mietsteigerung in % (default: 1.5%)
        wertsteigerung: Jährliche Wertsteigerung in % (default: 1.5%)

    Returns:
        Dict mit jahresweisen Projektionen und Zusammenfassung
    """
    finanzierungssumme = kaufpreis - eigenkapital
    restschuld = finanzierungssumme

    # Jährliche Rate (Annuität)
    jaehrliche_rate_prozent = zinssatz + tilgung
    jaehrliche_rate = finanzierungssumme * (jaehrliche_rate_prozent / 100)

    aktuelle_miete = monatliche_miete
    immobilienwert = kaufpreis

    jahres_projektionen = []
    gesamte_zinsen = 0
    gesamte_tilgung = 0

    for jahr in range(1, jahre + 1):
        # Zinsen und Tilgung für dieses Jahr
        zinsen_jahr = restschuld * (zinssatz / 100)
        tilgung_jahr = jaehrliche_rate - zinsen_jahr

        # Sicherstellen, dass wir nicht mehr tilgen als Restschuld
        if tilgung_jahr > restschuld:
            tilgung_jahr = restschuld
            zinsen_jahr = restschuld * (zinssatz / 100)

        restschuld = max(0, restschuld - tilgung_jahr)
        gesamte_zinsen += zinsen_jahr
        gesamte_tilgung += tilgung_jahr

        # Cashflow berechnen (mit aktueller Miete)
        jaehrlicher_cashflow = (aktuelle_miete * 12) - jaehrliche_rate - (nebenkosten * 12)

        # Eigenkapital = Getilgter Betrag + ursprüngliches EK
        eigenkapital_aufbau = eigenkapital + gesamte_tilgung

        # Gesamtvermögen = Immobilienwert - Restschuld
        gesamtvermoegen = immobilienwert - restschuld

        jahres_projektionen.append({
            "jahr": jahr,
            "restschuld": round(restschuld, 2),
            "getilgt": round(gesamte_tilgung, 2),
            "zinsen_jahr": round(zinsen_jahr, 2),
            "tilgung_jahr": round(tilgung_jahr, 2),
            "jaehrlicher_cashflow": round(jaehrlicher_cashflow, 2),
            "monatlicher_cashflow": round(jaehrlicher_cashflow / 12, 2),
            "immobilienwert": round(immobilienwert, 2),
            "eigenkapital_aufbau": round(eigenkapital_aufbau, 2),
            "gesamtvermoegen": round(gesamtvermoegen, 2),
            "aktuelle_miete": round(aktuelle_miete, 2)
        })

        # Werte für nächstes Jahr anpassen
        aktuelle_miete *= (1 + mietsteigerung / 100)
        immobilienwert *= (1 + wertsteigerung / 100)

        # Wenn Kredit abbezahlt, breche ab
        if restschuld <= 0:
            break

    # Zusammenfassung
    letztes_jahr = jahres_projektionen[-1] if jahres_projektionen else None
    erstes_jahr = jahres_projektionen[0] if jahres_projektionen else None

    zusammenfassung = {
        "finanzierungssumme": round(finanzierungssumme, 2),
        "eigenkapital_start": round(eigenkapital, 2),
        "jaehrliche_rate": round(jaehrliche_rate, 2),
        "monatliche_rate": round(jaehrliche_rate / 12, 2),
        "gesamte_zinsen": round(gesamte_zinsen, 2),
        "gesamte_tilgung": round(gesamte_tilgung, 2),
        "gesamtkosten": round(gesamte_zinsen + finanzierungssumme, 2),
        "restschuld_nach_laufzeit": round(restschuld, 2),
        "immobilienwert_nach_laufzeit": round(letztes_jahr["immobilienwert"], 2) if letztes_jahr else kaufpreis,
        "gesamtvermoegen_nach_laufzeit": round(letztes_jahr["gesamtvermoegen"], 2) if letztes_jahr else eigenkapital,
        "cashflow_jahr_1": round(erstes_jahr["jaehrlicher_cashflow"], 2) if erstes_jahr else 0,
        "cashflow_jahr_final": round(letztes_jahr["jaehrlicher_cashflow"], 2) if letztes_jahr else 0,
        "kredit_abbezahlt_in_jahren": len(jahres_projektionen) if restschuld <= 0 else None
    }

    return {
        "jahre": jahres_projektionen,
        "zusammenfassung": zusammenfassung
    }


def calculate_breakeven_eigenkapital(
    kaufpreis: float,
    monatliche_miete: float,
    nebenkosten: float,
    zinssatz: float,
    tilgung: float
) -> dict:
    """
    Berechnet das benötigte Eigenkapital für einen neutralen Cashflow (Break-Even).

    Formel: EK = Kaufpreis - (Miete - Nebenkosten) * 12 * 100 / (Zinssatz + Tilgung)

    Args:
        kaufpreis: Kaufpreis der Immobilie
        monatliche_miete: Monatliche Kaltmiete
        nebenkosten: Monatliche Nebenkosten (Hausgeld etc.)
        zinssatz: Jährlicher Zinssatz in %
        tilgung: Jährliche Tilgung in %

    Returns:
        Dict mit Break-Even Eigenkapital und Kennzahlen
    """
    # Verfügbarer Betrag für Kreditrate pro Jahr
    verfuegbar_fuer_kredit = (monatliche_miete - nebenkosten) * 12

    # Gesamtrate in %
    gesamtrate_prozent = zinssatz + tilgung

    # Maximale Finanzierungssumme bei neutralem Cashflow
    if gesamtrate_prozent > 0:
        max_finanzierung = verfuegbar_fuer_kredit * 100 / gesamtrate_prozent
    else:
        max_finanzierung = 0

    # Benötigtes Eigenkapital
    benoetigtes_ek = kaufpreis - max_finanzierung

    # Eigenkapitalquote
    ek_quote = (benoetigtes_ek / kaufpreis * 100) if kaufpreis > 0 else 0

    # Ist das realistisch? (EK zwischen 0% und 100%)
    ist_realistisch = 0 <= benoetigtes_ek <= kaufpreis

    # Monatlicher Cashflow bei Break-Even EK
    monatlicher_cashflow = 0  # Per Definition

    return {
        "benoetigtes_eigenkapital": round(max(0, benoetigtes_ek), 2),
        "eigenkapital_quote_prozent": round(max(0, min(100, ek_quote)), 2),
        "max_finanzierungssumme": round(max(0, max_finanzierung), 2),
        "monatlicher_cashflow": round(monatlicher_cashflow, 2),
        "ist_realistisch": ist_realistisch,
        "verfuegbar_fuer_kredit_jaehrlich": round(verfuegbar_fuer_kredit, 2),
        "hinweis": "Positiver Cashflow" if benoetigtes_ek <= 0 else (
            "Break-Even erreichbar" if ist_realistisch else "100% EK erforderlich für Break-Even"
        )
    }


def generate_scenarios(
    kaufpreis: float,
    monatliche_miete: float,
    nebenkosten: float,
    eigenkapital: float,
    zinssatz: float,
    tilgung: float
) -> list:
    """
    Generiert drei Szenarien: Konservativ, Realistisch, Optimistisch

    Konservativ: Zins +1%, Mietsteigerung 0.5%, 5% Leerstand
    Realistisch: Aktuelle Parameter, 1.5% Mietsteigerung, 2% Leerstand
    Optimistisch: Zins -0.5%, 2.5% Mietsteigerung, 2% Wertsteigerung

    Args:
        kaufpreis: Kaufpreis der Immobilie
        monatliche_miete: Monatliche Kaltmiete
        nebenkosten: Monatliche Nebenkosten
        eigenkapital: Eingesetztes Eigenkapital
        zinssatz: Aktueller Zinssatz in %
        tilgung: Aktuelle Tilgung in %

    Returns:
        Liste mit 3 Szenario-Dicts
    """
    szenarien = []

    # Konservatives Szenario
    konservativ_zins = zinssatz + 1.0
    konservativ_miete = monatliche_miete * 0.95  # 5% Leerstand
    konservativ_tilgungsplan = calculate_tilgungsplan(
        kaufpreis=kaufpreis,
        eigenkapital=eigenkapital,
        zinssatz=konservativ_zins,
        tilgung=tilgung,
        monatliche_miete=konservativ_miete,
        nebenkosten=nebenkosten,
        jahre=30,
        mietsteigerung=0.5,
        wertsteigerung=0.5
    )
    konservativ_cashflow = calculate_cashflow(
        kaufpreis=kaufpreis,
        monatliche_miete=konservativ_miete,
        nebenkosten=nebenkosten,
        eigenkapital=eigenkapital,
        zinssatz=konservativ_zins,
        tilgung=tilgung
    )
    szenarien.append({
        "name": "Konservativ",
        "beschreibung": "Worst-Case mit höheren Zinsen und Leerstand",
        "annahmen": {
            "zinssatz": konservativ_zins,
            "tilgung": tilgung,
            "mietsteigerung_prozent": 0.5,
            "wertsteigerung_prozent": 0.5,
            "leerstand_prozent": 5,
            "effektive_miete": round(konservativ_miete, 2)
        },
        "cashflow_analyse": konservativ_cashflow,
        "tilgungsplan": konservativ_tilgungsplan
    })

    # Realistisches Szenario
    realistisch_miete = monatliche_miete * 0.98  # 2% Leerstand
    realistisch_tilgungsplan = calculate_tilgungsplan(
        kaufpreis=kaufpreis,
        eigenkapital=eigenkapital,
        zinssatz=zinssatz,
        tilgung=tilgung,
        monatliche_miete=realistisch_miete,
        nebenkosten=nebenkosten,
        jahre=30,
        mietsteigerung=1.5,
        wertsteigerung=1.5
    )
    realistisch_cashflow = calculate_cashflow(
        kaufpreis=kaufpreis,
        monatliche_miete=realistisch_miete,
        nebenkosten=nebenkosten,
        eigenkapital=eigenkapital,
        zinssatz=zinssatz,
        tilgung=tilgung
    )
    szenarien.append({
        "name": "Realistisch",
        "beschreibung": "Erwartetes Szenario mit aktuellen Parametern",
        "annahmen": {
            "zinssatz": zinssatz,
            "tilgung": tilgung,
            "mietsteigerung_prozent": 1.5,
            "wertsteigerung_prozent": 1.5,
            "leerstand_prozent": 2,
            "effektive_miete": round(realistisch_miete, 2)
        },
        "cashflow_analyse": realistisch_cashflow,
        "tilgungsplan": realistisch_tilgungsplan
    })

    # Optimistisches Szenario
    optimistisch_zins = max(0.5, zinssatz - 0.5)  # Mindestens 0.5%
    optimistisch_miete = monatliche_miete * 0.98  # 2% Leerstand
    optimistisch_tilgungsplan = calculate_tilgungsplan(
        kaufpreis=kaufpreis,
        eigenkapital=eigenkapital,
        zinssatz=optimistisch_zins,
        tilgung=tilgung,
        monatliche_miete=optimistisch_miete,
        nebenkosten=nebenkosten,
        jahre=30,
        mietsteigerung=2.5,
        wertsteigerung=2.0
    )
    optimistisch_cashflow = calculate_cashflow(
        kaufpreis=kaufpreis,
        monatliche_miete=optimistisch_miete,
        nebenkosten=nebenkosten,
        eigenkapital=eigenkapital,
        zinssatz=optimistisch_zins,
        tilgung=tilgung
    )
    szenarien.append({
        "name": "Optimistisch",
        "beschreibung": "Best-Case mit niedrigeren Zinsen und starker Wertsteigerung",
        "annahmen": {
            "zinssatz": optimistisch_zins,
            "tilgung": tilgung,
            "mietsteigerung_prozent": 2.5,
            "wertsteigerung_prozent": 2.0,
            "leerstand_prozent": 2,
            "effektive_miete": round(optimistisch_miete, 2)
        },
        "cashflow_analyse": optimistisch_cashflow,
        "tilgungsplan": optimistisch_tilgungsplan
    })

    return szenarien


def calculate_sensitivity_analysis(
    kaufpreis: float,
    monatliche_miete: float,
    nebenkosten: float,
    eigenkapital: float,
    zinssatz: float,
    tilgung: float
) -> dict:
    """
    Erstellt eine Sensitivitätsanalyse als Matrix:
    Zeilen: Verschiedene Zinssätze
    Spalten: Verschiedene Eigenkapital-Höhen

    Args:
        kaufpreis: Kaufpreis der Immobilie
        monatliche_miete: Monatliche Kaltmiete
        nebenkosten: Monatliche Nebenkosten
        eigenkapital: Aktuelles Eigenkapital (Referenz)
        zinssatz: Aktueller Zinssatz (Referenz)
        tilgung: Aktuelle Tilgung

    Returns:
        Dict mit Matrix und Achsenbeschriftungen
    """
    # Zinssatz-Variationen: -1%, -0.5%, aktuell, +0.5%, +1%
    zins_variationen = [
        max(0.5, zinssatz - 1.0),
        max(0.5, zinssatz - 0.5),
        zinssatz,
        zinssatz + 0.5,
        zinssatz + 1.0
    ]

    # EK-Variationen: 0%, 10%, 20%, 30%, 40% vom Kaufpreis
    ek_prozente = [0, 10, 20, 30, 40]
    ek_variationen = [kaufpreis * (p / 100) for p in ek_prozente]

    matrix = []

    for zins in zins_variationen:
        zeile = []
        for ek in ek_variationen:
            cashflow = calculate_cashflow(
                kaufpreis=kaufpreis,
                monatliche_miete=monatliche_miete,
                nebenkosten=nebenkosten,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilgung
            )
            zeile.append({
                "monatlicher_cashflow": cashflow["monatlicher_cashflow"],
                "jaehrlicher_cashflow": cashflow["jaehrlicher_cashflow"],
                "selbsttragend": cashflow["selbsttragend"]
            })
        matrix.append(zeile)

    # Finde aktuellen Referenzpunkt
    aktueller_zins_index = zins_variationen.index(zinssatz) if zinssatz in zins_variationen else 2

    # Finde nächsten EK-Index
    aktueller_ek_index = 0
    for i, ek in enumerate(ek_variationen):
        if eigenkapital >= ek:
            aktueller_ek_index = i

    return {
        "matrix": matrix,
        "zinssaetze": [round(z, 2) for z in zins_variationen],
        "eigenkapital_werte": [round(ek, 2) for ek in ek_variationen],
        "eigenkapital_prozente": ek_prozente,
        "aktueller_zins_index": aktueller_zins_index,
        "aktueller_ek_index": aktueller_ek_index,
        "tilgung": tilgung,
        "referenz": {
            "zinssatz": zinssatz,
            "eigenkapital": eigenkapital
        }
    }


def calculate_investment_comparison(
    kaufpreis: float,
    eigenkapital: float,
    monatliche_miete: float,
    nebenkosten: float,
    zinssatz: float,
    tilgung: float,
    jahre: int = 30
) -> dict:
    """
    Vergleicht Immobilien-Investment mit alternativen Anlageformen.
    """
    # Alternative: ETF mit 7% Rendite
    etf_rendite = 7.0

    # Immobilien-Investment
    tilgungsplan = calculate_tilgungsplan(
        kaufpreis=kaufpreis,
        eigenkapital=eigenkapital,
        zinssatz=zinssatz,
        tilgung=tilgung,
        monatliche_miete=monatliche_miete,
        nebenkosten=nebenkosten,
        jahre=jahre
    )

    immobilien_endvermoegen = tilgungsplan["zusammenfassung"]["gesamtvermoegen_nach_laufzeit"]

    # ETF-Investment: Nur Eigenkapital investiert
    etf_nur_ek = eigenkapital * ((1 + etf_rendite/100) ** jahre)

    # ETF-Investment: EK + monatliche Zuzahlung (falls negativ Cashflow)
    monatlicher_cashflow = tilgungsplan["jahre"][0]["monatlicher_cashflow"] if tilgungsplan["jahre"] else 0
    zuzahlung = abs(monatlicher_cashflow) if monatlicher_cashflow < 0 else 0

    # Zinseszins-Formel für regelmäßige Einzahlung
    monatliche_rendite = (1 + etf_rendite/100) ** (1/12) - 1
    monate = jahre * 12
    if zuzahlung > 0:
        etf_mit_sparrate = eigenkapital * ((1 + etf_rendite/100) ** jahre) + \
            zuzahlung * (((1 + monatliche_rendite) ** monate - 1) / monatliche_rendite)
    else:
        etf_mit_sparrate = etf_nur_ek

    return {
        "immobilie": {
            "endvermoegen": round(immobilien_endvermoegen, 2),
            "eingesetztes_kapital": round(eigenkapital, 2),
            "monatliche_zuzahlung": round(zuzahlung, 2),
            "gesamtinvestition": round(eigenkapital + (zuzahlung * monate), 2),
            "rendite_faktor": round(immobilien_endvermoegen / eigenkapital, 2) if eigenkapital > 0 else 0
        },
        "etf_nur_eigenkapital": {
            "endvermoegen": round(etf_nur_ek, 2),
            "angenommene_rendite": etf_rendite,
            "eingesetztes_kapital": round(eigenkapital, 2)
        },
        "etf_mit_sparrate": {
            "endvermoegen": round(etf_mit_sparrate, 2),
            "monatliche_sparrate": round(zuzahlung, 2),
            "gesamtinvestition": round(eigenkapital + (zuzahlung * monate), 2)
        },
        "vergleich": {
            "immobilie_vs_etf_nur_ek": round(immobilien_endvermoegen - etf_nur_ek, 2),
            "immobilie_vs_etf_sparrate": round(immobilien_endvermoegen - etf_mit_sparrate, 2),
            "immobilie_besser_als_etf": immobilien_endvermoegen > etf_mit_sparrate
        }
    }


def calculate_key_milestones(
    kaufpreis: float,
    eigenkapital: float,
    zinssatz: float,
    tilgung: float,
    monatliche_miete: float,
    nebenkosten: float
) -> dict:
    """
    Berechnet wichtige Meilensteine der Investition.
    """
    tilgungsplan = calculate_tilgungsplan(
        kaufpreis=kaufpreis,
        eigenkapital=eigenkapital,
        zinssatz=zinssatz,
        tilgung=tilgung,
        monatliche_miete=monatliche_miete,
        nebenkosten=nebenkosten,
        jahre=40  # Längerer Zeitraum für Meilensteine
    )

    jahre = tilgungsplan["jahre"]
    finanzierungssumme = kaufpreis - eigenkapital

    # Meilensteine finden
    meilensteine = {
        "kredit_25_prozent_getilgt": None,
        "kredit_50_prozent_getilgt": None,
        "kredit_75_prozent_getilgt": None,
        "kredit_komplett_getilgt": None,
        "erster_positiver_cashflow": None,
        "eigenkapital_verdoppelt": None,
        "vermögen_100k_erreicht": None,
        "vermögen_250k_erreicht": None,
        "vermögen_500k_erreicht": None
    }

    for jahr_daten in jahre:
        jahr = jahr_daten["jahr"]
        getilgt_prozent = (jahr_daten["getilgt"] / finanzierungssumme * 100) if finanzierungssumme > 0 else 0

        if meilensteine["kredit_25_prozent_getilgt"] is None and getilgt_prozent >= 25:
            meilensteine["kredit_25_prozent_getilgt"] = jahr
        if meilensteine["kredit_50_prozent_getilgt"] is None and getilgt_prozent >= 50:
            meilensteine["kredit_50_prozent_getilgt"] = jahr
        if meilensteine["kredit_75_prozent_getilgt"] is None and getilgt_prozent >= 75:
            meilensteine["kredit_75_prozent_getilgt"] = jahr
        if meilensteine["kredit_komplett_getilgt"] is None and jahr_daten["restschuld"] <= 0:
            meilensteine["kredit_komplett_getilgt"] = jahr

        if meilensteine["erster_positiver_cashflow"] is None and jahr_daten["monatlicher_cashflow"] > 0:
            meilensteine["erster_positiver_cashflow"] = jahr

        if meilensteine["eigenkapital_verdoppelt"] is None and jahr_daten["eigenkapital_aufbau"] >= eigenkapital * 2:
            meilensteine["eigenkapital_verdoppelt"] = jahr

        if meilensteine["vermögen_100k_erreicht"] is None and jahr_daten["gesamtvermoegen"] >= 100000:
            meilensteine["vermögen_100k_erreicht"] = jahr
        if meilensteine["vermögen_250k_erreicht"] is None and jahr_daten["gesamtvermoegen"] >= 250000:
            meilensteine["vermögen_250k_erreicht"] = jahr
        if meilensteine["vermögen_500k_erreicht"] is None and jahr_daten["gesamtvermoegen"] >= 500000:
            meilensteine["vermögen_500k_erreicht"] = jahr

    return meilensteine


def calculate_rental_variations(
    kaufpreis: float,
    eigenkapital: float,
    zinssatz: float,
    tilgung: float,
    aktuelle_miete: float,
    nebenkosten: float
) -> list:
    """
    Berechnet verschiedene Miet-Szenarien.
    """
    variationen = []

    # Verschiedene Miethöhen testen: -20%, -10%, aktuell, +10%, +20%
    prozente = [-20, -10, 0, 10, 20]

    for prozent in prozente:
        miete = aktuelle_miete * (1 + prozent/100)
        cashflow = calculate_cashflow(
            kaufpreis=kaufpreis,
            monatliche_miete=miete,
            nebenkosten=nebenkosten,
            eigenkapital=eigenkapital,
            zinssatz=zinssatz,
            tilgung=tilgung
        )

        variationen.append({
            "miete_aenderung_prozent": prozent,
            "monatliche_miete": round(miete, 2),
            "monatlicher_cashflow": cashflow["monatlicher_cashflow"],
            "jaehrlicher_cashflow": cashflow["jaehrlicher_cashflow"],
            "selbsttragend": cashflow["selbsttragend"],
            "bruttorendite": cashflow["bruttorendite_prozent"]
        })

    return variationen


def calculate_financing_options(
    kaufpreis: float,
    monatliche_miete: float,
    nebenkosten: float,
    eigenkapital: float
) -> list:
    """
    Vergleicht verschiedene Finanzierungsoptionen.
    """
    optionen = []

    # Verschiedene Zins/Tilgung Kombinationen
    kombinationen = [
        {"name": "Niedrige Rate", "zins": 3.5, "tilgung": 1.0},
        {"name": "Standard", "zins": 3.75, "tilgung": 1.25},
        {"name": "Schnelle Tilgung", "zins": 3.75, "tilgung": 2.0},
        {"name": "Aggressive Tilgung", "zins": 3.75, "tilgung": 3.0},
        {"name": "Hoher Zins Szenario", "zins": 5.0, "tilgung": 1.5},
    ]

    for kombi in kombinationen:
        cashflow = calculate_cashflow(
            kaufpreis=kaufpreis,
            monatliche_miete=monatliche_miete,
            nebenkosten=nebenkosten,
            eigenkapital=eigenkapital,
            zinssatz=kombi["zins"],
            tilgung=kombi["tilgung"]
        )

        # Berechne wie lange bis abbezahlt
        tilgung_prozent = kombi["tilgung"]
        jahre_bis_abbezahlt = round(100 / tilgung_prozent) if tilgung_prozent > 0 else 999

        optionen.append({
            "name": kombi["name"],
            "zinssatz": kombi["zins"],
            "tilgung": kombi["tilgung"],
            "monatliche_rate": cashflow["monatliche_rate"],
            "monatlicher_cashflow": cashflow["monatlicher_cashflow"],
            "selbsttragend": cashflow["selbsttragend"],
            "jahre_bis_abbezahlt": jahre_bis_abbezahlt,
            "gesamtkosten_geschaetzt": round(cashflow["monatliche_rate"] * 12 * jahre_bis_abbezahlt, 2)
        })

    return optionen


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_property(
    request: AnalysisRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
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
        ek = request.eigenkapital or 0
        zins = request.zinssatz or 3.75
        tilg = request.tilgung or 1.25

        cashflow_analyse = calculate_cashflow(
            kaufpreis=data.kaufpreis,
            monatliche_miete=miete,
            nebenkosten=nebenkosten,
            eigenkapital=ek,
            zinssatz=zins,
            tilgung=tilg
        )

    # 5. ERWEITERTE BERECHNUNGEN (nur bei Kapitalanlage mit gültigen Daten)
    tilgungsplan = None
    breakeven_eigenkapital = None
    szenarien = None
    sensitivity_analyse = None

    if zweck == "kapitalanlage" and data.kaufpreis and data.kaufpreis > 0:
        miete = data.aktuelle_miete or 0
        if miete == 0 and data.wohnflaeche and marktdaten:
            miete = data.wohnflaeche * marktdaten.get("miete_qm_durchschnitt", 10)

        nebenkosten = data.hausgeld or data.nebenkosten or 0
        ek = request.eigenkapital or 0
        zins = request.zinssatz or 3.75
        tilg = request.tilgung or 1.25

        if miete > 0:
            # Tilgungsplan berechnen
            tilgungsplan = calculate_tilgungsplan(
                kaufpreis=data.kaufpreis,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilg,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                jahre=30,
                mietsteigerung=1.5,
                wertsteigerung=1.5
            )

            # Break-Even Eigenkapital berechnen
            breakeven_eigenkapital = calculate_breakeven_eigenkapital(
                kaufpreis=data.kaufpreis,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                zinssatz=zins,
                tilgung=tilg
            )

            # Szenarien generieren
            szenarien = generate_scenarios(
                kaufpreis=data.kaufpreis,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilg
            )

            # Sensitivitätsanalyse berechnen
            sensitivity_analyse = calculate_sensitivity_analysis(
                kaufpreis=data.kaufpreis,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilg
            )

    # 6. ZUSÄTZLICHE ANALYSEN (nur bei Kapitalanlage)
    investment_vergleich = None
    meilensteine = None
    miet_variationen = None
    finanzierungsoptionen = None

    if zweck == "kapitalanlage" and data.kaufpreis and data.kaufpreis > 0:
        miete = data.aktuelle_miete or 0
        if miete == 0 and data.wohnflaeche and marktdaten:
            miete = data.wohnflaeche * marktdaten.get("miete_qm_durchschnitt", 10)

        nebenkosten = data.hausgeld or data.nebenkosten or 0
        ek = request.eigenkapital or 0
        zins = request.zinssatz or 3.75
        tilg = request.tilgung or 1.25

        if miete > 0:
            # Investment-Vergleich (Immobilie vs. ETF)
            investment_vergleich = calculate_investment_comparison(
                kaufpreis=data.kaufpreis,
                eigenkapital=ek,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                zinssatz=zins,
                tilgung=tilg
            )

            # Meilensteine berechnen
            meilensteine = calculate_key_milestones(
                kaufpreis=data.kaufpreis,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilg,
                monatliche_miete=miete,
                nebenkosten=nebenkosten
            )

            # Miet-Variationen
            miet_variationen = calculate_rental_variations(
                kaufpreis=data.kaufpreis,
                eigenkapital=ek,
                zinssatz=zins,
                tilgung=tilg,
                aktuelle_miete=miete,
                nebenkosten=nebenkosten
            )

            # Finanzierungsoptionen
            finanzierungsoptionen = calculate_financing_options(
                kaufpreis=data.kaufpreis,
                monatliche_miete=miete,
                nebenkosten=nebenkosten,
                eigenkapital=ek
            )

    # 7. KNOWLEDGE BASE BERECHNUNGEN
    verbesserungsvorschlaege = None
    foerderungen_empfehlung = None
    fairer_preis_result = None
    afa_result = None
    leverage_result = None
    quick_check_result = None

    if data.kaufpreis and data.kaufpreis > 0:
        miete = data.aktuelle_miete or 0
        if miete == 0 and data.wohnflaeche and marktdaten:
            miete = data.wohnflaeche * marktdaten.get("miete_qm_durchschnitt", 10)

        nebenkosten = data.hausgeld or data.nebenkosten or 0
        ek = request.eigenkapital or 0
        zins = request.zinssatz or 3.75
        tilg = request.tilgung or 1.25
        jahresmiete = miete * 12

        if jahresmiete > 0:
            kaufpreisfaktor = data.kaufpreis / jahresmiete
            bruttorendite = (jahresmiete / data.kaufpreis) * 100
            cashflow_monat = cashflow_analyse.get("monatlicher_cashflow", 0) if cashflow_analyse else 0

            # Fairer Preis berechnen
            fairer_preis_result = berechne_fairen_preis(
                kaufpreis=data.kaufpreis,
                jahresmiete=jahresmiete
            )

            # Verbesserungsvorschläge generieren (NIEMALS nur Nein sagen!)
            verbesserungsvorschlaege = generiere_verbesserungsvorschlaege(
                kaufpreis=data.kaufpreis,
                jahresmiete=jahresmiete,
                kaufpreisfaktor=kaufpreisfaktor,
                bruttorendite=bruttorendite,
                cashflow=cashflow_monat,
                energieklasse=data.energieklasse,
                ist_miete=miete,
                markt_miete=marktdaten.get("miete_qm_durchschnitt", 0) * (data.wohnflaeche or 0) if marktdaten else None,
                score=0,  # Wird später aktualisiert
                bundesland=None  # Könnte aus Adresse extrahiert werden
            )

            # Förderungen empfehlen
            foerderungen_empfehlung = empfehle_foerderungen(
                selbstnutzung=(zweck == "eigennutzung"),
                kinder_anzahl=0,
                energieklasse=data.energieklasse,
                baujahr=data.baujahr,
                heizung_alt=(data.baujahr and data.baujahr < 2000),
                bundesland=None,
                einkommen=None
            )

            # AfA berechnen
            if data.baujahr and data.wohnflaeche:
                # Gebäudewert ca. 80% des Kaufpreises (20% Grundstück)
                gebaeudewert = data.kaufpreis * 0.8
                afa_result = berechne_afa(
                    gebaeudewert=gebaeudewert,
                    baujahr=data.baujahr,
                    ist_neubau_ab_2023=(data.baujahr >= 2023),
                    ist_denkmal=False,
                    ist_vermietung=(zweck == "kapitalanlage")
                )

            # Leverage-Effekt berechnen
            if ek > 0:
                finanzierungssumme = data.kaufpreis - ek
                objektrendite = bruttorendite
                leverage_result = berechne_leverage_effekt(
                    objektrendite=objektrendite,
                    fremdkapitalzins=zins,
                    eigenkapital=ek,
                    fremdkapital=finanzierungssumme
                )

            # Quick Check
            quick_check_result = quick_check({
                "bruttorendite": bruttorendite,
                "kaufpreisfaktor": kaufpreisfaktor,
                "cashflow": cashflow_monat,
                "energieklasse": data.energieklasse or "",
                "erbpacht": False,  # Aus Beschreibung extrahiert in check_no_gos
                "sozialbindung": False
            })

    # 8. KI-BEWERTUNG mit allen Informationen + Knowledge Base System Prompt
    system_prompt = get_ai_system_prompt()

    analyse_prompt = f"""Analysiere diese Immobilie professionell und bewerte jedes Kriterium mit einem Score von 0-100.

=== IMMOBILIENDATEN ===
{json.dumps(data.dict(), indent=2, ensure_ascii=False)}

=== VERWENDUNGSZWECK ===
{zweck}

=== NO-GO-PRÜFUNG ===
{json.dumps(no_go_check, indent=2, ensure_ascii=False)}
⚠️ WICHTIG: Bei No-Gos Alternativen und Verbesserungsvorschläge geben!

=== WARNSIGNALE ===
{json.dumps(warnsignale, indent=2, ensure_ascii=False)}

=== INVESTMENT-METRIKEN (Kapitalanlage) ===
{json.dumps(investment_metriken, indent=2, ensure_ascii=False) if investment_metriken else "Nicht berechnet"}

=== FAIRER PREIS BERECHNUNG ===
{json.dumps(fairer_preis_result, indent=2, ensure_ascii=False) if fairer_preis_result else "Nicht berechnet"}

=== FÖRDERUNGEN ===
{json.dumps(foerderungen_empfehlung, indent=2, ensure_ascii=False) if foerderungen_empfehlung else "Keine passenden Förderungen"}

=== CASHFLOW-ANALYSE ===
{json.dumps(cashflow_analyse, indent=2, ensure_ascii=False) if cashflow_analyse else "Nicht berechnet"}

Standard-Finanzierung: 3.75% Zins + 1.25% Tilgung = 5.0% Gesamtrate

=== MARKTDATEN ===
{json.dumps(marktdaten, indent=2, ensure_ascii=False) if marktdaten else "Keine Marktdaten verfügbar"}

=== BEWERTUNGSKRITERIEN für {zweck.upper()} ===
{json.dumps(weights, indent=2, ensure_ascii=False)}

Bewerte jedes Kriterium mit Score (0-100) und kurzer Begründung:

1. **cashflow_rendite** (Gewichtung: {weights['cashflow_rendite']}%)
   - Kaufpreisfaktor: <20 sehr gut, 20-25 gut, >25 kritisch
   - Bruttorendite: >5% sehr gut, 4-5% gut, <3% kritisch
   - Cashflow > 0 = gut, < 0 = schlecht

2. **lage** (Gewichtung: {weights['lage']}%)
   - Stadtteil, Infrastruktur, Marktdaten

3. **kaufpreis_qm** (Gewichtung: {weights['kaufpreis_qm']}%)
   - Vergleich mit Marktdurchschnitt

4. **zukunftspotenzial** (Gewichtung: {weights['zukunftspotenzial']}%)
   - Preisentwicklung, Standortentwicklung

5. **zustand_baujahr** (Gewichtung: {weights['zustand_baujahr']}%)
   - Zustand, Baujahr, Sanierungsbedarf
   - Fertighäuser 1960-1990 kritisch prüfen

6. **energieeffizienz** (Gewichtung: {weights['energieeffizienz']}%)
   - Energieklasse (G/H = Sanierung empfohlen, KfW 261 prüfen!)

7. **nebenkosten** (Gewichtung: {weights['nebenkosten']}%)
   - Hausgeld/Nebenkosten im Verhältnis

8. **grundriss** (Gewichtung: {weights['grundriss']}%)
   - Zimmerzahl, Schnitt, Ausstattung

9. **verkäufertyp** (Gewichtung: {weights['verkäufertyp']}%)
   - Privat vs. Makler, Provision

WICHTIG - PHILOSOPHIE:
- NIEMALS nur "Nein" sagen!
- Bei schlechtem Score: Preisverhandlung, Förderungen, Mieterhöhungspotenzial aufzeigen
- "Fairer Preis" als Verhandlungsziel angeben
- Konstruktive Tipps auch bei Ablehnung

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
    "zusammenfassung": "<3-4 Sätze mit: 1) Gesamtbewertung, 2) Wichtigste Förderung, 3) Verhandlungsziel wenn überteuert>"
}}

Antworte NUR mit dem JSON."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2500,
            system=system_prompt,
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

        result = AnalysisResult(
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
            marktdaten=marktdaten,
            tilgungsplan=tilgungsplan,
            breakeven_eigenkapital=breakeven_eigenkapital,
            szenarien=szenarien,
            sensitivity_analyse=sensitivity_analyse,
            investment_vergleich=investment_vergleich,
            meilensteine=meilensteine,
            miet_variationen=miet_variationen,
            finanzierungsoptionen=finanzierungsoptionen,
            # NEU: Knowledge Base Integration
            verbesserungsvorschlaege=verbesserungsvorschlaege,
            foerderungen=foerderungen_empfehlung,
            fairer_preis=fairer_preis_result,
            afa_berechnung=afa_result,
            leverage_effekt=leverage_result,
            quick_check_result=quick_check_result
        )

        # Speichere Analyse in Datenbank
        db_analysis = Analysis(
            user_id=current_user.id,
            property_data=data.dict(),
            analysis_result=result.dict(),
            verwendungszweck=zweck,
            eigenkapital=request.eigenkapital or 0,
            zinssatz=request.zinssatz or 3.75,
            tilgung=request.tilgung or 1.25,
            kaufpreis=data.kaufpreis,
            wohnflaeche=data.wohnflaeche,
            stadt=data.stadt,
            stadtteil=data.stadtteil,
            gesamtscore=gesamtscore,
            title=f"{data.stadt or 'Unbekannt'} - {data.objekttyp or 'Immobilie'}"
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        return result
        
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
