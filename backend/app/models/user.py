import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """
    User model with gamification fields.
    
    Key Design Decisions:
    - last_activity_date: Stored for O(1) streak calculation
    - hearts_updated_at: For time-based heart regeneration
    - Indexes on total_xp/current_streak for leaderboard queries
    """
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    
    # Gamification
    total_xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
    
    # Hearts/Lives system
    hearts = Column(Integer, default=5)
    hearts_updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    challenge_progress = relationship("ChallengeProgress", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("UserSubscription", back_populates="user", uselist=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('total_xp >= 0', name='check_xp_positive'),
        CheckConstraint('current_streak >= 0', name='check_streak_positive'),
        CheckConstraint('hearts >= 0 AND hearts <= 5', name='check_hearts_range'),
    )
    
    def __repr__(self):
        return f"<User {self.username}>"
