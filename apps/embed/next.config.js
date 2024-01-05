/** @type {import('next').NextConfig} */
const nextConfig = {
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
