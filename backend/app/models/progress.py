import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class ChallengeProgress(Base):
    """
    Tracks user completion of challenges.
    
    Unique constraint ensures one entry per user per challenge.
    """
    __tablename__ = "challenge_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="challenge_progress")
    challenge = relationship("Challenge", back_populates="progress")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'challenge_id', name='unique_user_challenge'),
    )
    
    def __repr__(self):
        return f"<ChallengeProgress user={self.user_id} challenge={self.challenge_id}>"


class SubscriptionPlan(str, enum.Enum):
    """Available subscription tiers."""
    FREE = "FREE"
    PLUS = "PLUS"
    FAMILY = "FAMILY"


class UserSubscription(Base):
    """
    User subscription for premium features.
    
    Pro users (PLUS/FAMILY) get:
    - Unlimited hearts
    - No ads (future)
    - Exclusive content (future)
    """
    __tablename__ = "user_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    plan_type = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    start_date = Column(DateTime(timezone=True), default=datetime.utcnow)
    end_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    
    def __repr__(self):
        return f"<UserSubscription {self.user_id}: {self.plan_type}>"
