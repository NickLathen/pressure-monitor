const webpack = require('webpack');

module.exports = {
  entry: ['./client/src/index.js'],
  output: {
    filename: 'bundle.js',
    path: './client/build',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=react,presets[]=es2015'
      }
    ],
  }
};
