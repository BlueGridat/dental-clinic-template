import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  },
  webpack: (config) => {
    config.resolve.conditionNames = Array.from(new Set(["import", ...(config.resolve.conditionNames ?? [])]));
    return config;
  }
};

export default nextConfig;
