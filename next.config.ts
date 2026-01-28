import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for hosting anywhere
  output: "export",

  // Disable image optimization for static export (Next.js Image requires server)
  images: {
    unoptimized: true,
  },

  // Trailing slashes for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
