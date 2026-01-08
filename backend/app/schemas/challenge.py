from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ChallengeSubmission(BaseModel):
    """Request body for submitting a challenge answer."""
    challenge_id: UUID
    answer: str


class ChallengeResultResponse(BaseModel):
    """Response after checking an answer."""
    is_correct: bool
    correct_answer: str
    xp_earned: int = 0
    hearts_remaining: int
    hearts_deducted: bool = False
    streak_updated: bool = False
    current_streak: Optional[int] = None
    message: str
