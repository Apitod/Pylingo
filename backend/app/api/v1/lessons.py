from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from app.database import get_db
from app.models.course import Lesson
from app.schemas.lesson import LessonDetailResponse, ChallengeResponse

router = APIRouter(prefix="/lessons", tags=["lessons"])


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson(
    lesson_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Fetch a lesson with all its challenges.
    
    IMPORTANT: correct_answer is NOT included in the response.
    This prevents cheating - validation happens server-side.
    
    Challenges are returned in order, ready for the frontend state machine.
    """
    lesson = (
        db.query(Lesson)
        .options(joinedload(Lesson.challenges))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Sort challenges by order_index
    sorted_challenges = sorted(lesson.challenges, key=lambda c: c.order_index)
    
    return LessonDetailResponse(
        id=lesson.id,
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        challenges=[
            ChallengeResponse(
                id=c.id,
                type=c.type,
                question=c.question,
                options=c.options,
                order_index=c.order_index
                # NOTE: correct_answer intentionally excluded
            )
            for c in sorted_challenges
        ],
        total_challenges=len(sorted_challenges)
    )
