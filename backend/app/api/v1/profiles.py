from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.models.progress import ChallengeProgress
from app.schemas.leaderboard import (
    UserProfileResponse,
    UserStatsResponse,
    get_league_tier,
)

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/{username}", response_model=UserProfileResponse)
async def get_user_profile(
    username: str,
    db: Session = Depends(get_db),
):
    """
    Get public profile for a user by username.
    
    Returns:
        User profile with stats, league tier, and completion counts.
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
    
    # Count completed challenges
    challenges_completed = (
        db.query(func.count(ChallengeProgress.id))
        .filter(
            ChallengeProgress.user_id == user.id,
            ChallengeProgress.completed == True
        )
        .scalar() or 0
    )
    
    # Get unique completed lessons (based on completing all challenges)
    # For MVP, we estimate 4 challenges per lesson
    lessons_completed = challenges_completed // 4
    
    # Courses completed (for MVP, 1 course per 10 lessons)
    courses_completed = lessons_completed // 10
    
    # Calculate league
    league = get_league_tier(user.total_xp)
    
    return UserProfileResponse(
        id=user.id,
        username=user.username,
        avatar_url=user.avatar_url,
        total_xp=user.total_xp,
        current_streak=user.current_streak,
        longest_streak=user.longest_streak,
        league=league,
        courses_completed=courses_completed,
        lessons_completed=lessons_completed,
        challenges_completed=challenges_completed,
        member_since=user.created_at,
        last_active=user.last_activity_date,
    )


@router.get("/{username}/stats", response_model=UserStatsResponse)
async def get_user_stats(
    username: str,
    db: Session = Depends(get_db),
):
    """
    Get quick stats for a user by username.
    Lighter-weight endpoint for stats display.
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
    
    # Count completed challenges
    challenges_completed = (
        db.query(func.count(ChallengeProgress.id))
        .filter(
            ChallengeProgress.user_id == user.id,
            ChallengeProgress.completed == True
        )
        .scalar() or 0
    )
    
    lessons_completed = challenges_completed // 4
    courses_completed = lessons_completed // 10
    
    # Calculate league and rank within league
    league = get_league_tier(user.total_xp)
    
    # Calculate league rank (position among users in same league)
    users_in_league = (
        db.query(User)
        .filter(User.total_xp > 0)
        .order_by(User.total_xp.desc())
        .all()
    )
    
    league_rank = 1
    for u in users_in_league:
        if get_league_tier(u.total_xp) == league and u.total_xp > user.total_xp:
            league_rank += 1
    
    return UserStatsResponse(
        total_xp=user.total_xp,
        current_streak=user.current_streak,
        longest_streak=user.longest_streak,
        league=league,
        league_rank=league_rank,
        courses_completed=courses_completed,
        lessons_completed=lessons_completed,
        achievements_count=0,  # Achievements not implemented yet
    )
