import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: [
      '7ggbyzj75ltavdzk.public.blob.vercel-storage.com',
      // outros domínios externos, se necessário
    ],
  }
};

export default nextConfig;
