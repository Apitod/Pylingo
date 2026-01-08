import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-nunito',
});

export const metadata: Metadata = {
    title: 'PyLingo - Learn Python the Fun Way',
    description: 'A gamified learning platform for Python and Computational Thinking. Master programming through interactive lessons and challenges.',
    keywords: ['Python', 'programming', 'learning', 'education', 'coding'],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${nunito.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
