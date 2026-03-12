import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optional: Add custom port configuration
  // This will be overridden by environment variables in Docker
};

export default nextConfig;
