import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.conditionNames = Array.from(new Set(["import", ...(config.resolve.conditionNames ?? [])]));
    return config;
  }
};

export default nextConfig;
