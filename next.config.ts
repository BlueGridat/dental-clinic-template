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
  webpack: (config, { isServer, webpack }) => {
    config.resolve.conditionNames = Array.from(new Set(["import", ...(config.resolve.conditionNames ?? [])]));
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
      config.resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        crypto: false
      };
    }
    return config;
  }
};

export default nextConfig;
