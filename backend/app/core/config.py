from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App settings
    PROJECT_NAME: str = "AromaTech"
    VERSION: str = "1.0.0"
    
    # External API settings
    EXTERNAL_API_BASE_URL: str = "https://api.shangxiang.ai-aroma.tech"
    EXTERNAL_API_TIMEOUT: int = 30
    # Add specific endpoint path if needed (e.g., "/send-code" or "/verification")
    VERIFICATION_ENDPOINT_PATH: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()