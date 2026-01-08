from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.progress import SubscriptionPlan


class GamificationService:
    """
    Centralized gamification logic.
    
    Why a service class?
    - Testable in isolation
    - Reusable across endpoints
    - Single source of truth for game mechanics
    """
    
    HEART_REGEN_HOURS = 5  # Hours to regenerate 1 heart
    MAX_HEARTS = 5
    
    def __init__(self, db: Session):
        self.db = db
    
    def update_user_streak(self, user: User) -> bool:
        """
        Update streak based on activity date logic.
        
        Returns True if streak was updated (for UI animation trigger).
        
        Logic:
        - Same day activity: No change
        - Yesterday activity: Increment streak
        - Older activity: Reset to 1
        """
        today = date.today()
        
        # Already active today
        if user.last_activity_date == today:
            return False
        
        # Continuing from yesterday
        if user.last_activity_date == today - timedelta(days=1):
            user.current_streak += 1
            user.longest_streak = max(user.longest_streak, user.current_streak)
        else:
            # Streak broken or first activity
            user.current_streak = 1
        
        user.last_activity_date = today
        return True
    
    def add_xp(self, user: User, amount: int) -> None:
        """Add XP to user's total."""
        user.total_xp += amount
    
    def deduct_heart(self, user: User) -> bool:
        """
        Deduct a heart if available.
        
        Returns True if heart was deducted, False if at 0 or Pro user.
        Pro users (with active subscription) don't lose hearts.
        """
        # Check for Pro subscription
        if user.subscription and user.subscription.is_active:
            if user.subscription.plan_type in [SubscriptionPlan.PLUS, SubscriptionPlan.FAMILY]:
                return False  # Pro users have unlimited hearts
        
        if user.hearts > 0:
            user.hearts -= 1
            return True
        return False
    
    def regenerate_hearts(self, user: User) -> int:
        """
        Calculate and apply heart regeneration.
        
        Called on user activity to auto-regen hearts based on time passed.
        Returns number of hearts regenerated.
        """
        if user.hearts >= self.MAX_HEARTS:
            return 0
        
        now = datetime.utcnow()
        if user.hearts_updated_at is None:
            user.hearts_updated_at = now
            return 0
        
        hours_passed = (now - user.hearts_updated_at).total_seconds() / 3600
        hearts_to_regen = int(hours_passed // self.HEART_REGEN_HOURS)
        
        if hearts_to_regen > 0:
            new_hearts = min(user.hearts + hearts_to_regen, self.MAX_HEARTS)
            regenerated = new_hearts - user.hearts
            user.hearts = new_hearts
            user.hearts_updated_at = now
            return regenerated
        
        return 0
    
    def check_streak_status(self, user: User) -> str:
        """
        Get streak status for display.
        
        Returns:
        - 'ACTIVE_TODAY': User completed activity today
        - 'ACTIVE_CONTINUE': Streak intact, activity needed today
        - 'BROKEN': Streak lost
        """
        today = date.today()
        
        if user.last_activity_date == today:
            return 'ACTIVE_TODAY'
        elif user.last_activity_date == today - timedelta(days=1):
            return 'ACTIVE_CONTINUE'
        else:
            return 'BROKEN'
