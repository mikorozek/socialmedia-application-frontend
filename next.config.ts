import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "standalone" } : {}),
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        has: [
          {
            type: "header",
            key: "next-auth.session-token",
          },
        ],
        destination: `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
