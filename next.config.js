/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
