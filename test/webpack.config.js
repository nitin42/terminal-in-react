const webpack = require('webpack');

module.exports = {
  entry: './test/entry.js',
  output: './test/bundle.js',
  devtool: 'source-map',
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
  plugins: [
    // Better results
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ]
};
