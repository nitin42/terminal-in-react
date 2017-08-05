const {
  jsLoader,
  output,
  plugins,
  externals,
  entry,
  context,
} = require('./config');

module.exports = {
  context,
  entry: entry(),
  output: output(),
  devtool: 'cheap-module-source-map',
  cache: true,
  module: {
    rules: [jsLoader()],
  },
  target: 'web',
  externals: externals(),
  plugins: plugins(),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },
};
