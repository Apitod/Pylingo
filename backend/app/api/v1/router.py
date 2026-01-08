from fastapi import APIRouter

from app.api.v1 import courses, lessons, challenges, users, leaderboard, profiles

api_router = APIRouter()

# Include all route modules
api_router.include_router(users.router)
api_router.include_router(courses.router)
api_router.include_router(lessons.router)
api_router.include_router(challenges.router)
api_router.include_router(leaderboard.router)
api_router.include_router(profiles.router)
