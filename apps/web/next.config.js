const { withExpo } = require('@expo/next-adapter');

const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE_BUNDLE === '1'
});

const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }];

const allowedBots =
  '.*twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|facebookbot|googlebot|bot.*';

/** @type {import('next').NextConfig} */

const nextConfig = withPlugins([withBundleAnalyzer, withExpo], {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  transpilePackages: [
    'data',
    'react-native-reanimated',
    'react-native',
    'expo'
  ],

  experimental: {
    scrollRestoration: true,
    forceSwcTransforms: true
  },
  async rewrites() {
    return [
      {
        source: '/sitemaps/:match*',
        destination: 'https://lenshareapp.xyz/api/sitemap/:match*'
      },
      {
        destination: `https://og.lenshareapp.xyz/u/:match*`,
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/u/:match*'
      },
      {
        destination: `https://og.lenshareapp.xyz/posts/:match*`,
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/posts/:match*'
      },
      {
        destination: `https://og.lenshareapp.xyz/meet/:match*`,
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
        source: '/meet/:match*'
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.com/invite/B8eKhSSUwX',
        permanent: true
      },
      {
        source: '/donate',
        destination: 'https://giveth.io/project/hey?utm_source=hey',
        permanent: true
      },
      {
        source: '/gitcoin',
        destination:
          'https://explorer.gitcoin.co/#/round/10/0x8de918f0163b2021839a8d84954dd7e8e151326d/0x8de918f0163b2021839a8d84954dd7e8e151326d-2',
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin' }
        ],
        source: '/(.*)'
      },

      { source: '/about', headers },
      { source: '/privacy', headers },
      { source: '/thanks', headers }
    ];
  }
});

module.exports = nextConfig;
