/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
