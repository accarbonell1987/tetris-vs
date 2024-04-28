const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      }
    ]
  },
  plugins: []
};
