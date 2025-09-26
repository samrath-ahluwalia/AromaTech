from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from app.schemas import VerificationCodeRequest, RegistrationRequest, LoginRequest
from app.services.api_client import api_client

app = FastAPI(
    title="AromaTech API",
    description="AromaTech Backend API",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Welcome to AromaTech API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/auth/request-verification-code")
async def request_verification_code(request: VerificationCodeRequest):
    """
    Request verification code for email
    """
    try:
        result = await api_client.request_verification_code(
            email=request.email,
            type=request.type
        )
        
        if result.success:
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": result.message,
                    "email": request.email
                }
            )
        else:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": result.message
                }
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/auth/register")
async def register_user(request: RegistrationRequest):
    """
    Register a new user with verification code
    """
    try:
        result = await api_client.register_user(request)
        
        if result.success:
            return JSONResponse(
                status_code=201,
                content={
                    "success": True,
                    "message": result.message,
                    "user_id": result.user_id
                }
            )
        else:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": result.message
                }
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/auth/login")
async def login_user(request: LoginRequest):
    """
    Login user with username/email and password
    """
    try:
        result = await api_client.login_user(request)
        
        if result.success:
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": result.message,
                    "token": result.token,
                    "user_info": result.user_info
                }
            )
        else:
            return JSONResponse(
                status_code=401,
                content={
                    "success": False,
                    "message": result.message
                }
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )