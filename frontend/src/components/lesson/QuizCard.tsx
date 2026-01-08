'use client';

import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import type { ChallengeStatus } from '@/types';

interface QuizCardProps {
    text: string;
    imageSrc?: string | null;
    status: ChallengeStatus;
    disabled?: boolean;
    onClick?: () => void;
}

/**
 * Reusable quiz option card with Duolingo-style animations.
 * 
 * Status-based styling:
 * - none: Neutral state, hoverable
 * - selected: Blue highlight (user picked this)
 * - correct: Green with checkmark animation
 * - wrong: Red with shake animation
 */
export function QuizCard({
    text,
    imageSrc,
    status,
    disabled,
    onClick
}: QuizCardProps) {
    const isInteractive = status === 'none' && !disabled;
    const showCheck = status === 'correct';
    const showX = status === 'wrong';

    return (
        <button
            onClick={onClick}
            disabled={disabled || status === 'correct' || status === 'wrong'}
            className={cn(
                // Base styles
                'relative w-full p-4 rounded-xl border-2 border-b-4 transition-all duration-200',
                'flex items-center gap-4 text-left font-semibold',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-duo-blue',

                // Status-specific styles
                {
                    // None - Default interactive state
                    'border-duo-border bg-duo-card hover:bg-duo-card/80 active:border-b-2 active:mt-[2px] cursor-pointer':
                        isInteractive,

                    // Selected - User's current choice
                    'border-duo-blue bg-duo-blue/20 border-b-4':
                        status === 'selected',

                    // Correct - Green success state with pulse
                    'border-duo-green bg-duo-green/20 animate-correct-pulse':
                        status === 'correct',

                    // Wrong - Red error state with shake
                    'border-duo-red bg-duo-red/20 animate-shake':
                        status === 'wrong',

                    // Disabled state
                    'opacity-50 cursor-not-allowed':
                        disabled && status === 'none',
                }
            )}
        >
            {/* Optional image */}
            {imageSrc && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-duo-border">
                    <img
                        src={imageSrc}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Text content */}
            <span className={cn(
                'text-lg flex-1 transition-colors',
                {
                    'text-white': status === 'none' || status === 'selected',
                    'text-duo-green': status === 'correct',
                    'text-duo-red': status === 'wrong',
                }
            )}>
                {text}
            </span>

            {/* Status icons with animations */}
            {showCheck && (
                <div className="w-8 h-8 rounded-full bg-duo-green flex items-center justify-center animate-bounce-in">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
            )}
            {showX && (
                <div className="w-8 h-8 rounded-full bg-duo-red flex items-center justify-center animate-bounce-in">
                    <X className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
            )}
        </button>
    );
}
