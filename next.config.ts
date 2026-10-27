import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [480, 960, 1440, 1920],
    imageSizes: [],
  },
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
