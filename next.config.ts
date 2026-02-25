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
    ],
  },
};

export default nextConfig;
