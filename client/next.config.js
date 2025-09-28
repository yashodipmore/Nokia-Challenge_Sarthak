/** @type {import('next').NextConfig} */
const nextConfig = {
output: 'export',
eslint: {
ignoreDuringBuilds: true,
},
images: { unoptimized: true },
optimizeFonts: false,
// Suppress hydration warnings from browser extensions
experimental: {
suppressHydrationWarning: true,
},
};

module.exports = nextConfig;
