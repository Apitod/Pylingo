from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.models.course import Course, Unit, Lesson
from app.models.challenge import Challenge
from app.models.progress import ChallengeProgress
from app.schemas.course import CourseWithProgressResponse, UnitResponse, LessonBrief

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=List[CourseWithProgressResponse])
async def get_courses(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Fetch all courses with nested units, lessons, and user progress.
    
    Returns a hierarchical structure optimized for the "Journey Map" view.
    Uses eager loading to prevent N+1 query problems.
    
    The progress_percentage for each lesson is calculated based on
    how many challenges the user has completed.
    """
    # Fetch courses with all nested relationships in one query
    courses = (
        db.query(Course)
        .options(
            joinedload(Course.units)
            .joinedload(Unit.lessons)
            .joinedload(Lesson.challenges)
        )
        .filter(Course.is_active == True)
        .order_by(Course.order_index)
        .all()
    )
    
    # Fetch user's completed challenges in one query (efficient)
    # If no user is logged in, progress will be empty
    completed_challenge_ids = set()
    if current_user:
        completed_challenge_ids = set(
            row.challenge_id for row in 
            db.query(ChallengeProgress.challenge_id)
            .filter(
                ChallengeProgress.user_id == current_user.id,
                ChallengeProgress.completed == True
            )
            .all()
        )
    
    # Build response with progress calculations
    result = []
    for course in courses:
        units_data = []
        for unit in sorted(course.units, key=lambda u: u.order_index):
            lessons_data = []
            for lesson in sorted(unit.lessons, key=lambda l: l.order_index):
                total = len(lesson.challenges)
                completed = sum(
                    1 for c in lesson.challenges 
                    if c.id in completed_challenge_ids
                )
                progress = (completed / total * 100) if total > 0 else 0
                
                lessons_data.append(LessonBrief(
                    id=lesson.id,
                    title=lesson.title,
                    order_index=lesson.order_index,
                    xp_reward=lesson.xp_reward,
                    progress_percentage=progress
                ))
            
            units_data.append(UnitResponse(
                id=unit.id,
                title=unit.title,
                description=unit.description,
                order_index=unit.order_index,
                color=unit.color,
                lessons=lessons_data
            ))
        
        result.append(CourseWithProgressResponse(
            id=course.id,
            title=course.title,
            description=course.description,
            image_url=course.image_url,
            order_index=course.order_index,
            is_active=course.is_active,
            units=units_data
        ))
    
    return result
