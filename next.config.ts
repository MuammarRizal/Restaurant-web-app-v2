import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["https://restaurant-web-app-v2.vercel.app"],
  },
};

export default nextConfig;
