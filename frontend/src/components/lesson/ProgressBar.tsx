'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
    progress: number; // 0-100
    className?: string;
}

/**
 * Animated progress bar for lesson completion tracking.
 * Shows smooth transitions as user completes challenges.
 */
export function ProgressBar({ progress, className }: ProgressBarProps) {
    return (
        <div className={cn('w-full h-4 bg-duo-border rounded-full overflow-hidden', className)}>
            <div
                className="h-full bg-duo-green rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
}
