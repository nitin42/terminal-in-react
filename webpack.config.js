const webpack = require('webpack');
const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: join(__dirname, './components/index.js'),
  output: {
    filename: 'terminal.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'terminalInReact',
    pathinfo: true
  },
  devtool: 'cheap-module-source-map',
  cache: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /__tests__/, /docs/, /coverage/],
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        include: /components/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  target: 'web',
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: resolve(__dirname, './components')
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // Better results
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin([resolve(__dirname, './build')])
  ]
};