const webpack = require('webpack'); // eslint-disable-line
const { join, resolve } = require('path');
const BabiliPlugin = require('babili-webpack-plugin'); // eslint-disable-line
const CompressionPlugin = require('compression-webpack-plugin'); // eslint-disable-line

const common = {
  exclude: [
    /node_modules/,
    /__tests__/,
    /coverage/,
    /build/,
  ],
};

// , /node_modules\/camelcase/, /node_modules\/chalk/, /node_modules\/string-similarity/, /node_modules\/minimist/

const jsLoader = () => ({
  test: /\.js$/,
  include: [/components/, /node_modules\/args/], // Added module `args` because babel-loader skips everything from node_modules before transpiling the code but we need args to be transpiled along with the components folder.
  use: ['babel-loader'],
});

const styleLoader = () => ({
  test: /\.css$/,
  exclude: common.exclude,
  use: ['style-loader', 'css-loader'],
});

const output = () => ({
  filename: 'terminal.js',
  path: resolve(__dirname, '../build'),
  libraryTarget: 'umd',
  library: 'terminalReact'
});

const plugins = () => [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
    options: {
      context: resolve(__dirname, '../components'),
    },
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
    // Better results
  // new webpack.optimize.UglifyJsPlugin(),
  new BabiliPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
    minRatio: 0,
  })
];

const externals = () => ({
  react: 'react',
  'react-dom': 'react-dom',
  'prop-types': 'prop-types',
  'react-object-inspector': 'react-object-inspector',
  args: 'args',
  camelcase: 'camelcase',
  chalk: 'chalk',
  'lodash.clonedeep': 'lodash.clonedeep',
  'string-similarity': 'string-similarity',
  minimist: 'minimist',
});

const entry = () => ({
  entry: join(__dirname, '../components/index.js'),
});

module.exports = {
  jsLoader,
  output,
  styleLoader,
  plugins,
  externals,
  entry,
};
