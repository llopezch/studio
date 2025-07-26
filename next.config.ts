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
        hostname: 'placehold.co',
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
        hostname: 'www.viabcp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bbva.pe',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.scotiabank.com.pe',
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
