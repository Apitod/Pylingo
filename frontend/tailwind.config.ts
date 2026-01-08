import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Duolingo-inspired color palette
            colors: {
                // Primary greens
                'duo-green': {
                    DEFAULT: '#58CC02',
                    hover: '#4CAD00',
                    light: '#89E219',
                    dark: '#3C8800',
                },
                // Secondary colors
                'duo-blue': {
                    DEFAULT: '#1CB0F6',
                    hover: '#0899D6',
                    light: '#78D4FF',
                },
                'duo-purple': {
                    DEFAULT: '#CE82FF',
                    hover: '#B966E6',
                    light: '#E5B8FF',
                },
                'duo-yellow': {
                    DEFAULT: '#FFC800',
                    hover: '#E6B400',
                    light: '#FFD84D',
                },
                'duo-red': {
                    DEFAULT: '#FF4B4B',
                    hover: '#E63E3E',
                    light: '#FF7878',
                },
                'duo-teal': {
                    DEFAULT: '#00CD9C',
                    hover: '#00B087',
                    light: '#4DE8C0',
                },
                // UI colors
                'duo-bg': '#131F24',
                'duo-card': '#1A2C32',
                'duo-border': '#37464F',
                'duo-text': '#AFAFAF',
            },
            // Custom animations
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                },
                'heart-break': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.2)', opacity: '0.8' },
                    '100%': { transform: 'scale(0)', opacity: '0' },
                },
                'xp-pop': {
                    '0%': { transform: 'scale(0) translateY(20px)', opacity: '0' },
                    '50%': { transform: 'scale(1.2) translateY(-10px)' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
                'correct-pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)' },
                },
                'bounce-in': {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '60%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                shake: 'shake 0.5s ease-in-out',
                'heart-break': 'heart-break 0.6s ease-out forwards',
                'xp-pop': 'xp-pop 0.4s ease-out',
                'correct-pulse': 'correct-pulse 0.5s ease-in-out',
                'bounce-in': 'bounce-in 0.4s ease-out',
                'slide-up': 'slide-up 0.3s ease-out',
            },
            // Typography
            fontFamily: {
                sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
