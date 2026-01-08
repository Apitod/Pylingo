'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JourneyMap } from '@/components/journey/JourneyMap';
import { Loader2 } from 'lucide-react';
import { courseAPI } from '@/lib/api';
import type { Unit } from '@/types';

export default function LearnPage() {
    const router = useRouter();
    const [units, setUnits] = useState<Unit[]>([]);
    const [courseTitle, setCourseTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                // Load courses - no authentication required for MVP
                const courses = await courseAPI.getCourses();
                if (courses.length > 0) {
                    setCourseTitle(courses[0].title);
                    setUnits(courses[0].units || []);
                }
            } catch (err) {
                console.error('Failed to load courses:', err);
                setError(err instanceof Error ? err.message : 'Failed to load courses');
            } finally {
                setIsLoading(false);
            }
        };

        loadCourses();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-duo-green animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-duo-red mb-4">Error</h2>
                <p className="text-duo-text">{error}</p>
            </div>
        );
    }

    if (units.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-white mb-4">No Courses Available</h2>
                <p className="text-duo-text">Check back soon for new content!</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
                {courseTitle || 'Python Fundamentals'}
            </h1>
            <JourneyMap units={units} />
        </div>
    );
}
