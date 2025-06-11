const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.js', // or './src/index.js'
  target: 'node',
  mode: 'development', // or 'production' for deployment
  externals: [nodeExternals()], // ignores node_modules
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'], // add '.ts' if using TypeScript
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // change to /\.js$/ if using JS
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
