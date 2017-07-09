const {
  jsLoader,
  styleLoader,
  output,
  plugins,
  externals,
  entry,
} = require('./config');

module.exports = {
  entry: entry(),
  output: output(),
  devtool: 'cheap-module-source-map',
  cache: true,
  module: {
    rules: [jsLoader(), styleLoader()],
  },
  target: 'web',
  externals: externals(),
  plugins: plugins(),
};
