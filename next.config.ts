import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "sumateracupprix.com",
      },
      {
        protocol: "https",
        hostname: "d34vm3j4h7f97z.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "cdn.medcom.id",
      },
      {
        protocol: "https",
        hostname: "cdn.medcom.id",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube thumbnails
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // YouTube thumbnails (fallback)
      },
      {
        protocol: "https",
        hostname: "asset.kompas.com", // YouTube thumbnails (fallback)
      },
      {
        protocol: "https",
        hostname: "cdn.grid.id", // YouTube thumbnails (fallback)
      },
    ],
  },
};

export default nextConfig;
