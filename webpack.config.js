const webpack = require('webpack');
const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR = ['react', 'react-dom'];

module.exports = {
  entry: {
    main: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      join(__dirname, 'starter/App.js')
    ],
    vendor: VENDOR
  },
  output: {
    filename: '[name].[hash].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    publicPath: '/',
    historyApiFallback: true,
    hot: true,
    port: '3000',
    host: '127.0.0.1',
    noInfo: true,
    overlay: true,
    clientLogLevel: "none"
  },
  stats: {
    chunks: true,
    chunkModules: true,
    colors: true,
    errors: true,
    errorDetails: true,
    timings: true,
    version: true,
    warnings: true
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /__tests__/, /coverage/],
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      appMountId: 'app'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    })
  ]
};