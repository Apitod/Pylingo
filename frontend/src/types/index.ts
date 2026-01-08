export interface Challenge {
    id: string;
    type: 'SELECT' | 'ASSIST' | 'MATCH' | 'FILL_BLANK';
    question: string;
    options: SelectOption[] | MatchOption[] | FillBlankOption;
    order_index: number;
}

export interface SelectOption {
    id: number;
    text: string;
    imageSrc: string | null;
}

export interface MatchOption {
    left: string;
    right: string;
}

export interface FillBlankOption {
    sentence: string;
    blank_index: number;
    hints?: string[];
}

export type ChallengeStatus = 'none' | 'selected' | 'correct' | 'wrong';

export type LessonPhase =
    | 'LOADING'
    | 'ANSWERING'
    | 'CHECKING'
    | 'CORRECT'
    | 'WRONG'
    | 'COMPLETED'
    | 'GAME_OVER';

export interface LessonState {
    phase: LessonPhase;
    challenges: Challenge[];
    currentIndex: number;
    selectedAnswer: string | null;
    correctAnswer: string | null;
    hearts: number;
    xpEarned: number;
    streak: number;
    streakUpdated: boolean;
}

export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    hearts: number;
}

export interface Course {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    order_index: number;
    is_active: boolean;
    units: Unit[];
}

export interface Unit {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    color: string;
    lessons: Lesson[];
}

export interface Lesson {
    id: string;
    title: string;
    order_index: number;
    xp_reward: number;
    progress_percentage: number;
}
