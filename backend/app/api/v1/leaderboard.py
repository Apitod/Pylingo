from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.models.progress import ChallengeProgress
from app.schemas.leaderboard import (
    LeaderboardResponse,
    LeaderboardEntry,
    UserProfileResponse,
    UserStatsResponse,
    LeagueTier,
    get_league_tier,
)

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def get_week_bounds() -> tuple[datetime, datetime]:
    """Get the start and end of the current week (Monday-Sunday)"""
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    return (
        datetime.combine(week_start, datetime.min.time()),
        datetime.combine(week_end, datetime.max.time()),
    )


@router.get("/", response_model=LeaderboardResponse)
async def get_leaderboard(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get weekly leaderboard with top users ranked by XP.
    
    Uses window functions for efficient ranking.
    Includes current user's position even if outside top N.
    """
    week_start, week_end = get_week_bounds()
    
    # For MVP without weekly tracking, we use total_xp
    # In production, you'd track weekly XP in a separate table
    
    # Get all users with XP, ranked
    ranked_users = (
        db.query(
            User.id,
            User.username,
            User.avatar_url,
            User.total_xp,
            User.current_streak,
            func.row_number().over(order_by=User.total_xp.desc()).label('rank')
        )
        .filter(User.total_xp > 0)
        .order_by(User.total_xp.desc())
        .all()
    )
    
    # Build top users list
    top_users = []
    current_user_entry = None
    
    for entry in ranked_users[:limit]:
        league = get_league_tier(entry.total_xp)
        leaderboard_entry = LeaderboardEntry(
            rank=entry.rank,
            user_id=entry.id,
            username=entry.username,
            avatar_url=entry.avatar_url,
            weekly_xp=entry.total_xp,  # For MVP, using total as weekly
            total_xp=entry.total_xp,
            current_streak=entry.current_streak,
            league=league,
        )
        top_users.append(leaderboard_entry)
        
        # Check if this is the current user
        if current_user and entry.id == current_user.id:
            current_user_entry = leaderboard_entry
    
    # If current user is not in top N, find their position
    if current_user and not current_user_entry:
        for entry in ranked_users:
            if entry.id == current_user.id:
                league = get_league_tier(entry.total_xp)
                current_user_entry = LeaderboardEntry(
                    rank=entry.rank,
                    user_id=entry.id,
                    username=entry.username,
                    avatar_url=entry.avatar_url,
                    weekly_xp=entry.total_xp,
                    total_xp=entry.total_xp,
                    current_streak=entry.current_streak,
                    league=league,
                )
                break
    
    return LeaderboardResponse(
        top_users=top_users,
        current_user=current_user_entry,
        total_participants=len(ranked_users),
        week_start=week_start,
        week_end=week_end,
    )


@router.get("/weekly", response_model=LeaderboardResponse)
async def get_weekly_leaderboard(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Alias for main leaderboard - returns weekly rankings.
    """
    return await get_leaderboard(limit, db, current_user)
