'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { authAPI, setToken } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authAPI.login({ email, password });
            setToken(response.access_token);
            router.push('/learn');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-duo-bg flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-duo-green rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4">
                        🐍
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
                    <p className="text-duo-text mt-2">Log in to continue learning</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-duo-red/20 border border-duo-red text-duo-red px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-duo-text text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-duo-card border-2 border-duo-border rounded-xl text-white focus:border-duo-blue focus:outline-none transition-colors"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-duo-text text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-duo-card border-2 border-duo-border rounded-xl text-white focus:border-duo-blue focus:outline-none transition-colors pr-12"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-duo-text hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary text-lg flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-duo-text mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-duo-blue hover:underline font-bold">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}
