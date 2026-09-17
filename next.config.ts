import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The dev overlay badge sits on top of the footer; nothing here needs it.
  devIndicators: false,
  images: {
    // Portraits and award photography are served from /public and only ever
    // rendered at a handful of widths, so keep the generated set small.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512],
    formats: ["image/avif", "image/webp"],
  },
  // three.js ships untranspiled ESM examples; let Next handle them.
  transpilePackages: ["three"],
  // The baseline set that cannot change how the page behaves. A
  // Content-Security-Policy is deliberately not here: the hero is WebGL and
  // Next inlines its own scripts, so a policy needs writing and testing
  // against the live site rather than guessing at.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
