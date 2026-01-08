from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime, date


class UserBase(BaseModel):
    """Base user schema with shared fields."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Public user response schema."""
    id: UUID
    avatar_url: Optional[str] = None
    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserGameStats(BaseModel):
    """Gamification stats for user profile/dashboard."""
    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    last_activity_date: Optional[date] = None
    is_pro: bool = False
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """JWT token payload."""
    sub: str  # user ID
    exp: datetime
