const webpack = require('webpack'); // eslint-disable-line
const { resolve } = require('path');
const BabiliPlugin = require('babili-webpack-plugin'); // eslint-disable-line
const CompressionPlugin = require('compression-webpack-plugin'); // eslint-disable-line
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line

const jsLoader = () => ({
  test: /\.jsx?$/,
  include: resolve(__dirname, '..', 'src', 'js'),
  use: ['babel-loader'],
});


const output = () => ({
  filename: '[name]',
  path: resolve(__dirname, '..', 'lib/bundle'),
  library: 'TerminalReact',
  libraryTarget: 'umd',
});

const plugins = () => [
  new ExtractTextPlugin('[name]'),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new BabiliPlugin(),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
    minRatio: 0,
  }),
];

const externals = () => ({
  react: 'react',
  'react-dom': 'react-dom',
  'lodash.camelcase': 'lodash.camelcase',
  'lodash.isequal': 'lodash.isequal',
  minimist: 'minimist',
  platform: 'platform',
  'prop-types': 'prop-types',
  'react-object-inspector': 'react-object-inspector',
  'string-similarity': 'string-similarity',
  whatkey: 'whatkey',
});

const entry = () => ({
  'terminal-react.js': './src/js/index.js',
});

module.exports = {
  context: resolve(__dirname, '../'),
  jsLoader,
  output,
  // styleLoader,
  plugins,
  externals,
  entry,
};
