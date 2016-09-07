/* eslint camelcase:0 */
require('dotenv').config({ silent: true });

process.env.BROWSERSLIST_CONFIG = 'browserslist';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnext = require('postcss-cssnext');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const postcssImporter = require('postcss-import');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssNested = require('postcss-nested');
const lost = require('lost');

const rootPath = process.cwd();

const webpackConfig = {

  entry: [
    path.join(rootPath, 'app/main.jsx')
  ],

  output: {
    path: path.join(rootPath, 'dist/'),
    filename: '[name]-[hash].js',
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new StyleLintPlugin({
      configFile: path.join(rootPath, 'config', '.stylelintrc'),
      files: 'app/styles/**/*.pcss'
    })
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
      {
        test: /\.pcss$/,
        exclude: /node_modules/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.(eot|ttf|woff2|woff)$/,
        loader: 'url-loader?prefix=fonts/&context=./app/fonts'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  postcss: (webpackPCss) => [
    postcssImporter({ addDependencyTo: webpackPCss }),
    cssnext,
    lost,
    postcssSimpleVars,
    postcssNested
  ]

};

// Environment configuration
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false
  }));
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
