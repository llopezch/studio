import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.interbank.pe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.scotiabank.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bn.com.pe',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

    
