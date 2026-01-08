from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
import bcrypt

from app.database import get_db
from app.config import get_settings
from app.models.user import User
from app.models.progress import UserSubscription
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserGameStats
from app.api.deps import get_current_user
from app.services.gamification import GamificationService

router = APIRouter(prefix="/users", tags=["users"])
settings = get_settings()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_access_token(user_id: str) -> str:
    """Create JWT access token."""
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Creates user with default gamification values:
    - 0 XP, 0 streak, 5 hearts
    """
    # Check existing email/username
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hash_password(user_data.password),
    )
    db.add(user)
    db.flush()  # Flush to get user.id before creating subscription
    
    # Create free subscription
    subscription = UserSubscription(user_id=user.id)
    db.add(subscription)
    
    db.commit()
    db.refresh(user)
    
    return Token(access_token=create_access_token(str(user.id)))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Regenerate hearts on login
    gamification = GamificationService(db)
    gamification.regenerate_hearts(user)
    db.commit()
    
    return Token(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


@router.get("/me/stats", response_model=UserGameStats)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's gamification stats."""
    # Regenerate hearts
    gamification = GamificationService(db)
    gamification.regenerate_hearts(current_user)
    db.commit()
    
    is_pro = (
        current_user.subscription and 
        current_user.subscription.is_active and
        current_user.subscription.plan_type.value in ['PLUS', 'FAMILY']
    )
    
    return UserGameStats(
        total_xp=current_user.total_xp,
        current_streak=current_user.current_streak,
        longest_streak=current_user.longest_streak,
        hearts=current_user.hearts,
        last_activity_date=current_user.last_activity_date,
        is_pro=is_pro
    )
