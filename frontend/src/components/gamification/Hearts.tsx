'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeartsProps {
    count: number;
    maxHearts?: number;
    onHeartLost?: () => void;
}

/**
 * Animated hearts display with break animation when hearts are lost.
 */
export function Hearts({ count, maxHearts = 5, onHeartLost }: HeartsProps) {
    const [prevCount, setPrevCount] = useState(count);
    const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (count < prevCount) {
            // Heart was lost - trigger break animation
            setAnimatingIndex(count);
            onHeartLost?.();

            const timer = setTimeout(() => {
                setAnimatingIndex(null);
                setPrevCount(count);
            }, 600);

            return () => clearTimeout(timer);
        }
        setPrevCount(count);
    }, [count, prevCount, onHeartLost]);

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxHearts }).map((_, i) => (
                <Heart
                    key={i}
                    className={cn(
                        'w-6 h-6 transition-all duration-200',
                        {
                            // Filled heart
                            'fill-duo-red text-duo-red': i < count,
                            // Empty heart
                            'fill-none text-gray-500': i >= count && i !== animatingIndex,
                            // Breaking animation
                            'fill-duo-red text-duo-red animate-heart-break': i === animatingIndex,
                        }
                    )}
                />
            ))}
            <span className="ml-2 text-duo-red font-bold">{count}</span>
        </div>
    );
}
