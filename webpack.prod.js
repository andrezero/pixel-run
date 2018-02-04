'use strict';

const MinifyPlugin = require('babel-minify-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpackConfig = require('./webpack.defaults');

webpackConfig.plugins.push(new MinifyPlugin());

webpackConfig.plugins.push(new CleanWebpackPlugin(['dist']));

module.exports = webpackConfig;
