/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@webbuilder/ai-core', '@webbuilder/shared-types'],
    images: {
        domains: ['localhost', 'images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
