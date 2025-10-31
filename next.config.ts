import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.zid.store",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.zidship.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-backend.coffeesolutions.com.sa",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
