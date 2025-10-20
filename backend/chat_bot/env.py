from pydantic_settings import BaseSettings, SettingsConfigDict

class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    DEBUG: bool = False
    POSTGRES_DB: str = "chatbot"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "mysecretpassword"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    SECRET_KEY: str = "secretkey"
    GEMENI_API_KEY: str = "ZBRICK123"
    AI_MODEL: str = "gemini-2.5-flash"
ENV = Environment()