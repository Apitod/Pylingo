from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""
    
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/pylingo"
    
    # Security
    secret_key: str = "0fe3a4857018451d89b62359ed1f5526d8b4aba29d95b8995db245d172a381dd"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days
    
    # App
    app_name: str = "PyLingo API"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Cache settings to avoid reading .env on every request."""
    return Settings()
