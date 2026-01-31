"""
Datenbank-Konfiguration für SQLAlchemy
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite Datenbank (einfach für Development)
# Für Production würde man PostgreSQL verwenden
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./amlaki.db")

# Render verwendet postgres:// statt postgresql:// - SQLAlchemy braucht postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency für Datenbankzugriff"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_migrations():
    """Führt notwendige Migrationen durch"""
    with engine.connect() as conn:
        # Prüfe und füge usage_limit_usd zur users Tabelle hinzu
        try:
            conn.execute(text("SELECT usage_limit_usd FROM users LIMIT 1"))
        except Exception:
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN usage_limit_usd FLOAT DEFAULT 5.0"))
                conn.commit()
                print("Migration: usage_limit_usd Spalte hinzugefügt")
            except Exception as e:
                print(f"Migration usage_limit_usd fehlgeschlagen: {e}")


def init_db():
    """Initialisiert die Datenbank-Tabellen"""
    # Importiere Models hier um sicherzustellen dass alle Tabellen registriert sind
    from models import User, Analysis, UsageLog

    # Erstelle alle Tabellen
    Base.metadata.create_all(bind=engine)
    print(f"Database initialized with tables: {list(Base.metadata.tables.keys())}")

    # Führe Migrationen für existierende Tabellen durch
    run_migrations()
