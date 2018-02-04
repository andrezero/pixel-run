'use strict';

const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'hummm',
    template: 'src/index.ejs'
  })]
};

const CopyWebpackPlugin = require('copy-webpack-plugin');

webpackConfig.plugins.push(new CopyWebpackPlugin([
  { from: 'src/styles', to: 'styles' },
  { from: 'src/assets', to: 'assets' }
]));

module.exports = webpackConfig;
