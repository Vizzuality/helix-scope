/* eslint camelcase:0 */
require('dotenv').config({ silent: true });

process.env.BROWSERSLIST_CONFIG = 'browserslist';

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const rootPath = process.cwd();
const postcssConfigPath = path.resolve(rootPath, '.postcssrc');
const isProduction = process.env.NODE_ENV === 'production';

const webpackConfig = {
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
        test: /\.(css|pcss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: isProduction }
            },
            {
              loader: 'postcss-loader',
              options: { config: { path: postcssConfigPath } }
            }
          ]
        })
      },
      {
        test: /\.(eot|ttf|woff2|woff)$/,
        loader: 'url-loader?prefix=fonts/&context=./app/fonts'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin(
      isProduction ? '[name]-[hash].css' : '[name].css'
    ),
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

// Environment configuration
if (isProduction) {
  webpackConfig.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false,
        dead_code: true,
        drop_debugger: true,
        drop_console: true
      }
    },
    sourceMap: false
  }));
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
