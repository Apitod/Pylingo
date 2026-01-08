'use client';

import { useEffect, useState } from 'react';
import { Flame, Zap, Shield, Trophy, Calendar, Target, BookOpen, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProgress } from '@/lib/progress';

// Types for profile
interface UserProfile {
    username: string;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    league: string;
    courses_completed: number;
    lessons_completed: number;
    challenges_completed: number;
    member_since: string;
}

// League info with colors
const LEAGUE_INFO: Record<string, { color: string; bgColor: string; icon: string }> = {
    Bronze: { color: '#CD7F32', bgColor: 'rgba(205, 127, 50, 0.2)', icon: '🥉' },
    Silver: { color: '#C0C0C0', bgColor: 'rgba(192, 192, 192, 0.2)', icon: '🥈' },
    Gold: { color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.2)', icon: '🥇' },
    Sapphire: { color: '#0F52BA', bgColor: 'rgba(15, 82, 186, 0.2)', icon: '💎' },
    Ruby: { color: '#E0115F', bgColor: 'rgba(224, 17, 95, 0.2)', icon: '❤️' },
    Emerald: { color: '#50C878', bgColor: 'rgba(80, 200, 120, 0.2)', icon: '💚' },
};

// Stat card component
function StatCard({
    icon: Icon,
    iconColor,
    bgColor,
    label,
    value,
    subtitle
}: {
    icon: typeof Flame;
    iconColor: string;
    bgColor: string;
    label: string;
    value: string | number;
    subtitle?: string;
}) {
    return (
        <div className="p-6 rounded-2xl" style={{ backgroundColor: bgColor }}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8" style={{ color: iconColor }} />
                <span className="text-duo-text text-sm font-medium">{label}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            {subtitle && <p className="text-sm text-duo-text">{subtitle}</p>}
        </div>
    );
}

// Avatar component
function ProfileAvatar({ username }: { username: string }) {
    const colors = ['#58CC02', '#CE82FF', '#00CD9C', '#FF9600', '#1CB0F6'];
    const colorIndex = username.charCodeAt(0) % colors.length;

    return (
        <div
            className="w-32 h-32 rounded-full flex items-center justify-center font-bold text-white text-5xl border-4 border-white/20"
            style={{ backgroundColor: colors[colorIndex] }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use local progress for MVP
        const progress = getProgress();
        const league = progress.totalXp >= 10000 ? 'Emerald'
            : progress.totalXp >= 5000 ? 'Ruby'
                : progress.totalXp >= 2500 ? 'Sapphire'
                    : progress.totalXp >= 1000 ? 'Gold'
                        : progress.totalXp >= 500 ? 'Silver'
                            : 'Bronze';

        setProfile({
            username: 'You',
            total_xp: progress.totalXp,
            current_streak: progress.currentStreak,
            longest_streak: progress.currentStreak,
            league,
            courses_completed: 0,
            lessons_completed: progress.completedLessons.length,
            challenges_completed: progress.completedChallenges.length,
            member_since: new Date().toISOString(),
        });
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-duo-green animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    const leagueInfo = LEAGUE_INFO[profile.league] || LEAGUE_INFO.Bronze;

    return (
        <div className="max-w-2xl mx-auto pb-8">
            {/* Profile Header */}
            <div className="text-center mb-8">
                <ProfileAvatar username={profile.username} />
                <h1 className="text-3xl font-bold text-white mt-4 mb-2">{profile.username}</h1>

                {/* League Badge */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold"
                    style={{ backgroundColor: leagueInfo.bgColor, color: leagueInfo.color }}
                >
                    <span>{leagueInfo.icon}</span>
                    <Shield className="w-5 h-5" />
                    <span>{profile.league} League</span>
                </div>

                <p className="text-duo-text text-sm mt-4 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard
                    icon={Flame}
                    iconColor="#FF9600"
                    bgColor="rgba(255, 150, 0, 0.15)"
                    label="Current Streak"
                    value={profile.current_streak}
                    subtitle="days"
                />
                <StatCard
                    icon={Zap}
                    iconColor="#FFC800"
                    bgColor="rgba(255, 200, 0, 0.15)"
                    label="Total XP"
                    value={profile.total_xp.toLocaleString()}
                    subtitle="Experience points"
                />
                <StatCard
                    icon={BookOpen}
                    iconColor="#1CB0F6"
                    bgColor="rgba(28, 176, 246, 0.15)"
                    label="Lessons"
                    value={profile.lessons_completed}
                    subtitle={`${profile.challenges_completed} challenges`}
                />
                <StatCard
                    icon={Trophy}
                    iconColor="#58CC02"
                    bgColor="rgba(88, 204, 2, 0.15)"
                    label="Courses"
                    value={profile.courses_completed}
                    subtitle="completed"
                />
            </div>

            {/* Achievements */}
            <div className="bg-duo-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-duo-yellow" />
                    Achievements
                </h3>
                <div className="flex gap-4 justify-center">
                    {[
                        { icon: '🔥', label: 'First Streak', unlocked: profile.current_streak > 0 },
                        { icon: '⭐', label: 'First Lesson', unlocked: profile.lessons_completed > 0 },
                        { icon: '💯', label: '100 XP', unlocked: profile.total_xp >= 100 },
                        { icon: '🏆', label: 'First Course', unlocked: profile.courses_completed > 0 },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className={cn(
                                'w-16 h-16 rounded-xl flex flex-col items-center justify-center',
                                badge.unlocked ? 'bg-duo-yellow/20' : 'bg-gray-700/50 opacity-50'
                            )}
                        >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-[10px] text-duo-text mt-1">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Goal */}
            <div className="mt-6 bg-duo-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-duo-green" />
                    Daily Goal
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-duo-text">0 / 50 XP today</span>
                        <span className="text-duo-green">0%</span>
                    </div>
                    <div className="h-3 bg-duo-border rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-duo-green to-duo-blue rounded-full" style={{ width: '0%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
