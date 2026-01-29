import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker deployment
  output: "standalone",

  // Image optimization is allowed in standalone mode
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

};

export default nextConfig;
