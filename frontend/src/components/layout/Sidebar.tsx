'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Trophy, User, Flame, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { removeToken } from '@/lib/api';

const navItems = [
    { href: '/learn', icon: BookOpen, label: 'Learn' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/profile', icon: User, label: 'Profile' },
];

/**
 * Main navigation sidebar for authenticated users.
 */
export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-16 lg:w-64 bg-duo-card border-r border-duo-border flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-duo-border">
                <Link href="/learn" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-duo-green rounded-xl flex items-center justify-center text-2xl">
                        🐍
                    </div>
                    <span className="hidden lg:block text-xl font-bold text-white">PyLingo</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2">
                <ul className="space-y-1">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                                        'hover:bg-duo-border/50',
                                        isActive && 'bg-duo-blue/20 text-duo-blue border-2 border-duo-blue'
                                    )}
                                >
                                    <Icon className={cn(
                                        'w-6 h-6',
                                        isActive ? 'text-duo-blue' : 'text-duo-text'
                                    )} />
                                    <span className={cn(
                                        'hidden lg:block font-bold',
                                        isActive ? 'text-duo-blue' : 'text-duo-text'
                                    )}>
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section - Pro upgrade & Logout */}
            <div className="p-4 border-t border-duo-border space-y-2">
                <Link
                    href="/pro"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-duo-purple to-duo-blue text-white font-bold hover:opacity-90 transition-opacity"
                >
                    <Shield className="w-5 h-5" />
                    <span className="hidden lg:block">Upgrade to Pro</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-duo-red font-bold hover:bg-duo-red/10 transition-colors"
                >
                    <div className="w-5 h-5 flex items-center justify-center font-mono font-bold text-lg">→</div>
                    <span className="hidden lg:block">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
