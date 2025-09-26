from pydantic import BaseModel, EmailStr
from typing import Optional

class VerificationCodeRequest(BaseModel):
    email: EmailStr
    type: int = 0

class VerificationCodeResponse(BaseModel):
    success: bool
    message: str
    code: Optional[str] = None

class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    validCode: str

class RegistrationResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    account: str  # Can be username or email
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user_info: Optional[dict] = None
