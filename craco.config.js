module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimize chunk sizes
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the package name
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              
              // Create separate chunks for larger packages
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          common: {
            test: /[\\/]src[\\/]components[\\/]/,
            name: 'components',
            minChunks: 2,
          },
        },
      };

      // Use more granular chunks for async imports
      webpackConfig.output.chunkFilename = '[name].[contenthash:8].chunk.js';

      return webpackConfig;
    },
  },
}; 