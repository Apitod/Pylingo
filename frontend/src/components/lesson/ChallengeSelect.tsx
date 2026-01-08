'use client';

import { useState } from 'react';
import { QuizCard } from './QuizCard';
import type { Challenge, SelectOption, ChallengeStatus } from '@/types';

interface ChallengeSelectProps {
    challenge: Challenge;
    selectedAnswer: string | null;
    correctAnswer: string | null;
    isChecking: boolean;
    onSelect: (answer: string) => void;
}

/**
 * Multiple choice challenge component.
 * Displays options as QuizCards with appropriate status styling.
 */
export function ChallengeSelect({
    challenge,
    selectedAnswer,
    correctAnswer,
    isChecking,
    onSelect,
}: ChallengeSelectProps) {
    const options = challenge.options as SelectOption[];

    const getOptionStatus = (optionText: string): ChallengeStatus => {
        // If we have a correctAnswer, the answer has been checked
        if (correctAnswer !== null) {
            if (optionText.toLowerCase() === correctAnswer.toLowerCase()) {
                return 'correct';
            }
            if (optionText === selectedAnswer && optionText.toLowerCase() !== correctAnswer.toLowerCase()) {
                return 'wrong';
            }
            return 'none';
        }

        // Before checking - just show selection
        if (optionText === selectedAnswer) {
            return 'selected';
        }

        return 'none';
    };

    return (
        <div className="space-y-6">
            {/* Question */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {challenge.question}
                </h2>
                <p className="text-duo-text">Select the correct answer</p>
            </div>

            {/* Options grid */}
            <div className="grid gap-3">
                {options.map((option) => (
                    <QuizCard
                        key={option.id}
                        text={option.text}
                        imageSrc={option.imageSrc}
                        status={getOptionStatus(option.text)}
                        disabled={isChecking}
                        onClick={() => onSelect(option.text)}
                    />
                ))}
            </div>
        </div>
    );
}
