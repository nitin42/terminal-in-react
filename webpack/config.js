const webpack = require('webpack');
const { join, resolve } = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

const common = {
  exclude: [
    /node_modules/,
    /__tests__/,
    /coverage/,
    /build/,
  ]
};

const jsLoader = () => {
  return {
    test: /\.js$/,
    exclude: common.exclude,
    use: ['babel-loader']
  };
};

const styleLoader = () => {
  return {
    test: /\.css$/,
    exclude: common.exclude,
    use: ['style-loader', 'css-loader']
  };
};

let output = () => {
  return {
    filename: 'terminal.js',
    path: resolve(__dirname, '../build'),
    libraryTarget: 'umd',
    library: 'terminalReact',
    publicPath: '/',
    pathinfo: true
  };
};

const plugins = () => {
  return [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: resolve(__dirname, '../components')
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // Better results
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ];
};

const externals = () => {
  return {
    'react': 'react',
    'react-dom': 'react-dom',
    'prop-types': 'prop-types',
    'react-object-inspector': 'react-object-inspector'
  };
};

const entry = () => {
  return {
    entry: join(__dirname, '../components/index.js')
  };
};

module.exports = {
  jsLoader,
  output,
  styleLoader,
  plugins,
  externals,
  entry
};