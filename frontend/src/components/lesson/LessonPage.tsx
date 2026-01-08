'use client';

import { useRouter } from 'next/navigation';
import { X, ArrowRight, Loader2 } from 'lucide-react';

import { useLessonMachine } from '@/hooks/use-lesson';
import { ProgressBar } from './ProgressBar';
import { ChallengeSelect } from './ChallengeSelect';
import { ChallengeAssist } from './ChallengeAssist';
import { Hearts } from '../gamification/Hearts';
import { XPCounter } from '../gamification/XPCounter';
import { StreakDisplay } from '../gamification/StreakDisplay';
import { cn } from '@/lib/utils';
import type { Challenge } from '@/types';

interface LessonPageProps {
    lessonId: string;
    lessonTitle: string;
    challenges: Challenge[];
    initialHearts: number;
    xpReward: number;
}

/**
 * Main lesson page component orchestrating the quiz flow.
 * Uses the useLessonMachine hook for state management.
 */
export function LessonPage({
    lessonId,
    lessonTitle,
    challenges,
    initialHearts,
    xpReward,
}: LessonPageProps) {
    const router = useRouter();
    const { state, currentChallenge, progress, isAnswerSelected, isChecking, actions } =
        useLessonMachine(challenges, initialHearts, lessonId);

    // Render challenge based on type
    const renderChallenge = () => {
        if (!currentChallenge) return null;

        const commonProps = {
            challenge: currentChallenge,
            selectedAnswer: state.selectedAnswer,
            correctAnswer: state.correctAnswer,
            isChecking: isChecking,
            onSelect: actions.selectAnswer,
        };

        switch (currentChallenge.type) {
            case 'SELECT':
                return <ChallengeSelect {...commonProps} />;
            case 'FILL_BLANK':
            case 'ASSIST':
                return <ChallengeAssist {...commonProps} />;
            default:
                return <ChallengeSelect {...commonProps} />;
        }
    };

    // Handle exit lesson
    const handleExit = () => {
        router.push('/learn');
    };

    // Render completion screen
    if (state.phase === 'COMPLETED') {
        return (
            <div className="min-h-screen bg-duo-bg flex items-center justify-center p-6">
                <div className="text-center space-y-6 animate-bounce-in">
                    <div className="text-8xl mb-4">🎉</div>
                    <h1 className="text-4xl font-bold text-white">Lesson Complete!</h1>
                    <p className="text-duo-text text-xl">You earned {state.xpEarned} XP</p>

                    <div className="flex items-center justify-center gap-6">
                        <XPCounter xp={state.xpEarned} className="text-2xl" />
                        <StreakDisplay streak={state.streak} streakUpdated={state.streakUpdated} />
                    </div>

                    <button
                        onClick={handleExit}
                        className="btn-primary text-xl px-8 py-4"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    // Render game over screen
    if (state.phase === 'GAME_OVER') {
        return (
            <div className="min-h-screen bg-duo-bg flex items-center justify-center p-6">
                <div className="text-center space-y-6 animate-shake">
                    <div className="text-8xl mb-4">💔</div>
                    <h1 className="text-4xl font-bold text-duo-red">Out of Hearts!</h1>
                    <p className="text-duo-text text-xl">Take a break and try again later</p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => actions.resetLesson()}
                            className="btn-secondary"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleExit}
                            className="btn-primary"
                        >
                            Return to Learn
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-duo-bg flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-duo-bg/95 backdrop-blur-sm border-b border-duo-border">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Close button */}
                        <button
                            onClick={handleExit}
                            className="p-2 rounded-lg hover:bg-duo-card transition-colors"
                        >
                            <X className="w-6 h-6 text-duo-text" />
                        </button>

                        {/* Progress bar */}
                        <div className="flex-1">
                            <ProgressBar progress={progress} />
                        </div>

                        {/* Hearts */}
                        <Hearts count={state.hearts} />
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
                <div className="space-y-8">
                    {/* Lesson title */}
                    <div className="text-center">
                        <span className="text-duo-text text-sm uppercase tracking-wide">
                            {lessonTitle}
                        </span>
                        <span className="text-duo-text text-sm ml-2">
                            ({state.currentIndex + 1}/{challenges.length})
                        </span>
                    </div>

                    {/* Challenge content */}
                    {renderChallenge()}
                </div>
            </main>

            {/* Footer with action buttons */}
            <footer className="sticky bottom-0 bg-duo-bg border-t border-duo-border p-4">
                <div className="container mx-auto max-w-2xl">
                    {/* Show different buttons based on phase */}
                    {(state.phase === 'CORRECT' || state.phase === 'WRONG') ? (
                        // After answer checked - show continue button
                        <div className={cn(
                            'p-4 rounded-xl text-center',
                            state.phase === 'CORRECT' ? 'bg-duo-green/20' : 'bg-duo-red/20'
                        )}>
                            <p className={cn(
                                'text-lg font-bold mb-3',
                                state.phase === 'CORRECT' ? 'text-duo-green' : 'text-duo-red'
                            )}>
                                {state.phase === 'CORRECT' ? '✓ Correct!' : '✗ Not quite...'}
                            </p>
                            {state.phase === 'CORRECT' && state.xpEarned > 0 && (
                                <p className="text-duo-yellow text-sm mb-3">
                                    +{Math.floor(xpReward / challenges.length)} XP
                                </p>
                            )}
                            <button
                                onClick={actions.nextChallenge}
                                className={cn(
                                    'w-full py-3 px-6 rounded-xl font-bold text-white',
                                    'flex items-center justify-center gap-2',
                                    state.phase === 'CORRECT'
                                        ? 'bg-duo-green hover:bg-duo-green-hover'
                                        : 'bg-duo-red hover:bg-duo-red/80'
                                )}
                            >
                                Continue
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        // While answering - show check button
                        <button
                            onClick={actions.checkAnswer}
                            disabled={!isAnswerSelected || isChecking}
                            className={cn(
                                'w-full py-4 px-6 rounded-xl font-bold text-lg',
                                'flex items-center justify-center gap-2 transition-all',
                                isAnswerSelected && !isChecking
                                    ? 'bg-duo-green text-white hover:bg-duo-green-hover border-b-4 border-duo-green-dark active:border-b-0 active:mt-1'
                                    : 'bg-duo-border text-duo-text cursor-not-allowed'
                            )}
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Checking...
                                </>
                            ) : (
                                'Check'
                            )}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
