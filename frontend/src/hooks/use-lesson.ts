'use client';

import { useState, useCallback } from 'react';
import { challengeAPI, type ChallengeResult } from '@/lib/api';
import { completeChallenge, completeLesson, deductHeart, getProgress } from '@/lib/progress';
import type { Challenge, LessonPhase, LessonState } from '@/types';

/**
 * Lesson State Machine Hook
 * 
 * Manages the quiz flow through discrete states:
 * LOADING → ANSWERING → CHECKING → CORRECT/WRONG → ANSWERING/COMPLETED/GAME_OVER
 * 
 * For MVP: Uses local storage to track progress without authentication.
 */
export function useLessonMachine(
    initialChallenges: Challenge[],
    initialHearts: number,
    lessonId: string
) {
    // Get initial progress from localStorage
    const savedProgress = getProgress();

    const [state, setState] = useState<LessonState>({
        phase: 'ANSWERING',
        challenges: initialChallenges,
        currentIndex: 0,
        selectedAnswer: null,
        correctAnswer: null,
        hearts: savedProgress.hearts > 0 ? savedProgress.hearts : initialHearts,
        xpEarned: 0,
        streak: savedProgress.currentStreak,
        streakUpdated: false,
    });

    // Current challenge being displayed
    const currentChallenge = state.challenges[state.currentIndex];

    // Progress percentage for the progress bar
    const progress = ((state.currentIndex) / state.challenges.length) * 100;

    /**
     * Select an answer option
     * Only allowed in ANSWERING phase
     */
    const selectAnswer = useCallback((answer: string) => {
        if (state.phase !== 'ANSWERING') return;
        setState(prev => ({ ...prev, selectedAnswer: answer }));
    }, [state.phase]);

    /**
     * Submit the selected answer to the backend
     * Transitions: ANSWERING → CHECKING → CORRECT/WRONG
     */
    const checkAnswer = useCallback(async () => {
        if (!state.selectedAnswer || state.phase !== 'ANSWERING') return;

        // Transition to CHECKING (shows loading state)
        setState(prev => ({ ...prev, phase: 'CHECKING' }));

        try {
            const result: ChallengeResult = await challengeAPI.submitAnswer({
                challenge_id: currentChallenge.id,
                answer: state.selectedAnswer,
            });

            if (result.is_correct) {
                // Save progress to localStorage
                const updatedProgress = completeChallenge(currentChallenge.id, result.xp_earned);

                // Correct answer - show success feedback
                setState(prev => ({
                    ...prev,
                    phase: 'CORRECT',
                    correctAnswer: result.correct_answer,
                    xpEarned: prev.xpEarned + result.xp_earned,
                    streak: updatedProgress.currentStreak,
                    streakUpdated: true,
                }));
            } else {
                // Deduct heart locally
                const updatedProgress = deductHeart();

                // Wrong answer - show error feedback
                setState(prev => ({
                    ...prev,
                    phase: 'WRONG',
                    correctAnswer: result.correct_answer,
                    hearts: updatedProgress.hearts,
                }));
            }

            return result;
        } catch (error) {
            console.error('Failed to submit answer:', error);
            // Return to answering phase on error
            setState(prev => ({ ...prev, phase: 'ANSWERING' }));
            throw error;
        }
    }, [state.selectedAnswer, state.phase, currentChallenge]);

    /**
     * Move to the next challenge
     * Called after showing correct/wrong feedback
     */
    const nextChallenge = useCallback(() => {
        // Check for game over (no hearts remaining)
        if (state.hearts <= 0) {
            setState(prev => ({ ...prev, phase: 'GAME_OVER' }));
            return;
        }

        // Check if lesson is complete
        if (state.currentIndex >= state.challenges.length - 1) {
            // Mark lesson as completed in localStorage
            completeLesson(lessonId);
            setState(prev => ({ ...prev, phase: 'COMPLETED' }));
            return;
        }

        // Move to next challenge
        setState(prev => ({
            ...prev,
            phase: 'ANSWERING',
            currentIndex: prev.currentIndex + 1,
            selectedAnswer: null,
            correctAnswer: null,
            streakUpdated: false,
        }));
    }, [state.hearts, state.currentIndex, state.challenges.length, lessonId]);

    /**
     * Reset the lesson (for retry)
     */
    const resetLesson = useCallback(() => {
        const savedProgress = getProgress();
        setState({
            phase: 'ANSWERING',
            challenges: initialChallenges,
            currentIndex: 0,
            selectedAnswer: null,
            correctAnswer: null,
            hearts: 5, // Reset hearts for retry
            xpEarned: 0,
            streak: savedProgress.currentStreak,
            streakUpdated: false,
        });
    }, [initialChallenges]);

    return {
        // State
        state,
        currentChallenge,
        progress,

        // Derived state
        isAnswerSelected: state.selectedAnswer !== null,
        isChecking: state.phase === 'CHECKING',
        isComplete: state.phase === 'COMPLETED',
        isGameOver: state.phase === 'GAME_OVER',

        // Actions
        actions: {
            selectAnswer,
            checkAnswer,
            nextChallenge,
            resetLesson,
        },
    };
}
