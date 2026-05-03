from typing import Optional
from beanie import Document
from pydantic import Field
from datetime import datetime

class User(Document):
    email: str
    password_hash: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    plan: str = "free"

    class Settings:
        name = "users"

class ScanHistory(Document):
    user_id: str
    language: str
    input_type: str  # manual/ocr
    original_code: str
    detected_errors: list
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "scan_history"
