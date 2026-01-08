'use client';

import { useEffect, useState } from 'react';
import { Star, Lock, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getProgress, type LocalProgress } from '@/lib/progress';
import type { Unit, Lesson } from '@/types';

interface JourneyMapProps {
    units: Unit[];
}

/**
 * Scrollable journey map showing course progression.
 * Displays units with their lessons as interactive nodes.
 * Uses local storage for progress tracking in MVP mode.
 */
export function JourneyMap({ units }: JourneyMapProps) {
    const [localProgress, setLocalProgress] = useState<LocalProgress | null>(null);

    // Load progress from localStorage on mount
    useEffect(() => {
        setLocalProgress(getProgress());
    }, []);

    // Get previous lessons for unlock checking
    const getPreviousLesson = (unitIndex: number, lessonIndex: number): string | undefined => {
        if (lessonIndex > 0) {
            return units[unitIndex].lessons[lessonIndex - 1].id;
        }
        // For first lesson in unit, check last lesson of previous unit
        if (unitIndex > 0) {
            const prevUnit = units[unitIndex - 1];
            return prevUnit.lessons[prevUnit.lessons.length - 1]?.id;
        }
        return undefined;
    };

    return (
        <div className="space-y-12 pb-20">
            {units.map((unit, unitIndex) => (
                <div key={unit.id} className="space-y-6">
                    {/* Unit header */}
                    <div
                        className="px-4 py-3 rounded-xl text-white font-bold text-lg"
                        style={{ backgroundColor: unit.color }}
                    >
                        <span className="uppercase text-sm opacity-80">Unit {unitIndex + 1}</span>
                        <h2 className="text-xl">{unit.title}</h2>
                        {unit.description && (
                            <p className="text-sm opacity-80 font-normal mt-1">{unit.description}</p>
                        )}
                    </div>

                    {/* Lessons path */}
                    <div className="flex flex-col items-center gap-6">
                        {unit.lessons.map((lesson, lessonIndex) => (
                            <LessonNode
                                key={lesson.id}
                                lesson={lesson}
                                color={unit.color}
                                isFirst={unitIndex === 0 && lessonIndex === 0}
                                previousLessonId={getPreviousLesson(unitIndex, lessonIndex)}
                                localProgress={localProgress}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

interface LessonNodeProps {
    lesson: Lesson;
    color: string;
    isFirst: boolean;
    previousLessonId?: string;
    localProgress: LocalProgress | null;
}

function LessonNode({ lesson, color, isFirst, previousLessonId, localProgress }: LessonNodeProps) {
    // Use local progress to determine lesson state
    const isCompleted = localProgress?.completedLessons.includes(lesson.id) ?? false;
    const previousCompleted = previousLessonId
        ? localProgress?.completedLessons.includes(previousLessonId) ?? false
        : true;
    const isLocked = !isFirst && !previousCompleted;
    const isAvailable = !isLocked && !isCompleted;
    // Check if any challenges are completed but lesson not finished
    const isInProgress = false; // Simplified for MVP

    return (
        <div className="flex flex-col items-center">
            {/* Connecting line (not for first lesson) */}
            {!isFirst && (
                <div className={cn(
                    'w-1 h-8 -mt-2 mb-2 rounded-full',
                    isCompleted || isAvailable ? 'bg-duo-green' : 'bg-gray-600'
                )} />
            )}

            {/* Lesson button */}
            <Link
                href={isLocked ? '#' : `/lesson/${lesson.id}`}
                className={cn(
                    'relative group',
                    isLocked && 'cursor-not-allowed'
                )}
                onClick={(e) => isLocked && e.preventDefault()}
            >
                <div
                    className={cn(
                        'w-20 h-20 rounded-full flex items-center justify-center',
                        'border-4 border-b-8 transition-all duration-200',
                        {
                            // Locked state
                            'bg-gray-600 border-gray-700': isLocked,
                            // Completed state
                            'bg-duo-yellow border-yellow-600': isCompleted,
                            // Available/In progress state
                            'hover:scale-110': isAvailable || isInProgress,
                        }
                    )}
                    style={
                        (isAvailable || isInProgress)
                            ? { backgroundColor: color, borderColor: `${color}99` }
                            : undefined
                    }
                >
                    {isLocked && <Lock className="w-8 h-8 text-gray-400" />}
                    {isCompleted && <Check className="w-8 h-8 text-yellow-900" strokeWidth={3} />}
                    {(isAvailable || isInProgress) && <Star className="w-8 h-8 text-white" />}
                </div>

                {/* Progress ring for in-progress lessons */}
                {isInProgress && (
                    <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeDasharray={`${(lesson.progress_percentage / 100) * 226} 226`}
                            strokeLinecap="round"
                        />
                    </svg>
                )}

                {/* Lesson title tooltip */}
                <div className={cn(
                    'absolute left-1/2 -translate-x-1/2 mt-2',
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    'bg-duo-card px-3 py-1 rounded-lg text-sm text-white whitespace-nowrap'
                )}>
                    {lesson.title}
                    <span className="text-duo-text ml-1">+{lesson.xp_reward} XP</span>
                    {isCompleted && <span className="text-duo-green ml-1">✓</span>}
                </div>
            </Link>
        </div>
    );
}
