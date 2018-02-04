'use strict';

const path = require('path');

const webpackConfig = require('./webpack.defaults');

webpackConfig.devtool = 'eval-source-map';

module.exports = webpackConfig;
