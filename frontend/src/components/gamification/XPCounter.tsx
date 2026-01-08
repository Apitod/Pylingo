'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface XPCounterProps {
    xp: number;
    className?: string;
}

/**
 * XP counter with pop animation when XP increases.
 */
export function XPCounter({ xp, className }: XPCounterProps) {
    const [prevXP, setPrevXP] = useState(xp);
    const [isAnimating, setIsAnimating] = useState(false);
    const [xpGain, setXpGain] = useState(0);

    useEffect(() => {
        if (xp > prevXP) {
            setXpGain(xp - prevXP);
            setIsAnimating(true);

            const timer = setTimeout(() => {
                setIsAnimating(false);
                setPrevXP(xp);
            }, 1000);

            return () => clearTimeout(timer);
        }
        setPrevXP(xp);
    }, [xp, prevXP]);

    return (
        <div className={cn('relative flex items-center gap-1', className)}>
            <span className="text-duo-yellow font-bold text-lg">{xp}</span>
            <span className="text-duo-yellow text-sm">XP</span>

            {/* XP gain popup */}
            {isAnimating && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-xp-pop">
                    <span className="text-duo-green font-bold text-sm">+{xpGain}</span>
                </div>
            )}
        </div>
    );
}
