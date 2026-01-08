import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Course(Base):
    """
    Top-level course container (e.g., "Python Fundamentals", "Data Structures").
    
    Courses contain multiple units, ordered by order_index.
    """
    __tablename__ = "courses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order_index")
    
    def __repr__(self):
        return f"<Course {self.title}>"


class Unit(Base):
    """
    A unit within a course (e.g., "Variables & Types", "Control Flow").
    
    Units group related lessons and have a color for the journey map.
    """
    __tablename__ = "units"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0, index=True)
    color = Column(String(7), default="#58CC02")  # Duolingo green
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    course = relationship("Course", back_populates="units")
    lessons = relationship("Lesson", back_populates="unit", cascade="all, delete-orphan", order_by="Lesson.order_index")
    
    def __repr__(self):
        return f"<Unit {self.title}>"


class Lesson(Base):
    """
    A lesson containing challenges (quizzes).
    
    Completing all challenges in a lesson awards xp_reward XP.
    """
    __tablename__ = "lessons"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    unit_id = Column(UUID(as_uuid=True), ForeignKey("units.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    order_index = Column(Integer, default=0, index=True)
    xp_reward = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    unit = relationship("Unit", back_populates="lessons")
    challenges = relationship("Challenge", back_populates="lesson", cascade="all, delete-orphan", order_by="Challenge.order_index")
    
    def __repr__(self):
        return f"<Lesson {self.title}>"
