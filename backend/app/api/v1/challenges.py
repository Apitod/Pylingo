from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.models.challenge import Challenge
from app.models.progress import ChallengeProgress
from app.schemas.challenge import ChallengeSubmission, ChallengeResultResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/challenge-progress", tags=["challenges"])


@router.post("/", response_model=ChallengeResultResponse)
async def submit_challenge(
    submission: ChallengeSubmission,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Submit an answer for a challenge and receive feedback.
    
    For MVP: Works without authentication - just validates the answer
    and returns the result without tracking progress.
    
    If authenticated: Full gamification with XP, streaks, hearts.
    """
    # Fetch the challenge
    challenge = db.query(Challenge).filter(Challenge.id == submission.challenge_id).first()
    
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    
    # Validate answer (case-insensitive, trimmed)
    user_answer = submission.answer.strip().lower()
    correct_answer = challenge.correct_answer.strip().lower()
    is_correct = user_answer == correct_answer
    
    # If no user is logged in, return simple result (no tracking)
    if not current_user:
        return ChallengeResultResponse(
            is_correct=is_correct,
            correct_answer=challenge.correct_answer,
            xp_earned=3 if is_correct else 0,  # Demo XP
            hearts_remaining=5,  # Demo hearts
            hearts_deducted=not is_correct,
            streak_updated=is_correct,
            current_streak=1 if is_correct else 0,
            message="Correct! 🎉" if is_correct else "Not quite. Try again!"
        )
    
    # Full gamification for authenticated users
    gamification = GamificationService(db)
    gamification.regenerate_hearts(current_user)
    
    # Check if user has hearts (unless Pro)
    is_pro = (
        current_user.subscription and 
        current_user.subscription.is_active and
        current_user.subscription.plan_type.value in ['PLUS', 'FAMILY']
    )
    
    if current_user.hearts <= 0 and not is_pro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No hearts remaining. Wait for regeneration or upgrade to Pro."
        )
    
    # Check if already completed (idempotency)
    existing_progress = (
        db.query(ChallengeProgress)
        .filter(
            ChallengeProgress.user_id == current_user.id,
            ChallengeProgress.challenge_id == challenge.id
        )
        .first()
    )
    
    if existing_progress and existing_progress.completed:
        return ChallengeResultResponse(
            is_correct=True,
            correct_answer=challenge.correct_answer,
            xp_earned=0,
            hearts_remaining=current_user.hearts,
            hearts_deducted=False,
            streak_updated=False,
            current_streak=current_user.current_streak,
            message="Already completed!"
        )
    
    if is_correct:
        # Calculate XP per challenge
        lesson = challenge.lesson
        total_challenges = len(lesson.challenges)
        xp_per_challenge = lesson.xp_reward // max(total_challenges, 1)
        
        # Update gamification
        streak_updated = gamification.update_user_streak(current_user)
        gamification.add_xp(current_user, xp_per_challenge)
        
        # Record completion
        if existing_progress:
            existing_progress.completed = True
            existing_progress.completed_at = datetime.utcnow()
        else:
            progress = ChallengeProgress(
                user_id=current_user.id,
                challenge_id=challenge.id,
                completed=True,
                completed_at=datetime.utcnow()
            )
            db.add(progress)
        
        db.commit()
        
        return ChallengeResultResponse(
            is_correct=True,
            correct_answer=challenge.correct_answer,
            xp_earned=xp_per_challenge,
            hearts_remaining=current_user.hearts,
            hearts_deducted=False,
            streak_updated=streak_updated,
            current_streak=current_user.current_streak,
            message="Correct! 🎉"
        )
    else:
        # Wrong answer - deduct heart
        hearts_deducted = gamification.deduct_heart(current_user)
        
        # Record attempt without completion
        if not existing_progress:
            progress = ChallengeProgress(
                user_id=current_user.id,
                challenge_id=challenge.id,
                completed=False
            )
            db.add(progress)
        
        db.commit()
        
        return ChallengeResultResponse(
            is_correct=False,
            correct_answer=challenge.correct_answer,
            xp_earned=0,
            hearts_remaining=current_user.hearts,
            hearts_deducted=hearts_deducted,
            streak_updated=False,
            current_streak=current_user.current_streak,
            message="Not quite. The correct answer is shown above."
        )
