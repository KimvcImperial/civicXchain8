import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      // Proxy specific backend routes only, keep blockchain routes local
      {
        source: '/api/commitments',
        destination: 'http://localhost:8000/api/commitments',
      },
      {
        source: '/api/commitments/expired-eligible',
        destination: 'http://localhost:8000/api/commitments/expired-eligible',
      },
    ];
  },
};

export default nextConfig;


