'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LessonPage } from '@/components/lesson/LessonPage';
import { Loader2 } from 'lucide-react';
import { lessonAPI } from '@/lib/api';
import type { Challenge } from '@/types';

export default function LessonPageRoute() {
    const params = useParams();
    const router = useRouter();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [lessonTitle, setLessonTitle] = useState('');
    const [xpReward, setXpReward] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const lessonId = params.lessonId as string;

    useEffect(() => {
        const loadLesson = async () => {
            try {
                // Load the lesson - no authentication required for MVP
                const lesson = await lessonAPI.getLesson(lessonId);
                setChallenges(lesson.challenges as Challenge[]);
                setLessonTitle(lesson.title);
                setXpReward(lesson.xp_reward);
            } catch (err) {
                console.error('Failed to load lesson:', err);
                setError(err instanceof Error ? err.message : 'Failed to load lesson');
            } finally {
                setIsLoading(false);
            }
        };

        loadLesson();
    }, [lessonId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-duo-bg flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-duo-green animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-duo-bg flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-duo-red mb-4">Error Loading Lesson</h1>
                    <p className="text-duo-text mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/learn')}
                        className="btn-primary"
                    >
                        Return to Learn
                    </button>
                </div>
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="min-h-screen bg-duo-bg flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">No Challenges Found</h1>
                    <p className="text-duo-text mb-6">This lesson doesn't have any challenges yet.</p>
                    <button
                        onClick={() => router.push('/learn')}
                        className="btn-primary"
                    >
                        Return to Learn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <LessonPage
            lessonId={lessonId}
            lessonTitle={lessonTitle}
            challenges={challenges}
            initialHearts={5}  // Default 5 hearts for MVP demo
            xpReward={xpReward}
        />
    );
}
