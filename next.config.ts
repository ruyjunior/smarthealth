import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '7ggbyzj75ltavdzk.public.blob.vercel-storage.com',
      },
      // o avatar público do GitHub: a URL legível redireciona para o host abaixo
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
