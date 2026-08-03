import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. This shrinks the build size (Faster Load)
  productionBrowserSourceMaps: false,

  async headers() {
    const isProduction = process.env.NODE_ENV === "production";
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    ];

    if (isProduction) {
      headers.unshift({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://loader.nutshell.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://cdn.sanity.io",
          "connect-src 'self' https://app.nutshell.com https://api.nutshell.com https://*.nutshell.com https://cdn.sanity.io",
          "frame-src https://app.nutshell.com https://*.nutshell.com",
          "font-src 'self' data:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self' https://*.nutshell.com",
        ].join("; "),
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;