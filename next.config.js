const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'www.notion.so', pathname: '/image/**', protocol: 'https' },
      {
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**',
        protocol: 'https',
      },
      { hostname: 'notion.so', pathname: '/**', protocol: 'https' },
      {
        hostname: 'hits.seeyoufarm.com',
        pathname: '/api/count/**',
        protocol: 'https',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = withBundleAnalyzer(nextConfig);
