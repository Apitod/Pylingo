from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from enum import Enum


class LeagueTier(str, Enum):
    """League tiers based on total XP"""
    BRONZE = "Bronze"
    SILVER = "Silver"
    GOLD = "Gold"
    SAPPHIRE = "Sapphire"
    RUBY = "Ruby"
    EMERALD = "Emerald"
    AMETHYST = "Amethyst"
    PEARL = "Pearl"
    OBSIDIAN = "Obsidian"
    DIAMOND = "Diamond"


def get_league_tier(total_xp: int) -> LeagueTier:
    """Determine league tier based on total XP"""
    if total_xp >= 50000:
        return LeagueTier.DIAMOND
    elif total_xp >= 30000:
        return LeagueTier.OBSIDIAN
    elif total_xp >= 20000:
        return LeagueTier.PEARL
    elif total_xp >= 15000:
        return LeagueTier.AMETHYST
    elif total_xp >= 10000:
        return LeagueTier.EMERALD
    elif total_xp >= 5000:
        return LeagueTier.RUBY
    elif total_xp >= 2500:
        return LeagueTier.SAPPHIRE
    elif total_xp >= 1000:
        return LeagueTier.GOLD
    elif total_xp >= 500:
        return LeagueTier.SILVER
    else:
        return LeagueTier.BRONZE


# Leaderboard Schemas
class LeaderboardEntry(BaseModel):
    """Single entry in the leaderboard"""
    rank: int
    user_id: UUID
    username: str
    avatar_url: Optional[str] = None
    weekly_xp: int
    total_xp: int
    current_streak: int
    league: LeagueTier


class LeaderboardResponse(BaseModel):
    """Full leaderboard response with top users and current user position"""
    top_users: List[LeaderboardEntry]
    current_user: Optional[LeaderboardEntry] = None
    total_participants: int
    week_start: datetime
    week_end: datetime


# User Profile/Stats Schemas
class UserProfileResponse(BaseModel):
    """Detailed user profile for public profile page"""
    id: UUID
    username: str
    avatar_url: Optional[str] = None
    total_xp: int
    current_streak: int
    longest_streak: int
    league: LeagueTier
    courses_completed: int
    lessons_completed: int
    challenges_completed: int
    member_since: datetime
    last_active: Optional[datetime] = None


class UserStatsResponse(BaseModel):
    """Quick stats for user profile"""
    total_xp: int
    current_streak: int
    longest_streak: int
    league: LeagueTier
    league_rank: int  # Position in current league
    courses_completed: int
    lessons_completed: int
    achievements_count: int
