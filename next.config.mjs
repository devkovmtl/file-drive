/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'flippant-clownfish-531.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
