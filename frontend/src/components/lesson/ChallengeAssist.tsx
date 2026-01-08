'use client';

import { useState, useEffect } from 'react';
import type { Challenge, FillBlankOption } from '@/types';
import { cn } from '@/lib/utils';

interface ChallengeAssistProps {
    challenge: Challenge;
    selectedAnswer: string | null;
    correctAnswer: string | null;
    isChecking: boolean;
    onSelect: (answer: string) => void;
}

/**
 * Fill in the blank challenge component.
 * Shows a sentence with a blank that the user fills in.
 */
export function ChallengeAssist({
    challenge,
    selectedAnswer,
    correctAnswer,
    isChecking,
    onSelect,
}: ChallengeAssistProps) {
    const [inputValue, setInputValue] = useState(selectedAnswer || '');
    const options = challenge.options as FillBlankOption;

    const isCorrect = correctAnswer !== null &&
        inputValue.toLowerCase() === correctAnswer.toLowerCase();
    const isWrong = correctAnswer !== null &&
        inputValue.toLowerCase() !== correctAnswer.toLowerCase();

    useEffect(() => {
        // Update parent when input changes
        if (inputValue.trim()) {
            onSelect(inputValue);
        }
    }, [inputValue, onSelect]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (correctAnswer === null) { // Only allow changes before checking
            setInputValue(e.target.value);
        }
    };

    return (
        <div className="space-y-6">
            {/* Question */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {challenge.question}
                </h2>
                <p className="text-duo-text">Type your answer</p>
            </div>

            {/* Fill in the blank sentence */}
            <div className="bg-duo-card rounded-xl p-6 text-center">
                <div className="text-xl text-white font-mono flex items-center justify-center gap-2 flex-wrap">
                    {options.sentence.split('___').map((part, index, arr) => (
                        <span key={index}>
                            {part}
                            {index < arr.length - 1 && (
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    disabled={isChecking || correctAnswer !== null}
                                    placeholder="..."
                                    className={cn(
                                        'mx-2 px-4 py-2 w-32 text-center rounded-lg border-2 border-b-4',
                                        'bg-duo-bg font-bold outline-none transition-all',
                                        {
                                            'border-duo-border focus:border-duo-blue': !isCorrect && !isWrong,
                                            'border-duo-green bg-duo-green/20 text-duo-green': isCorrect,
                                            'border-duo-red bg-duo-red/20 text-duo-red animate-shake': isWrong,
                                        }
                                    )}
                                />
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hints */}
            {options.hints && options.hints.length > 0 && !correctAnswer && (
                <div className="text-center">
                    <p className="text-duo-text text-sm mb-2">Hints:</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {options.hints.map((hint, i) => (
                            <button
                                key={i}
                                onClick={() => setInputValue(hint)}
                                className="px-3 py-1 bg-duo-border rounded-lg text-duo-text text-sm hover:bg-duo-border/80 transition-colors"
                            >
                                {hint}...
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Show correct answer if wrong */}
            {isWrong && correctAnswer && (
                <div className="text-center text-duo-green font-bold animate-slide-up">
                    Correct answer: {correctAnswer}
                </div>
            )}
        </div>
    );
}
