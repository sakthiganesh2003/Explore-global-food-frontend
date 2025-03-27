import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost',
      'example.com',
      // Add other domains your images might come from
    ],
  },
};

export default nextConfig;
