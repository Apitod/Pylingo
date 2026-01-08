from pydantic import BaseModel
from typing import List, Any, Optional
from uuid import UUID

from app.models.challenge import ChallengeType


class ChallengeResponse(BaseModel):
    """Challenge response for quiz display (no correct answer!)."""
    id: UUID
    type: ChallengeType
    question: str
    options: Any  # JSONB content - flexible structure
    order_index: int
    
    class Config:
        from_attributes = True


class LessonDetailResponse(BaseModel):
    """Full lesson with all challenges for quiz flow."""
    id: UUID
    title: str
    xp_reward: int
    challenges: List[ChallengeResponse]
    total_challenges: int
    
    class Config:
        from_attributes = True
