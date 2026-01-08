'use client';

import Link from 'next/link';
import { Flame, Zap, Heart } from 'lucide-react';

interface UserHeaderProps {
    username: string;
    streak: number;
    xp: number;
    hearts: number;
}

/**
 * Header bar showing user stats.
 */
export function UserHeader({ username, streak, xp, hearts }: UserHeaderProps) {
    return (
        <header className="bg-duo-card border-b border-duo-border px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Left side - greeting */}
                <div>
                    <span className="text-duo-text text-sm">Welcome back,</span>
                    <h1 className="text-white font-bold text-lg">{username}</h1>
                </div>

                {/* Right side - stats */}
                <div className="flex items-center gap-4">
                    {/* Streak */}
                    <Link href="/profile" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                        <span className="text-orange-500 font-bold">{streak}</span>
                    </Link>

                    {/* XP */}
                    <div className="flex items-center gap-1">
                        <Zap className="w-6 h-6 text-duo-yellow fill-duo-yellow" />
                        <span className="text-duo-yellow font-bold">{xp}</span>
                    </div>

                    {/* Hearts */}
                    <Link href="/shop" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                        <Heart className="w-6 h-6 text-duo-red fill-duo-red" />
                        <span className="text-duo-red font-bold">{hearts}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
