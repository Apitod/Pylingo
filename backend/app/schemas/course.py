from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID


class LessonBrief(BaseModel):
    """Brief lesson info for course hierarchy view."""
    id: UUID
    title: str
    order_index: int
    xp_reward: int
    progress_percentage: float = 0.0
    
    class Config:
        from_attributes = True


class UnitResponse(BaseModel):
    """Unit with nested lessons."""
    id: UUID
    title: str
    description: Optional[str] = None
    order_index: int
    color: str
    lessons: List[LessonBrief] = []
    
    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    """Course response without progress."""
    id: UUID
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: int
    is_active: bool
    
    class Config:
        from_attributes = True


class CourseWithProgressResponse(CourseResponse):
    """Full course response with units and progress."""
    units: List[UnitResponse] = []
    
    class Config:
        from_attributes = True
