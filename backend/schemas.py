"""
Pydantic Schemas für API Requests/Responses
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    default_verwendungszweck: Optional[str] = None
    default_zinssatz: Optional[float] = None
    default_tilgung: Optional[float] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool = False
    created_at: datetime
    default_verwendungszweck: str
    default_zinssatz: float
    default_tilgung: float

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Analysis Schemas
class AnalysisCreate(BaseModel):
    property_data: dict
    analysis_result: dict
    verwendungszweck: str
    eigenkapital: float = 0
    zinssatz: float = 3.75
    tilgung: float = 1.25
    title: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None


class AnalysisUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    is_favorite: Optional[bool] = None
    tags: Optional[str] = None


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    title: Optional[str]
    notes: Optional[str]
    is_favorite: bool
    tags: Optional[str]
    property_data: dict
    analysis_result: dict
    verwendungszweck: str
    eigenkapital: float
    zinssatz: float
    tilgung: float
    kaufpreis: Optional[float]
    wohnflaeche: Optional[float]
    stadt: Optional[str]
    stadtteil: Optional[str]
    gesamtscore: Optional[float]

    class Config:
        from_attributes = True


class AnalysisListItem(BaseModel):
    """Vereinfachte Ansicht für Listen"""
    id: int
    created_at: datetime
    title: Optional[str]
    is_favorite: bool
    tags: Optional[str]
    verwendungszweck: str
    kaufpreis: Optional[float]
    wohnflaeche: Optional[float]
    stadt: Optional[str]
    stadtteil: Optional[str]
    gesamtscore: Optional[float]

    class Config:
        from_attributes = True


# ========================================
# Erweiterte Analyse Schemas
# ========================================

class YearlyProjection(BaseModel):
    """Jahresweise Projektion für Tilgungsplan"""
    jahr: int
    restschuld: float
    getilgt: float
    zinsen_jahr: float
    tilgung_jahr: float
    jaehrlicher_cashflow: float
    monatlicher_cashflow: float
    immobilienwert: float
    eigenkapital_aufbau: float
    gesamtvermoegen: float
    aktuelle_miete: float


class TilgungsplanZusammenfassung(BaseModel):
    """Zusammenfassung des Tilgungsplans"""
    finanzierungssumme: float
    eigenkapital_start: float
    jaehrliche_rate: float
    monatliche_rate: float
    gesamte_zinsen: float
    gesamte_tilgung: float
    gesamtkosten: float
    restschuld_nach_laufzeit: float
    immobilienwert_nach_laufzeit: float
    gesamtvermoegen_nach_laufzeit: float
    cashflow_jahr_1: float
    cashflow_jahr_final: float
    kredit_abbezahlt_in_jahren: Optional[int]


class TilgungsplanResult(BaseModel):
    """Vollständiger Tilgungsplan"""
    jahre: List[dict]  # List of YearlyProjection as dicts
    zusammenfassung: dict  # TilgungsplanZusammenfassung as dict


class BreakEvenResult(BaseModel):
    """Ergebnis der Break-Even Eigenkapital-Berechnung"""
    benoetigtes_eigenkapital: float
    eigenkapital_quote_prozent: float
    max_finanzierungssumme: float
    monatlicher_cashflow: float
    ist_realistisch: bool
    verfuegbar_fuer_kredit_jaehrlich: float
    hinweis: str


class ScenarioAnnahmen(BaseModel):
    """Annahmen für ein Szenario"""
    zinssatz: float
    tilgung: float
    mietsteigerung_prozent: float
    wertsteigerung_prozent: float
    leerstand_prozent: float
    effektive_miete: float


class ScenarioResult(BaseModel):
    """Einzelnes Szenario-Ergebnis"""
    name: str
    beschreibung: str
    annahmen: dict  # ScenarioAnnahmen as dict
    cashflow_analyse: dict
    tilgungsplan: dict  # TilgungsplanResult as dict


class SensitivityCell(BaseModel):
    """Einzelne Zelle der Sensitivitätsmatrix"""
    monatlicher_cashflow: float
    jaehrlicher_cashflow: float
    selbsttragend: bool


class SensitivityReferenz(BaseModel):
    """Referenzwerte für Sensitivitätsanalyse"""
    zinssatz: float
    eigenkapital: float


class SensitivityResult(BaseModel):
    """Ergebnis der Sensitivitätsanalyse"""
    matrix: List[List[dict]]  # 2D Matrix of SensitivityCell as dicts
    zinssaetze: List[float]
    eigenkapital_werte: List[float]
    eigenkapital_prozente: List[int]
    aktueller_zins_index: int
    aktueller_ek_index: int
    tilgung: float
    referenz: dict  # SensitivityReferenz as dict


# ========================================
# Admin Schemas
# ========================================

class AdminUserResponse(BaseModel):
    """User-Ansicht für Admin"""
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime]
    analyses_count: int = 0
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    """Admin kann User bearbeiten"""
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class AdminStatsResponse(BaseModel):
    """Allgemeine Admin-Statistiken"""
    total_users: int
    active_users: int
    blocked_users: int
    total_analyses: int
    users_today: int
    users_this_week: int
    analyses_today: int
    analyses_this_week: int
