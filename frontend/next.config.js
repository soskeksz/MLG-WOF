/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize development cache
  onDemandEntries: {
    // Reduce how long pages stay in memory (default is 25 seconds)
    maxInactiveAge: 15 * 1000,
    // Limit number of pages kept in memory (default is 5)
    pagesBufferLength: 2,
  },
  // Add any image optimization settings if needed
  images: {
    domains: [],
  },
  // Increase memory limit for webpack
  webpack: (config, { isServer, dev }) => {
    // Performance improvements for webpack
    if (!isServer && dev) {
      config.optimization.nodeEnv = 'development';
      config.optimization.minimize = false;
      
      // Increase RAM limit for webpack
      config.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      };
    }
    
    return config;
  },
}

module.exports = nextConfig