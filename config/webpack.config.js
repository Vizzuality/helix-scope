/* eslint camelcase:0 */
require('dotenv').config({ silent: true });

process.env.BROWSERSLIST_CONFIG = 'browserslist';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const rootPath = process.cwd();
const postcssConfigPath = path.resolve(rootPath, '.postcssrc');

const webpackConfigNew = {
  entry: ['./app/main.jsx'],

  output: {
    path: path.join(rootPath, '/dist/'),
    filename: '[name]-[hash].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pcss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { config: { path: postcssConfigPath } }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff2|woff)$/,
        loader: 'url-loader?prefix=fonts/&context=./app/fonts'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.GA': JSON.stringify(process.env.GOOGLE_ANALYTICS)
    }),
    new StyleLintPlugin({
      configFile: path.join(rootPath, '.stylelintrc'),
      files: 'app/styles/**/*.pcss'
    })
  ],

  resolve: {
    modules: [
      rootPath,
      'node_modules'
    ],
    alias: {
      actions: 'app/actions',
      reducers: 'app/reducers',
      components: 'app/components',
      containers: 'app/containers',
      constants: 'app/constants',
      utils: 'app/utils',
      fonts: 'app/fonts'
    },
    extensions: ['.js', '.jsx']
  }
};

const webpackConfig = webpackConfigNew;

// Environment configuration
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false,
    sourceMap: true
  }));
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
