"""
Datenbank-Konfiguration für SQLAlchemy
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite Datenbank (einfach für Development)
# Für Production würde man PostgreSQL verwenden
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./amlaki.db")

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


def init_db():
    """Initialisiert die Datenbank-Tabellen"""
    Base.metadata.create_all(bind=engine)
