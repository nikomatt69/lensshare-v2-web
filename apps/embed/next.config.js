/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  transpilePackages: [
    '@lensshare/lens',
    '@lensshare/lib',
    '@lensshare/data',
    '@lensshare/config',
    '@lensshare/ui'
  ],

  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }]
      }
    ]
  }
}

module.exports = nextConfig
