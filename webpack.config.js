'use strict';

const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  devtool: 'eval-source-map',
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'hummm',
    template: 'src/index.ejs'
  })]
};

module.exports = webpackConfig;
