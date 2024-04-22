/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  transpilePackages: ['data'],
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }];
  }
};

module.exports = nextConfig;
