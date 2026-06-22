import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Use a custom loader so the browser loads images directly from the CDN
    // instead of through Next's server-side optimizer (/_next/image), which
    // times out on slow/restrictive connections. See src/lib/image-loader.ts.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    // Kept for reference / if the optimizer is ever re-enabled. Not enforced
    // while a custom loader is active.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
};

export default nextConfig;
