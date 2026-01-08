import Link from 'next/link';
import { Zap, Target, Trophy, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-duo-bg">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-duo-green/20 via-transparent to-duo-purple/20" />

                <div className="container mx-auto px-6 py-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6">
                                <span className="text-white">Learn </span>
                                <span className="text-duo-green">Python</span>
                                <br />
                                <span className="text-white">the fun way</span>
                            </h1>

                            <p className="text-xl text-duo-text mb-8 max-w-lg">
                                Master Python and Computational Thinking through bite-sized lessons,
                                interactive challenges, and gamified learning.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/learn"
                                    className="btn-primary text-lg flex items-center justify-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn-secondary text-lg"
                                >
                                    I already have an account
                                </Link>
                            </div>
                        </div>

                        {/* Mascot/Illustration placeholder */}
                        <div className="flex-1 flex justify-center">
                            <div className="w-80 h-80 bg-gradient-to-br from-duo-green to-duo-teal rounded-full flex items-center justify-center shadow-2xl shadow-duo-green/30">
                                <span className="text-9xl">🐍</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-duo-card/50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">
                        Why PyLingo?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-duo-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-duo-green" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Bite-sized Lessons
                            </h3>
                            <p className="text-duo-text">
                                Learn in short, focused sessions. Just 5 minutes a day can build real skills.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-duo-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-duo-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Practice with Purpose
                            </h3>
                            <p className="text-duo-text">
                                Every challenge is designed to reinforce concepts and build muscle memory.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-duo-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-duo-yellow" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Stay Motivated
                            </h3>
                            <p className="text-duo-text">
                                Earn XP, maintain streaks, and compete with friends on leaderboards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to start coding?
                    </h2>
                    <p className="text-xl text-duo-text mb-8">
                        Join thousands of learners mastering Python today.
                    </p>
                    <Link
                        href="/learn"
                        className="btn-primary text-xl px-8 py-4 inline-flex items-center gap-2"
                    >
                        Start Learning - It&apos;s Free!
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
