import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7ggbyzj75ltavdzk.public.blob.vercel-storage.com',
      },
      // outros domínios externos, se necessário
    ],
  },
};

export default nextConfig;