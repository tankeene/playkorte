/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
    return [{ source: '/api/nearby', destination: `${api}/facilities/nearby` }];
  },
};
module.exports = nextConfig;
