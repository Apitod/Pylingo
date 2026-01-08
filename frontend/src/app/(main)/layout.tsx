import { Sidebar } from '@/components/layout/Sidebar';
import { UserHeader } from '@/components/layout/UserHeader';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Fetch actual user data from API
    // For now, using placeholder data
    const user = {
        username: 'Learner',
        streak: 5,
        xp: 1250,
        hearts: 5,
    };

    return (
        <div className="min-h-screen bg-duo-bg">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="lg:ml-64 ml-16">
                <UserHeader
                    username={user.username}
                    streak={user.streak}
                    xp={user.xp}
                    hearts={user.hearts}
                />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
