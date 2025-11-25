
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // OVERWRITE resolve.fallback completely, don't spread.
      // This is a diagnostic step to ensure no default fallbacks are interfering.
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        path: require.resolve('path-browserify'),
        url: require.resolve('url/'),
        os: require.resolve('os-browserify'), 
        https: require.resolve('https-browserify'), 
        http: require.resolve('stream-http'),
        process: require.resolve('process/browser.js'), 
        vm: require.resolve('vm-browserify'), 
      };
      
      // Still merge plugins, as overwriting all plugins can break CRA.
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js', 
        }),
      ];
      
      return webpackConfig;
    },
  },
};
