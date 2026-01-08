'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Flame, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProgress } from '@/lib/progress';

// Types for leaderboard
interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    avatar_url: string | null;
    weekly_xp: number;
    total_xp: number;
    current_streak: number;
    league: string;
}

interface LeaderboardData {
    top_users: LeaderboardEntry[];
    current_user: LeaderboardEntry | null;
    total_participants: number;
    week_start: string;
    week_end: string;
}

// Mock data for demo (since we don't have real users in MVP)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, user_id: '1', username: 'pythonmaster', avatar_url: null, weekly_xp: 2450, total_xp: 15200, current_streak: 42, league: 'Emerald' },
    { rank: 2, user_id: '2', username: 'codewarrior', avatar_url: null, weekly_xp: 2180, total_xp: 12800, current_streak: 28, league: 'Emerald' },
    { rank: 3, user_id: '3', username: 'devqueen', avatar_url: null, weekly_xp: 1920, total_xp: 11400, current_streak: 35, league: 'Emerald' },
    { rank: 4, user_id: '4', username: 'byteboss', avatar_url: null, weekly_xp: 1750, total_xp: 9800, current_streak: 21, league: 'Ruby' },
    { rank: 5, user_id: '5', username: 'algoninja', avatar_url: null, weekly_xp: 1680, total_xp: 8500, current_streak: 19, league: 'Ruby' },
    { rank: 6, user_id: '6', username: 'loophero', avatar_url: null, weekly_xp: 1520, total_xp: 7200, current_streak: 15, league: 'Ruby' },
    { rank: 7, user_id: '7', username: 'stackstar', avatar_url: null, weekly_xp: 1380, total_xp: 6100, current_streak: 12, league: 'Ruby' },
    { rank: 8, user_id: '8', username: 'funcfan', avatar_url: null, weekly_xp: 1250, total_xp: 5400, current_streak: 10, league: 'Ruby' },
    { rank: 9, user_id: '9', username: 'debugger', avatar_url: null, weekly_xp: 1100, total_xp: 4200, current_streak: 8, league: 'Sapphire' },
    { rank: 10, user_id: '10', username: 'syntaxpro', avatar_url: null, weekly_xp: 980, total_xp: 3600, current_streak: 6, league: 'Sapphire' },
];

// League colors
const LEAGUE_COLORS: Record<string, string> = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Sapphire: '#0F52BA',
    Ruby: '#E0115F',
    Emerald: '#50C878',
    Amethyst: '#9966CC',
    Pearl: '#EAE0C8',
    Obsidian: '#1C1C1C',
    Diamond: '#B9F2FF',
};

// Get rank badge
function getRankBadge(rank: number) {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-duo-text font-bold">{rank}</span>;
}

// Avatar component
function Avatar({ username, avatarUrl, size = 'md' }: { username: string; avatarUrl: string | null; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
    };

    // Generate color from username
    const colors = ['#58CC02', '#CE82FF', '#00CD9C', '#FF9600', '#1CB0F6', '#FF4B4B'];
    const colorIndex = username.charCodeAt(0) % colors.length;

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center font-bold text-white',
                sizeClasses[size]
            )}
            style={{ backgroundColor: colors[colorIndex] }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    );
}

// Leaderboard row component
function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
    return (
        <div
            className={cn(
                'flex items-center gap-4 p-4 rounded-xl transition-all',
                isCurrentUser
                    ? 'bg-duo-blue/20 border-2 border-duo-blue'
                    : 'bg-duo-card hover:bg-duo-card-hover'
            )}
        >
            {/* Rank */}
            <div className="w-10 flex items-center justify-center">
                {getRankBadge(entry.rank)}
            </div>

            {/* Avatar & Username */}
            <div className="flex items-center gap-3 flex-1">
                <Avatar username={entry.username} avatarUrl={entry.avatar_url} />
                <div>
                    <p className={cn(
                        'font-bold',
                        isCurrentUser ? 'text-duo-blue' : 'text-white'
                    )}>
                        {entry.username}
                        {isCurrentUser && <span className="ml-2 text-xs text-duo-text">(You)</span>}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-duo-text">
                        <Flame className="w-4 h-4 text-duo-orange" />
                        <span>{entry.current_streak} day streak</span>
                    </div>
                </div>
            </div>

            {/* League badge */}
            <div
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: LEAGUE_COLORS[entry.league] || '#666' }}
            >
                {entry.league}
            </div>

            {/* XP */}
            <div className="text-right">
                <p className="text-xl font-bold text-duo-yellow">{entry.weekly_xp.toLocaleString()}</p>
                <p className="text-xs text-duo-text">XP this week</p>
            </div>
        </div>
    );
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // For MVP, use mock data + local progress
        const loadLeaderboard = async () => {
            try {
                // Try to fetch from backend first
                const response = await fetch('/api/v1/leaderboard');
                if (response.ok) {
                    const data: LeaderboardData = await response.json();
                    setLeaderboard(data.top_users);
                    setCurrentUser(data.current_user);
                } else {
                    // Fall back to mock data
                    setLeaderboard(MOCK_LEADERBOARD);

                    // Add local user based on progress
                    const progress = getProgress();
                    if (progress.totalXp > 0) {
                        const league = progress.totalXp >= 10000 ? 'Emerald'
                            : progress.totalXp >= 5000 ? 'Ruby'
                                : progress.totalXp >= 2500 ? 'Sapphire'
                                    : progress.totalXp >= 1000 ? 'Gold'
                                        : progress.totalXp >= 500 ? 'Silver'
                                            : 'Bronze';

                        setCurrentUser({
                            rank: 25,
                            user_id: 'local',
                            username: 'You',
                            avatar_url: null,
                            weekly_xp: progress.totalXp,
                            total_xp: progress.totalXp,
                            current_streak: progress.currentStreak,
                            league,
                        });
                    }
                }
            } catch {
                // Use mock data on error
                setLeaderboard(MOCK_LEADERBOARD);
            } finally {
                setIsLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-duo-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-24">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-duo-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-yellow-900" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Weekly Leaderboard</h1>
                <p className="text-duo-text">Compete with learners from around the world!</p>
            </div>

            {/* Leaderboard list */}
            <div className="space-y-3">
                {leaderboard.map((entry) => (
                    <LeaderboardRow
                        key={entry.user_id}
                        entry={entry}
                        isCurrentUser={currentUser?.user_id === entry.user_id}
                    />
                ))}
            </div>

            {/* Sticky current user row (if outside top 10) */}
            {currentUser && currentUser.rank > 10 && (
                <div className="fixed bottom-0 left-0 right-0 bg-duo-bg/95 backdrop-blur-sm border-t border-duo-border p-4">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-duo-text text-sm text-center mb-2">Your Position</p>
                        <LeaderboardRow entry={currentUser} isCurrentUser={true} />
                    </div>
                </div>
            )}
        </div>
    );
}
