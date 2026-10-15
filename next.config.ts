import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  serverExternalPackages: ["firebase-admin", "firebase-functions"],
  env: {
    NILASYA_SESSION_SECRET: process.env.NILASYA_SESSION_SECRET || "",
    NILASYA_ADMIN_PASSWORD: process.env.NILASYA_ADMIN_PASSWORD || "",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "ajansonline",
  },
  images: { formats: ["image/webp", "image/avif"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
};

export default nextConfig;
