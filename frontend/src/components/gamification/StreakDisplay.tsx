'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
    streak: number;
    streakUpdated?: boolean;
    className?: string;
}

/**
 * Streak display with flame icon and celebration animation.
 */
export function StreakDisplay({ streak, streakUpdated, className }: StreakDisplayProps) {
    return (
        <div className={cn(
            'flex items-center gap-1 transition-all duration-300',
            streakUpdated && 'scale-110',
            className
        )}>
            <Flame
                className={cn(
                    'w-6 h-6 text-orange-500',
                    streak > 0 && 'fill-orange-500 flame-icon'
                )}
            />
            <span className="text-orange-500 font-bold text-lg">{streak}</span>
        </div>
    );
}
