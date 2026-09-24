/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All site photography is self-hosted in /public/images and optimised by sharp.
    // Add remotePatterns here once listing media is served from object storage / CDN.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
