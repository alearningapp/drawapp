const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Update output filename pattern
      const output = webpackConfig.output;

      // Use content hash for versioning
      output.filename = `static/js/[name].js?v=[contenthash:8]`;
      output.chunkFilename = `static/js/[name].chunk.js?v=[contenthash:8]`;

      // Update MiniCssExtractPlugin options for CSS
      const miniCssExtractPlugin = webpackConfig.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.filename = `static/css/[name].css?v=[contenthash:8]`;
        miniCssExtractPlugin.options.chunkFilename = `static/css/[name].chunk.css?v=[contenthash:8]`;
      }

      // Define a global variable for the content hash
      webpackConfig.plugins.push(
        new DefinePlugin({
          'process.env.VERSION': JSON.stringify('[contenthash:8]'),
        })
      );

      return webpackConfig;
    },
  },
};
