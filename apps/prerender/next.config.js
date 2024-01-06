/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  trailingSlash: false,
  transpilePackages: ['data'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Max-Age', value: '1728000' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      },
    ];
  }
};

module.exports = nextConfig;
