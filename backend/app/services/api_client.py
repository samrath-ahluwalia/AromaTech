import httpx
from typing import Dict, Any
from app.core.config import settings
from app.schemas import VerificationCodeRequest, VerificationCodeResponse, RegistrationRequest, RegistrationResponse, LoginRequest, LoginResponse
import logging

logger = logging.getLogger(__name__)

class ExternalAPIClient:
    def __init__(self):
        self.base_url = settings.EXTERNAL_API_BASE_URL
        self.timeout = settings.EXTERNAL_API_TIMEOUT

    async def request_verification_code(self, email: str, type: int = 0) -> VerificationCodeResponse:
        """
        Request verification code from external API
        """
        # Use the actual API endpoint for verification code
        endpoint_path = "/xxiot/api/customer/emailCode"
        url = f"{self.base_url.rstrip('/')}{endpoint_path}"
        
        request_data = VerificationCodeRequest(email=email, type=type)
        
        logger.info(f"Requesting verification code from: {url}")
        logger.info(f"Request data: {request_data.model_dump()}")
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    url,
                    json=request_data.model_dump(),
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Response status: {response.status_code}")
                logger.info(f"Response body: {response.text}")
                
                response.raise_for_status()
                
                # Parse response based on actual API response structure
                response_data = response.json()
                
                # The API returns {"msg": "success", "code": 0} format
                # The "code" field is a status code (0 = success), not the verification code
                # The actual verification code is sent to the user's email
                api_code = response_data.get("code", -1)
                api_message = response_data.get("msg", "")
                
                if api_code == 0 and api_message == "success":
                    return VerificationCodeResponse(
                        success=True,
                        message="Verification code sent successfully to your email",
                        code=None  # Verification code is sent to email, not returned
                    )
                else:
                    return VerificationCodeResponse(
                        success=False,
                        message=f"Failed to send verification code: {api_message}"
                    )
                
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error requesting verification code: {e.response.status_code} - {e.response.text}")
                
                # Handle specific status codes
                if e.response.status_code == 401:
                    message = "Unauthorized: Invalid API credentials or endpoint"
                elif e.response.status_code == 404:
                    message = "API endpoint not found"
                elif e.response.status_code == 400:
                    message = "Bad request: Invalid email format or parameters"
                else:
                    message = f"HTTP error {e.response.status_code}"
                
                return VerificationCodeResponse(
                    success=False,
                    message=message
                )
            except httpx.RequestError as e:
                logger.error(f"Request error requesting verification code: {e}")
                return VerificationCodeResponse(
                    success=False,
                    message="Network error occurred while sending verification code"
                )
            except Exception as e:
                logger.error(f"Unexpected error requesting verification code: {e}")
                return VerificationCodeResponse(
                    success=False,
                    message="Unexpected error occurred"
                )

    async def register_user(self, registration_data: RegistrationRequest) -> RegistrationResponse:
        """
        Register user with external API using verification code
        """
        # Use the actual API endpoint for registration
        registration_endpoint = "/xxiot/api/customer/register"  # Adjust this based on actual API documentation
        url = f"{self.base_url.rstrip('/')}{registration_endpoint}"
        
        logger.info(f"Registering user at: {url}")
        logger.info(f"Registration data: {registration_data.model_dump()}")
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    url,
                    json=registration_data.model_dump(),
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Registration response status: {response.status_code}")
                logger.info(f"Registration response body: {response.text}")
                
                response.raise_for_status()
                
                # Parse response based on actual API response structure
                response_data = response.json()
                
                # The API likely returns {"msg": "success", "code": 0} format like the verification endpoint
                api_code = response_data.get("code", -1)
                api_message = response_data.get("msg", "")
                
                if api_code == 0 and api_message == "success":
                    return RegistrationResponse(
                        success=True,
                        message="User registered successfully",
                        user_id=response_data.get("user_id")  # Adjust based on actual response
                    )
                else:
                    return RegistrationResponse(
                        success=False,
                        message=f"Registration failed: {api_message}"
                    )
                
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error registering user: {e}")
                return RegistrationResponse(
                    success=False,
                    message=f"Failed to register user: {e.response.status_code}"
                )
            except httpx.RequestError as e:
                logger.error(f"Request error registering user: {e}")
                return RegistrationResponse(
                    success=False,
                    message="Network error occurred while registering user"
                )
            except Exception as e:
                logger.error(f"Unexpected error registering user: {e}")
                return RegistrationResponse(
                    success=False,
                    message="Unexpected error occurred"
                )

    async def login_user(self, login_data: LoginRequest) -> LoginResponse:
        """
        Login user with external API
        """
        # Use the actual API endpoint for login
        login_endpoint = "/xxiot/api/login"
        url = f"{self.base_url.rstrip('/')}{login_endpoint}"
        
        logger.info(f"Logging in user at: {url}")
        logger.info(f"Login data: {{'account': '{login_data.account}', 'password': '[REDACTED]'}}")
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    url,
                    json=login_data.model_dump(),
                    headers={"Content-Type": "application/json"}
                )
                
                logger.info(f"Login response status: {response.status_code}")
                logger.info(f"Login response body: {response.text}")
                
                response.raise_for_status()
                
                # Parse response based on actual API response structure
                response_data = response.json()
                
                # The API likely returns {"msg": "success", "code": 0, "data": {...}} format
                api_code = response_data.get("code", -1)
                api_message = response_data.get("msg", "")
                api_data = response_data.get("data", {})
                
                if api_code == 0 and api_message == "success":
                    return LoginResponse(
                        success=True,
                        message="Login successful",
                        token=api_data.get("token"),
                        user_info=api_data.get("user_info", api_data)
                    )
                else:
                    return LoginResponse(
                        success=False,
                        message=f"Login failed: {api_message}"
                    )
                    
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error during login: {e.response.status_code} - {e.response.text}")
                
                # Handle specific status codes
                if e.response.status_code == 401:
                    message = "Invalid username/email or password"
                elif e.response.status_code == 404:
                    message = "Login endpoint not found"
                elif e.response.status_code == 400:
                    message = "Bad request: Invalid login parameters"
                else:
                    message = f"HTTP error {e.response.status_code}"
                
                return LoginResponse(
                    success=False,
                    message=message
                )
            except httpx.RequestError as e:
                logger.error(f"Request error during login: {e}")
                return LoginResponse(
                    success=False,
                    message="Network error occurred during login"
                )
            except Exception as e:
                logger.error(f"Unexpected error during login: {e}")
                return LoginResponse(
                    success=False,
                    message="Unexpected error occurred"
                )

# Create a singleton instance
api_client = ExternalAPIClient()
