const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    path: require.resolve('path-browserify'),
    fs: false, // Disable 'fs' module (not needed in the browser)
  };

  // Add a plugin to provide the 'process' global variable
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  );

  return config;
};