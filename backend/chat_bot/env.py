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

    ACCESS_TOKEN_LIFETIME: int = 12
    REFRESH_TOKEN_LIFETIME: int = 1

    AWS_STORAGE_BUCKET_NAME: str = "my-rag-chat-bot"
    AWS_STORAGE_REGION: str = "ap-south-1"
    AWS_ACCESS_KEY_ID: str = "***"
    AWS_SECRET_ACCESS_KEY: str = "***"

ENV = Environment()