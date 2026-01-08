import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class ChallengeType(str, enum.Enum):
    """Types of challenges/quizzes supported."""
    SELECT = "SELECT"      # Multiple choice (pick one)
    ASSIST = "ASSIST"      # Fill in the blank with hints
    MATCH = "MATCH"        # Match pairs (drag and drop)
    FILL_BLANK = "FILL_BLANK"  # Type the answer


class Challenge(Base):
    """
    A single quiz question within a lesson.
    
    Options stored as JSONB for flexibility:
    - SELECT: [{"id": 1, "text": "Option A", "imageSrc": null}, ...]
    - MATCH: [{"left": "print()", "right": "Output text"}, ...]
    - FILL_BLANK: {"sentence": "The ___ of Python is fun", "blank_index": 1}
    """
    __tablename__ = "challenges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(ChallengeType), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSONB, nullable=False)
    correct_answer = Column(String(500), nullable=False)
    order_index = Column(Integer, default=0, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="challenges")
    progress = relationship("ChallengeProgress", back_populates="challenge", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Challenge {self.type}: {self.question[:30]}...>"
