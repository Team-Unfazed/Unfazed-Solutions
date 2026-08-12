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
};

export default nextConfig;
