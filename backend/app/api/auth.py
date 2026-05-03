from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from app.models.user import User, ScanHistory
from app.services.auth_service import auth_service
from app.api.deps import get_current_user
from typing import Optional, List

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    print(f"Registration request received for email: {user_data.email}")
    # Check if user already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth_service.get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name
    )
    await user.insert()
    
    # Generate token
    token = auth_service.create_access_token(data={"sub": user.email, "id": str(user.id)})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user.email, "full_name": user.full_name, "id": str(user.id)}
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await User.find_one(User.email == credentials.email)
    if not user or not auth_service.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_service.create_access_token(data={"sub": user.email, "id": str(user.id)})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user.email, "full_name": user.full_name, "id": str(user.id)}
    }

@router.get("/history")
async def get_history(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    history = await ScanHistory.find(ScanHistory.user_id == str(user.id)).sort("-timestamp").to_list()
    return history
