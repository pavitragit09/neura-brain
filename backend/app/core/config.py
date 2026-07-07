from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class Settings(BaseSettings):

    GEMINI_API_KEY: str

    QDRANT_URL: str

    COLLECTION_NAME: str

    DATABASE_URL: str

    SECRET_KEY: str

    UPLOAD_DIR: Path = Path("uploads")

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()