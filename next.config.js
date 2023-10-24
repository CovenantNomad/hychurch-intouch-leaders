/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api',
        destination: `https://hychurch-dev.duckdns.org/graphql`,
      },
    ]
  },
}

module.exports = nextConfig
