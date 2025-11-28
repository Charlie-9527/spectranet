from pydantic_settings import BaseSettings
from typing import Optional, List
import os


class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./spectranet.db"
    REDIS_URL: Optional[str] = None
    
    # JWT 配置
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30天
    
    # 上传配置
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 104857600  # 100MB
    
    # CORS 配置
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8000"))  # Railway 会提供 PORT 环境变量
    
    @property
    def origins_list(self) -> List[str]:
        """将 ALLOWED_ORIGINS 字符串转换为列表"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
