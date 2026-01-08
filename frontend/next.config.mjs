/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Configure image domains if needed
    images: {
        domains: ['localhost'],
    },

    // API proxy to backend during development
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://localhost:8000/api/v1/:path*',
            },
        ];
    },
};

export default nextConfig;
