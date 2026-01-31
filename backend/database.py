"""
Datenbank-Konfiguration für SQLAlchemy
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time

# SQLite Datenbank (einfach für Development)
# Für Production würde man PostgreSQL verwenden
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./amlaki.db")

# Render verwendet postgres:// statt postgresql:// - SQLAlchemy braucht postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Connection args basierend auf Datenbanktyp
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
else:
    # PostgreSQL mit Supabase Pooler - braucht spezielle Einstellungen
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        connect_args={
            "options": "-c statement_timeout=60000",
            "connect_timeout": 30
        }
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
    try:
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
    except Exception as e:
        print(f"Could not run migrations: {e}")


def init_db(max_retries=5, retry_delay=3):
    """Initialisiert die Datenbank-Tabellen mit Retry-Logik"""
    # Importiere Models hier um sicherzustellen dass alle Tabellen registriert sind
    from models import User, Analysis, UsageLog

    for attempt in range(max_retries):
        try:
            # Teste Verbindung zuerst
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))

            # Erstelle alle Tabellen
            Base.metadata.create_all(bind=engine)
            print(f"Database initialized with tables: {list(Base.metadata.tables.keys())}")

            # Führe Migrationen für existierende Tabellen durch
            run_migrations()
            return  # Erfolg!

        except Exception as e:
            print(f"Database connection attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("WARNING: Could not connect to database after all retries. App will start anyway.")
                print("Database operations may fail until connection is available.")
