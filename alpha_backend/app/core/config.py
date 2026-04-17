from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    ENVIRONMENT: str = "development"
    MAIL_FROM: str
    MAIL_SERVER: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    FRONTEND_ORIGIN: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    ADMIN_EMAIL: str = "admin@alpha.com"
    ADMIN_PASSWORD: str = ""

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator('SECRET_KEY')
    @classmethod
    def secret_key_must_exist(cls, v):
        if not v or len(v) < 32:
            raise ValueError('SECRET_KEY must be at least 32 characters and not empty. Set it in .env file.')
        return v

settings = Settings()
