/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevent findDOMNode error
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Images config
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
  // Disable font optimization for Docker build
  optimizeFonts: false,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Standalone output (useful for Docker)
  output: "standalone",
  experimental: {
    // Disable server components external packages
    serverComponentsExternalPackages: [],
  },
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;
