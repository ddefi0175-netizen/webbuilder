/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@webbuilder/ai-core', '@webbuilder/shared-types'],
    images: {
        domains: ['localhost', 'images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '*.vercel.app',
            },
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
            },
        ],
    },
};

module.exports = nextConfig;
